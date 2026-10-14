import { ActionContext, ActionTree } from 'vuex';
import { storageClient } from '@/http-client';

import { snakeToCamel } from '@/utils';

import { RootStateI } from '../state';
import { VideoStreamStateI } from './state';
import { FileI } from '../files/state';

export interface StreamV2ResponseI {
  url: string;
  m3u8Url: string;
  relativeUrl: string;
  presignedUrl?: string;
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

  async getStreamV2(
    _context: ActionContext<VideoStreamStateI, RootStateI>,
    payload: Pick<FileI, 'id' | 'contentType'>,
  ): Promise<StreamV2ResponseI> {
    if (!payload.id) {
      throw new Error('file id is required');
    }
    const token = localStorage.getItem('token');
    const tokenQuery = token ? `?token=${encodeURIComponent(token)}` : '';
    const { data } = await storageClient.get(`/api/files/${payload.id}/streamv2${tokenQuery}`);
    return snakeToCamel(data) as StreamV2ResponseI;
  },

  async getVideoMetadata(
    _context: ActionContext<VideoStreamStateI, RootStateI>,
    payload: Pick<FileI, 'id' | 'contentType'>,
  ) {
    if (!payload.contentType?.startsWith('video/')) {
      // Match server behavior: respond with a rejected Error indicating bad request
      const err: any = new Error('file is not a video');
      err.response = { status: 400, data: { error: 'file is not a video' } };
      return Promise.reject(err);
    }

    const { data } = await storageClient.get(`/api/videos/${payload.id}/metadata`);
    console.log('getVideoMetadata', JSON.stringify(data, null, 2));
    _context.commit('SET_VIDEOSTREAM_METADATA', snakeToCamel(data));
    return data;
  },
};
