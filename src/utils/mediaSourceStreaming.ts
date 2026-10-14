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

  console.log('[fetchWithAuth] Starting fetch', { url, rangeHeader: (init.headers as any)?.Range });
  const startTime = performance.now();
  const response = await fetch(url, {
    ...init,
    credentials: 'include',
    headers: {
      ...baseHeaders,
      ...getAuthHeaders(),
    },
  });
  const duration = performance.now() - startTime;
  console.log('[fetchWithAuth] Fetch completed', {
    url,
    status: response.status,
    ok: response.ok,
    durationMs: duration,
  });
  return response;
}

export function resolveMimeCodec(
  metadata?: VideoMetadataI,
  file?: { name?: string; contentType?: string },
  explicitCodec?: string,
): string {
  if (explicitCodec) {
    return explicitCodec;
  }

  const format = (metadata?.format || '').toLowerCase();
  const container = (metadata?.container || '').toLowerCase();
  const contentType = (file?.contentType || '').toLowerCase();
  const fileName = (file?.name || '').toLowerCase();

  const isWebm = (
    format.includes('webm')
    || container.includes('webm')
    || contentType.includes('webm')
    || fileName.endsWith('.webm')
  );

  const isOgg = (
    format.includes('ogg')
    || contentType.includes('ogg')
    || fileName.endsWith('.ogg')
    || fileName.endsWith('.ogv')
  );

  const vCodecRaw = (metadata?.videoCodec || metadata?.codec || '').toLowerCase();
  const aCodecRaw = (metadata?.audioCodec || '').toLowerCase();

  const candidates: string[] = [];

  if (isWebm) {
    let vCodec = 'vp8';
    if (vCodecRaw.includes('vp9')) vCodec = 'vp9';
    else if (vCodecRaw.includes('vp8')) vCodec = 'vp8';
    else if (vCodecRaw.includes('av1') || vCodecRaw.includes('av01')) vCodec = 'av01.0.08M.08';
    else if (vCodecRaw) vCodec = vCodecRaw;

    let aCodec = '';
    if (aCodecRaw.includes('vorbis')) aCodec = 'vorbis';
    else if (aCodecRaw.includes('opus')) aCodec = 'opus';
    else if (aCodecRaw) aCodec = aCodecRaw;

    if (vCodec && aCodec) {
      candidates.push(`video/webm; codecs="${vCodec}, ${aCodec}"`);
      candidates.push(`video/webm; codecs="${vCodec},${aCodec}"`);
    }
    if (vCodec) {
      candidates.push(`video/webm; codecs="${vCodec}"`);
    }
    candidates.push('video/webm');
  } else if (isOgg) {
    candidates.push('video/ogg; codecs="theora, vorbis"');
    candidates.push('video/ogg; codecs="theora"');
    candidates.push('video/ogg');
  } else {
    // Default MP4 / generic
    let vCodec = 'avc1.42E01E';
    if (vCodecRaw.includes('avc') || vCodecRaw.includes('h264') || vCodecRaw.includes('264')) {
      vCodec = 'avc1.42E01E';
    } else if (vCodecRaw.includes('hevc') || vCodecRaw.includes('h265') || vCodecRaw.includes('265')) {
      vCodec = 'hev1.1.6.L93.B0';
    } else if (vCodecRaw.includes('vp9')) {
      vCodec = 'vp09.00.10.08';
    } else if (vCodecRaw.includes('av1') || vCodecRaw.includes('av01')) {
      vCodec = 'av01.0.08M.08';
    }

    let aCodec = 'mp4a.40.2';
    if (aCodecRaw.includes('mp3')) {
      aCodec = 'mp4a.40.34';
    } else if (aCodecRaw.includes('aac')) {
      aCodec = 'mp4a.40.2';
    } else if (aCodecRaw.includes('opus')) {
      aCodec = 'opus';
    }

    if (vCodec === 'avc1.42E01E') {
      candidates.push(`video/mp4; codecs="avc1.42E01E,${aCodec}"`);
      candidates.push(`video/mp4; codecs="avc1.4D401F,${aCodec}"`);
      candidates.push(`video/mp4; codecs="avc1.640028,${aCodec}"`);
      candidates.push('video/mp4; codecs="avc1.42E01E"');
    } else {
      candidates.push(`video/mp4; codecs="${vCodec},${aCodec}"`);
      candidates.push(`video/mp4; codecs="${vCodec}"`);
    }
    candidates.push('video/mp4');
  }

  if (typeof MediaSource !== 'undefined' && typeof MediaSource.isTypeSupported === 'function') {
    for (let i = 0; i < candidates.length; i += 1) {
      if (MediaSource.isTypeSupported(candidates[i])) {
        return candidates[i];
      }
    }
  }

  return candidates[0] || 'video/mp4; codecs="avc1.42E01E,mp4a.40.2"';
}

