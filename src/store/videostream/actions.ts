import { ActionContext, ActionTree } from 'vuex';

import { RootStateI } from '../state';
import { VideoStreamStateI } from './state';
import { FileI } from '../files/state';

export const actions: ActionTree<VideoStreamStateI, RootStateI> = {
  getStreamUrl(
    _context: ActionContext<VideoStreamStateI, RootStateI>,
    payload: Pick<FileI, 'id' | 'contentType'>,
  ): string {
    if (!payload.contentType?.startsWith('video/')) {
      return '';
    }

    return `/api/files/${payload.id}/stream`;
  },
};
