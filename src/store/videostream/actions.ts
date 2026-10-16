import { ActionContext, ActionTree } from 'vuex';
import { storageClient } from '@/http-client';

import { snakeToCamel } from '@/utils';

import { RootStateI } from '../state';
import { VideoMetadataI, VideoStreamStateI } from './state';
import { FileI } from '../files/state';

interface VideoValidationError extends Error {
  response?: {
    status: number;
    data: {
      error: string;
    };
  };
}

function parseDurationSeconds(rawDuration: unknown): number | undefined {
  if (typeof rawDuration === 'number' && Number.isFinite(rawDuration) && rawDuration > 0) {
    return rawDuration;
  }
  if (typeof rawDuration === 'string') {
    const trimmed = rawDuration.trim();
    if (!trimmed || trimmed.includes('unknown')) {
      return undefined;
    }
    const numeric = Number(trimmed.replace(/s$/i, ''));
    if (Number.isFinite(numeric) && numeric > 0) {
      return numeric;
    }
    const parts = trimmed.split(':').map(Number);
    if (parts.length === 3 && parts.every((p) => Number.isFinite(p))) {
      const total = parts[0] * 3600 + parts[1] * 60 + parts[2];
      return total > 0 ? total : undefined;
    }
    if (parts.length === 2 && parts.every((p) => Number.isFinite(p))) {
      const total = parts[0] * 60 + parts[1];
      return total > 0 ? total : undefined;
    }
  }
  return undefined;
}

export const actions: ActionTree<VideoStreamStateI, RootStateI> = {
  getStreamUrl(
    _context: ActionContext<VideoStreamStateI, RootStateI>,
    payload: Pick<FileI, 'id' | 'contentType'>,
  ): string {
    if (!payload.contentType?.startsWith('video/')) {
      return '';
    }
    const { VUE_APP_DG_SKY_SVC } = process.env;

    return `${VUE_APP_DG_SKY_SVC}/api/files/${payload.id}/stream`;
  },

  async getVideoMetadata(
    _context: ActionContext<VideoStreamStateI, RootStateI>,
    payload: Pick<FileI, 'id' | 'contentType'>,
  ) {
    if (!payload.contentType?.startsWith('video/')) {
      // Match server behavior: respond with a rejected Error indicating bad request
      const err: VideoValidationError = new Error('file is not a video');
      err.response = { status: 400, data: { error: 'file is not a video' } };
      return Promise.reject(err);
    }

    const { data } = await storageClient.get(`/api/videos/${payload.id}/metadata`);
    console.log('getVideoMetadata', JSON.stringify(data, null, 2));
    const parsed = snakeToCamel(data) as VideoMetadataI;
    const normalizedDuration = parseDurationSeconds(parsed?.duration);
    const normalized: VideoMetadataI = {
      ...parsed,
      fileSize: Number(parsed?.fileSize) || 0,
      chunkSize: parsed?.chunkSize ? Number(parsed.chunkSize) : undefined,
      duration: normalizedDuration,
    };
    _context.commit('SET_VIDEOSTREAM_METADATA', normalized);
    return normalized;
  },
};
