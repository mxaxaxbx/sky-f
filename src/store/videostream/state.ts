// export type VideoStreamStateI = Record<string, never>;

export interface VideoMetadataI {
  fileSize: number;
  format: string;
  chunkSize?: number;
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
