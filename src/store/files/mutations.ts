import { MutationTree } from 'vuex';

import {
  FilesStateI,
  FilesResultI,
} from './state';

export const mutations: MutationTree<FilesStateI> = {
  setResult(state: FilesStateI, payload: FilesResultI) {
    state.result = payload;
    if (payload.data == null) {
      state.result.data = [];
    }
  },
  setUploadProgress(state: FilesStateI, payload: number) {
    state.uploadProgress = payload;
  },
};