export async function streamWithMSE(
  videoEl: HTMLVideoElement,
  streamUrl: string,
  fileSize?: number,
  opts?: { chunkSize?: number; mimeCodec?: string },
  metadata?: VideoMetadataI,
  file?: { name?: string; contentType?: string },
): Promise<StreamController> {
  const mimeCodec = resolveMimeCodec(metadata, file, opts?.mimeCodec);
  console.log('[streamWithMSE] Starting', {
    streamUrl,
    fileSize,
    hasMetadata: !!metadata,
    mimeCodec,
  });
  const chunkSize = metadata?.chunkSize ?? opts?.chunkSize ?? 1024 * 1024; // 1MB default

  if (!('MediaSource' in window)) {
    throw new Error('MediaSource API is not available in this browser');
  }

  const mediaSource = new MediaSource();
  const abortController = new AbortController();

  // attach media source to video element
  const videoElement = videoEl;
  const mediasourceBlobUrl = URL.createObjectURL(mediaSource);
  console.log('[streamWithMSE] Created MediaSource blob URL', { blobUrl: mediasourceBlobUrl });
  videoElement.src = mediasourceBlobUrl;

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
      // Set metadata duration if available so browser computes actual duration immediately
      if (metadata?.duration && typeof metadata.duration === 'number' && Number.isFinite(metadata.duration) && metadata.duration > 0) {
        console.log('[onSourceOpen] Setting MediaSource duration from metadata', { duration: metadata.duration });
        try {
          mediaSource.duration = metadata.duration;
        } catch (durErr) {
          console.warn('[onSourceOpen] Could not set MediaSource duration:', durErr);
        }
      }

      // try to create a SourceBuffer for the given codec
      if (!mediaSource || mediaSource.readyState === 'closed') return;

      if (!MediaSource.isTypeSupported(mimeCodec)) {
        console.log('[onSourceOpen] Codec not supported, using fallback', { mimeCodec });
        // Fallback: let the element try native playback of the returned stream
        // by clearing the src and pointing directly to the URL.
        // (This will happen when codec is not supported.)
        try {
          URL.revokeObjectURL(videoElement.src);
        } catch (e) {
          // ignore
        }

        if (fileSize && fileSize > 50 * 1024 * 1024) {
          throw new Error(`Codec ${mimeCodec} not supported in MSE and file too large for in-memory blob fallback (${fileSize} bytes)`);
        }

        const fallbackResponse = await fetchWithAuth(streamUrl);
        if (!fallbackResponse.ok) {
          throw new Error(`Fallback fetch failed with ${fallbackResponse.status}`);
        }
        const blob = await fallbackResponse.blob();
        console.log('[onSourceOpen] Fallback blob created', { blobSize: blob.size, blobType: blob.type });
        const blobUrl = URL.createObjectURL(blob);
        console.log('[onSourceOpen] Fallback blob URL created', { blobUrl });
        videoElement.src = blobUrl;
        return;
      }

      sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
      console.log('[onSourceOpen] SourceBuffer created', { mimeCodec });

      // if fileSize known, use range requests to fetch progressively
      if (typeof fileSize === 'number' && fileSize > 0 && sourceBuffer) {
        console.log('[onSourceOpen] Using chunked fetching with range requests', { fileSize, chunkSize });
        let isFetching = false;
        let nextChunkIndex = 0;
        const totalSize = fileSize;
        const BUFFER_AHEAD_CHUNKS = 2;

        const fetchChunk = async (chunkIndex: number): Promise<void> => {
          const start = chunkIndex * chunkSize;
          const end = Math.min(start + chunkSize - 1, totalSize - 1);
          const range = `bytes=${start}-${end}`;

          console.log('[fetchChunk] Fetching chunk', {
            chunkIndex,
            start,
            end,
            range,
          });
          const res = await fetchWithAuth(streamUrl, {
            headers: {
              Range: range,
            },
            signal: abortController.signal,
          });

          if (!res.ok && res.status !== 206) {
            throw new Error(`Unexpected response ${res.status} from server`);
          }

          const chunk = await res.arrayBuffer();
          console.log('[fetchChunk] Chunk data received', { chunkIndex, size: chunk.byteLength });
          if (sourceBuffer && !abortController.signal.aborted && mediaSource.readyState === 'open') {
            try {
              await waitForUpdateEnd(sourceBuffer);
              sourceBuffer.appendBuffer(new Uint8Array(chunk));
              console.log('[fetchChunk] Chunk appended to sourceBuffer', { chunkIndex });
            } catch (err) {
              console.warn('[fetchChunk] Failed to append chunk (sourceBuffer may have been removed)', {
                chunkIndex,
                error: (err as Error).message,
              });
              // SourceBuffer was likely removed during cleanup, abort further operations
              if (!abortController.signal.aborted) {
                abortController.abort();
              }
            }
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

        // Fetch initial chunks to start playback
        const initialFetch = async (): Promise<void> => {
          try {
            const initialChunkCount = Math.min(1, Math.ceil(totalSize / chunkSize));
            console.log('[initialFetch] Starting', { initialChunkCount, totalSize });
            for (let i = 0; i < initialChunkCount; i += 1) {
              if (abortController.signal.aborted) break;
              await fetchChunk(i);
              nextChunkIndex = i + 1;
            }
            console.log('[initialFetch] Complete', { fetchedChunks: nextChunkIndex });
          } catch (err) {
            console.error('Initial chunk fetch error:', err);
          }
        };

        await initialFetch();

        // If entire file was fetched in initial pass, signal end of stream
        if (nextChunkIndex * chunkSize >= totalSize && mediaSource.readyState === 'open') {
          try {
            if (sourceBuffer) {
              await waitForUpdateEnd(sourceBuffer);
            }
            mediaSource.endOfStream();
            console.log('[streamWithMSE] End of stream signaled after initial fetch');
          } catch (err) {
            console.warn('[streamWithMSE] Error signaling end of stream, attempting fallback:', err);
            if (fileSize && fileSize > 50 * 1024 * 1024) {
              throw err;
            }
            // SourceBuffer error occurred, fall back to direct blob playback
            try {
              URL.revokeObjectURL(videoElement.src);
              abortController.abort();
            } catch (e) {
              // ignore
            }
            const fallbackResponse = await fetchWithAuth(streamUrl);
            if (fallbackResponse.ok) {
              const blob = await fallbackResponse.blob();
              const blobUrl = URL.createObjectURL(blob);
              videoElement.src = blobUrl;
              console.log('[streamWithMSE] Fallback blob URL set successfully');
              return;
            }
            throw err;
          }
        }

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
        console.log('[onSourceOpen] No fileSize, fetching entire resource');
        // file size unknown: fetch entire resource and append progressively
        const res = await fetchWithAuth(streamUrl, { signal: abortController.signal });
        if (!res.ok) throw new Error(`Fetch failed with ${res.status}`);

        // Try to stream via reader and append in slices
        const reader = res.body?.getReader();
        if (!reader) {
          console.log('[onSourceOpen] No reader available, fetching as arrayBuffer');
          const ab = await res.arrayBuffer();
          console.log('[onSourceOpen] ArrayBuffer received', { size: ab.byteLength });
          if (sourceBuffer && mediaSource.readyState === 'open') {
            try {
              await waitForUpdateEnd(sourceBuffer);
              sourceBuffer.appendBuffer(new Uint8Array(ab));
              console.log('[onSourceOpen] ArrayBuffer appended to sourceBuffer');
            } catch (err) {
              console.warn('[onSourceOpen] Failed to append arrayBuffer', { error: (err as Error).message });
              throw err;
            }
          }
        } else {
          console.log('[onSourceOpen] Streaming via reader');
          let done = false;
          let chunkCount = 0;
          while (!done && !abortController.signal.aborted) {
            const { value, done: rdone } = await reader.read();
            done = rdone;
            if (value && value.length) {
              chunkCount += 1;
              console.log('[onSourceOpen] Reader chunk', { chunkNumber: chunkCount, size: value.length });
              if (sourceBuffer && mediaSource.readyState === 'open') {
                try {
                  await waitForUpdateEnd(sourceBuffer);
                  sourceBuffer.appendBuffer(value);
                } catch (err) {
                  console.warn('[onSourceOpen] Failed to append reader chunk', {
                    chunkNumber: chunkCount,
                    error: (err as Error).message,
                  });
                  // SourceBuffer was likely removed, abort further operations
                  break;
                }
              } else {
                break;
              }
            }
          }
          console.log('[onSourceOpen] Reader streaming complete', { totalChunks: chunkCount });
        }

        // signal end of stream only for non-chunked case
        if (!abortController.signal.aborted && mediaSource.readyState === 'open') {
          try {
            if (sourceBuffer) {
              await waitForUpdateEnd(sourceBuffer);
            }
            console.log('[onSourceOpen] Signaling end of stream');
            mediaSource.endOfStream();
            console.log('[onSourceOpen] End of stream signaled');
          } catch (e) {
            console.log('[onSourceOpen] Error signaling end of stream (may already be ended)', { error: e });
            // ignore if already ended
          }
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

        if (fileSize && fileSize > 50 * 1024 * 1024) {
          throw err;
        }

        try {
          console.log('[onSourceOpen] Error recovery: attempting blob fallback');
          const fallbackResponse = await fetchWithAuth(streamUrl);
          if (fallbackResponse.ok) {
            const blob = await fallbackResponse.blob();
            console.log('[onSourceOpen] Error recovery blob created', { blobSize: blob.size, blobType: blob.type });
            const blobUrl = URL.createObjectURL(blob);
            console.log('[onSourceOpen] Error recovery blob URL created', { blobUrl });
            videoElement.src = blobUrl;
            return;
          }
        } catch (fallbackErr) {
          console.warn('Auth fallback fetch failed:', fallbackErr);
        }

        console.log('[onSourceOpen] All blob fallbacks failed, using direct streamUrl');
        videoElement.src = streamUrl;
      }
    }
  }

  const onVideoElementError = async () => {
    console.warn('[streamWithMSE] videoElement error event triggered, attempting blob fallback', videoElement.error);
    if (!abortController.signal.aborted) {
      abortController.abort();
      if (fileSize && fileSize > 50 * 1024 * 1024) {
        console.warn('[streamWithMSE] File too large for in-memory blob error recovery');
        return;
      }
      try {
        URL.revokeObjectURL(videoElement.src);
      } catch (e) {
        // ignore
      }
      try {
        const fallbackResponse = await fetchWithAuth(streamUrl);
        if (fallbackResponse.ok) {
          const blob = await fallbackResponse.blob();
          const blobUrl = URL.createObjectURL(blob);
          videoElement.src = blobUrl;
          console.log('[streamWithMSE] Fallback blob URL set after videoElement error');
        }
      } catch (fbErr) {
        console.error('[streamWithMSE] Fallback on videoElement error failed', fbErr);
      }
    }
  };
  videoElement.addEventListener('error', onVideoElementError, { once: true });

  const cleanup = () => {
    try {
      videoElement.removeEventListener('error', onVideoElementError);
    } catch {}
    try {
      mediaSource.removeEventListener('sourceopen', onSourceOpen);
    } catch {}
    try {
      if (sourceBuffer && mediaSource.readyState === 'open') {
        const sb = sourceBuffer;
        // Wait for any pending updates to complete before removing
        if (sb.updating) {
          sb.addEventListener('updateend', () => {
            try {
              mediaSource.removeSourceBuffer(sb);
            } catch {}
          }, { once: true });
        } else {
          mediaSource.removeSourceBuffer(sb);
        }
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
      console.log('[streamWithMSE.abort] Aborting stream');
      abortController.abort();
      try {
        if (mediaSource.readyState === 'open') mediaSource.endOfStream();
      } catch {}
      cleanup();
      console.log('[streamWithMSE.abort] Abort complete');
    },
  };
}

// exported as named export `streamWithMSE`
