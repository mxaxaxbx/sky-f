/* eslint-disable no-await-in-loop, no-param-reassign, no-empty */
/* Utility to stream a video to a HTMLVideoElement using MediaSource Extensions (MSE).
 * Usage:
 *   const controller = await streamWithMSE(videoEl, streamUrl, fileSize, { chunkSize, mimeCodec });
 *   // later: controller.abort();
 */

export type StreamController = {
  abort: () => void;
};

export async function streamWithMSE(
  videoEl: HTMLVideoElement,
  streamUrl: string,
  fileSize?: number,
  opts?: { chunkSize?: number; mimeCodec?: string },
): Promise<StreamController> {
  const chunkSize = opts?.chunkSize ?? 1024 * 1024; // 1MB default
  const mimeCodec = opts?.mimeCodec ?? 'video/mp4; codecs="avc1.42E01E,mp4a.40.2"';

  if (!('MediaSource' in window)) {
    throw new Error('MediaSource API is not available in this browser');
  }

  const mediaSource = new MediaSource();
  const abortController = new AbortController();

  // attach media source to video element
  const videoElement = videoEl;
  videoElement.src = URL.createObjectURL(mediaSource);

  let sourceBuffer: SourceBuffer | null = null;

  function waitForUpdateEnd(sb: SourceBuffer) {
    return new Promise<void>((resolve) => {
      if (sb.updating) {
        const onEnd = () => {
          sb.removeEventListener('updateend', onEnd);
          resolve();
        };
        sb.addEventListener('updateend', onEnd);
      } else {
        resolve();
      }
    });
  }

  const onSourceOpen = async () => {
    try {
      // try to create a SourceBuffer for the given codec
      if (!mediaSource || mediaSource.readyState === 'closed') return;

      if (!MediaSource.isTypeSupported(mimeCodec)) {
        // Fallback: let the element try native playback of the returned stream
        // by clearing the src and pointing directly to the URL.
        // (This will happen when codec is not supported.)
        try {
          URL.revokeObjectURL(videoElement.src);
        } catch (e) {
          // ignore
        }
        videoElement.src = streamUrl;
        return;
      }

      sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);

      // if fileSize known, use range requests to fetch progressively
      if (typeof fileSize === 'number' && fileSize > 0) {
        for (let start = 0; start < fileSize; start += chunkSize) {
          if (abortController.signal.aborted) break;
          const end = Math.min(start + chunkSize - 1, fileSize - 1);
          const res = await fetch(streamUrl, {
            headers: { Range: `bytes=${start}-${end}` },
            signal: abortController.signal,
            credentials: 'include',
          });

          if (!res.ok && res.status !== 206) {
            throw new Error(`Unexpected response ${res.status} from server`);
          }

          const chunk = await res.arrayBuffer();

          // append when buffer isn't updating
          await waitForUpdateEnd(sourceBuffer);
          sourceBuffer.appendBuffer(new Uint8Array(chunk));
        }
      } else {
        // file size unknown: fetch entire resource and append progressively
        const res = await fetch(streamUrl, { signal: abortController.signal, credentials: 'include' });
        if (!res.ok) throw new Error(`Fetch failed with ${res.status}`);

        // Try to stream via reader and append in slices
        const reader = res.body?.getReader();
        if (!reader) {
          const ab = await res.arrayBuffer();
          await waitForUpdateEnd(sourceBuffer);
          sourceBuffer.appendBuffer(new Uint8Array(ab));
        } else {
          let done = false;
          while (!done && !abortController.signal.aborted) {
            const { value, done: rdone } = await reader.read();
            done = rdone;
            if (value && value.length) {
              await waitForUpdateEnd(sourceBuffer);
              sourceBuffer.appendBuffer(value);
            }
          }
        }
      }

      // signal end of stream if not aborted
      if (!abortController.signal.aborted && mediaSource.readyState === 'open') {
        try {
          mediaSource.endOfStream();
        } catch (e) {
          // ignore if already ended
        }
      }
    } catch (err) {
      // on error, try falling back to direct src
      console.error('MSE streaming error:', err);
      if (!abortController.signal.aborted) {
        try {
          URL.revokeObjectURL(videoElement.src);
        } catch (e) {
          // ignore
        }
        videoElement.src = streamUrl;
      }
    }
  };

  mediaSource.addEventListener('sourceopen', onSourceOpen);

  const cleanup = () => {
    try {
      mediaSource.removeEventListener('sourceopen', onSourceOpen);
    } catch {}
    try {
      if (sourceBuffer && mediaSource.readyState === 'open') {
        if (sourceBuffer.updating) {
          // best-effort: wait a moment then remove
        }
        mediaSource.removeSourceBuffer(sourceBuffer);
      }
    } catch {}
    try {
      try {
        URL.revokeObjectURL(videoElement.src);
      } catch (e) {
        // ignore
      }
    } catch {}
  };

  return {
    abort: () => {
      abortController.abort();
      try {
        if (mediaSource.readyState === 'open') mediaSource.endOfStream();
      } catch {}
      cleanup();
    },
  };
}

// exported as named export `streamWithMSE`
