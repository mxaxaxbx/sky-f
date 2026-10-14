// export type VideoStreamStateI = Record<string, never>;

export interface VideoMetadataI {
  fileSize: number;
  format: string;
  chunkSize?: number;
  duration?: number;
  container?: string;
  codec?: string;
  videoCodec?: string;
  audioCodec?: string;
  bitrate?: string;
  resolution?: string;
  profile?: string;
  pixelFormat?: string;
  frameRate?: string;
}

export interface VideoStreamStateI {
  record: Record<string, never>;
  metadata: VideoMetadataI;
}

export const state: VideoStreamStateI = {
  record: {},
  metadata: {
    fileSize: 0,
    format: '',
  },
};
