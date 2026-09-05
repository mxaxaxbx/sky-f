import { VideoMetadataI } from '@/store/videostream/state';
/* eslint-disable no-await-in-loop, no-param-reassign, no-empty */
/* Utility to stream a video to a HTMLVideoElement using MediaSource Extensions (MSE).
 * Usage:
 *   const controller = await streamWithMSE(videoEl, streamUrl, fileSize, { chunkSize, mimeCodec });
 *   // later: controller.abort();
 */

export type StreamController = {
  abort: () => void;
};

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `DGTK ${token}` } : {};
}

async function fetchWithAuth(url: string, init: RequestInit = {}): Promise<Response> {
  const baseHeaders = init.headers instanceof Headers
    ? Object.fromEntries(init.headers.entries())
    : init.headers ?? {};

  return fetch(url, {
    ...init,
    credentials: 'include',
    headers: {
      ...baseHeaders,
      ...getAuthHeaders(),
    },
  });
}

export async function streamWithMSE(
  videoEl: HTMLVideoElement,
  streamUrl: string,
  fileSize?: number,
  opts?: { chunkSize?: number; mimeCodec?: string },
  metadata?: VideoMetadataI,
): Promise<StreamController> {
  const chunkSize = metadata?.chunkSize ?? opts?.chunkSize ?? 1024 * 1024; // 1MB default
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
    return new Promise<void>((resolve, reject) => {
      if (!sb.updating) {
        resolve();
        return;
      }

      const listeners: {
        onEnd?: () => void;
        onErr?: () => void;
      } = {};

      function removeListeners() {
        sb.removeEventListener('updateend', listeners.onEnd as EventListener);
        sb.removeEventListener('error', listeners.onErr as EventListener);
      }

      listeners.onEnd = () => {
        removeListeners();
        resolve();
      };
      listeners.onErr = () => {
        removeListeners();
        reject(new Error('SourceBuffer append error'));
      };

      sb.addEventListener('updateend', listeners.onEnd as EventListener);
      sb.addEventListener('error', listeners.onErr as EventListener);
    });
  }

  async function onSourceOpen() {
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

        const fallbackResponse = await fetchWithAuth(streamUrl);
        if (!fallbackResponse.ok) {
          throw new Error(`Fallback fetch failed with ${fallbackResponse.status}`);
        }
        const blob = await fallbackResponse.blob();
        videoElement.src = URL.createObjectURL(blob);
        return;
      }

      sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);

      // if fileSize known, use range requests to fetch progressively
      if (typeof fileSize === 'number' && fileSize > 0 && sourceBuffer) {
        let isFetching = false;
        let nextChunkIndex = 0;
        const totalSize = fileSize;
        const BUFFER_AHEAD_CHUNKS = 2;

        const fetchChunk = async (chunkIndex: number): Promise<void> => {
          const start = chunkIndex * chunkSize;
          const end = Math.min(start + chunkSize - 1, totalSize - 1);

          const res = await fetchWithAuth(streamUrl, {
            headers: { Range: `bytes=${start}-${end}` },
            signal: abortController.signal,
          });

          if (!res.ok && res.status !== 206) {
            throw new Error(`Unexpected response ${res.status} from server`);
          }

          const chunk = await res.arrayBuffer();
          if (sourceBuffer && !abortController.signal.aborted) {
            await waitForUpdateEnd(sourceBuffer);
            sourceBuffer.appendBuffer(new Uint8Array(chunk));
          }
        };

        const fetchMoreChunks = async (): Promise<void> => {
          if (isFetching || abortController.signal.aborted) return;
          isFetching = true;

          try {
            // Calculate how many chunks we should have buffered based on playback position
            const currentTime = videoElement.currentTime || 0;
            const duration = videoElement.duration || totalSize / 1024 / 1024 / 5; // rough estimate if duration unknown
            const bytesPerSecond = duration > 0 ? totalSize / duration : 1024 * 1024;
            const currentBytePos = currentTime * bytesPerSecond;
            const targetBytePos = currentBytePos + BUFFER_AHEAD_CHUNKS * chunkSize;

            // Fetch chunks up to target position
            let chunkIndex = nextChunkIndex;
            while (
              chunkIndex * chunkSize < targetBytePos
              && chunkIndex * chunkSize < totalSize
              && !abortController.signal.aborted
            ) {
              await fetchChunk(chunkIndex);
              chunkIndex += 1;
            }
            nextChunkIndex = chunkIndex;

            // If we've fetched everything, signal end of stream
            if (nextChunkIndex * chunkSize >= totalSize && mediaSource.readyState === 'open') {
              try {
                mediaSource.endOfStream();
              } catch {
                // ignore if already ended
              }
            }
          } catch (err) {
            console.error('Chunk fetch error:', err);
          } finally {
            isFetching = false;
          }
        };

        // Fetch initial chunk to start playback
        const initialFetch = async (): Promise<void> => {
          try {
            if (!abortController.signal.aborted) {
              await fetchChunk(0);
              nextChunkIndex = 1;
            }
          } catch (err) {
            console.error('Initial chunk fetch error:', err);
          }
        };

        await initialFetch();

        // Continue fetching as video plays
        const timeUpdateHandler = (): void => {
          fetchMoreChunks().catch(() => {
            // ignore
          });
        };
        videoElement.addEventListener('timeupdate', timeUpdateHandler as EventListener);

        // Fetch more when video seeks
        const seekHandler = (): void => {
          fetchMoreChunks().catch(() => {
            // ignore
          });
        };
        videoElement.addEventListener('seeking', seekHandler as EventListener);

        // Cleanup on end
        const endedHandler = (): void => {
          videoElement.removeEventListener('timeupdate', timeUpdateHandler);
          videoElement.removeEventListener('seeking', seekHandler);
          videoElement.removeEventListener('ended', endedHandler);
        };
        videoElement.addEventListener('ended', endedHandler);
      } else {
        // file size unknown: fetch entire resource and append progressively
        const res = await fetchWithAuth(streamUrl, { signal: abortController.signal });
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

        try {
          const fallbackResponse = await fetchWithAuth(streamUrl);
          if (fallbackResponse.ok) {
            const blob = await fallbackResponse.blob();
            videoElement.src = URL.createObjectURL(blob);
            return;
          }
        } catch (fallbackErr) {
          console.warn('Auth fallback fetch failed:', fallbackErr);
        }

        videoElement.src = streamUrl;
      }
    }
  }

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

  mediaSource.addEventListener('sourceopen', onSourceOpen);

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
