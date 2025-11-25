import { MutationTree } from 'vuex';

import {
  FilesStateI,
  FilesResultI,
} from './state';

export const mutations: MutationTree<FilesStateI> = {
  setResult(state: FilesStateI, payload: FilesResultI) {
    state.result.page = payload.page;
    state.result.perPage = payload.perPage;
    state.result.totalPages = payload.totalPages;

    if (payload.page > 1) {
      state.result.total += payload.total; // operador += recomendado por ESLint

      // evitar for...of prohibido por no-restricted-syntax
      state.result.data = [...state.result.data, ...payload.data];
    } else {
      state.result.total = payload.total;
      state.result.data = payload.data;
    }
  },
  setUploadProgress(state: FilesStateI, payload: number) {
    state.uploadProgress = payload;
  },
  setPaginationPage(state: FilesStateI, payload: number) {
    state.result.page = payload;
  },
};
