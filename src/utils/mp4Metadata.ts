/**
 * Extract MP4 metadata by parsing the moov box from the file
 */

export interface MP4Metadata {
  duration?: number;
  error?: string;
}

async function fetchMP4Range(
  url: string,
  start: number,
  end?: number,
  token?: string,
): Promise<ArrayBuffer> {
  const headers: Record<string, string> = {
    Range: end !== undefined ? `bytes=${start}-${end}` : `bytes=${start}-`,
  };
  if (token) {
    headers.Authorization = `DGTK ${token}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok && res.status !== 206) {
    throw new Error(`Failed to fetch range: ${res.status}`);
  }
  return res.arrayBuffer();
}

function findBoxOffset(view: DataView, signature: number, startOffset = 0): number {
  for (let i = startOffset; i < view.byteLength - 4; i += 1) {
    if (view.getUint32(i) === signature) {
      return i;
    }
  }
  return -1;
}

function parseMvhdDuration(view: DataView, mvhdOffset: number): number {
  try {
    // mvhdOffset points to 'mvhd' signature (the type field)
    // Box structure: [size:4][type:4]['mvhd' starts here][version:1][flags:3][content]
    // So relative to mvhdOffset (which is where 'mvhd' begins):
    // [0-3] 'mvhd' (at mvhdOffset)
    // [4] version
    // [5-7] flags
    // [8-11] creation time
    // [12-15] modification time
    // [16-19] timescale
    // [20-23] duration (version 0)
    // [20-27] duration (version 1)

    const version = view.getUint8(mvhdOffset + 4);
    const timescale = view.getUint32(mvhdOffset + 16);

    let duration: number;
    if (version === 0) {
      duration = view.getUint32(mvhdOffset + 20);
    } else if (version === 1) {
      // For version 1, duration is 64-bit
      const hi = view.getUint32(mvhdOffset + 20);
      const lo = view.getUint32(mvhdOffset + 24);
      duration = (hi * 0x100000000) + lo;
    } else {
      console.warn('[parseMvhdDuration] Unsupported version:', version);
      return 0;
    }

    if (timescale === 0) {
      console.warn('[parseMvhdDuration] Invalid timescale: 0');
      return 0;
    }

    const result = duration / timescale;
    console.log('[parseMvhdDuration] Parsed successfully', {
      version,
      timescale,
      duration,
      result,
    });
    return result;
  } catch (err) {
    console.error('[parseMvhdDuration] Error:', err);
    return 0;
  }
}

export async function extractMP4Metadata(
  streamUrl: string,
  fileSize: number,
  token?: string,
): Promise<MP4Metadata> {
  try {
    if (!fileSize || fileSize <= 0) {
      return { error: 'Invalid file size' };
    }

    console.log('[extractMP4Metadata] Starting', { streamUrl, fileSize });

    // Fetch last portion of file where moov box typically resides
    // MP4 structure: ftyp, mdat (media data), moov (metadata) - moov is usually at end
    const searchSize = Math.min(10 * 1024 * 1024, fileSize); // up to 10MB
    const fetchStart = Math.max(0, fileSize - searchSize);

    const buffer = await fetchMP4Range(streamUrl, fetchStart, fileSize - 1, token);
    const view = new DataView(buffer);

    console.log('[extractMP4Metadata] Fetched range', {
      fetchStart,
      fetchEnd: fileSize - 1,
      bufferSize: buffer.byteLength,
    });

    // Search for moov box: signature is 0x6D6F6F76 ('moov')
    const moovSig = 0x6d6f6f76;
    const moovOffset = findBoxOffset(view, moovSig);

    if (moovOffset === -1) {
      console.warn('[extractMP4Metadata] moov box not found in fetched range');
      return { error: 'moov box not found' };
    }

    console.log('[extractMP4Metadata] Found moov box at offset', { moovOffset });

    // Search for mvhd box inside moov: signature is 0x6D766864 ('mvhd')
    const mvhdSig = 0x6d766864;
    const mvhdOffset = findBoxOffset(view, mvhdSig, moovOffset);

    if (mvhdOffset === -1) {
      console.warn('[extractMP4Metadata] mvhd box not found');
      return { error: 'mvhd box not found' };
    }

    console.log('[extractMP4Metadata] Found mvhd box at offset', { mvhdOffset });

    const duration = parseMvhdDuration(view, mvhdOffset);

    if (duration <= 0) {
      return { error: 'Invalid duration parsed' };
    }

    console.log('[extractMP4Metadata] Successfully extracted duration', { duration });
    return { duration };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('[extractMP4Metadata] Error:', errorMsg);
    return { error: errorMsg };
  }
}
