import { MutationTree } from 'vuex';

import {
  FoldersStateI,
  FolderI,
  FoldersResultI,
} from './state';

export const mutations: MutationTree<FoldersStateI> = {

  setTrashFolder(state: FoldersStateI, payload: FolderI) {
    state.trashFolder = payload;
  },

  setFolder(state: FoldersStateI, payload: FolderI) {
    state.folder = payload;
  },

  setResult(state: FoldersStateI, payload: FoldersResultI) {
    state.result.page = payload.page;
    state.result.perPage = payload.perPage;
    state.result.totalPages = payload.totalPages;

    if (payload.page > 1) {
      state.result.total += payload.total; // operador += recomendado por ESLint

      // evitar for...of prohibido por no-restricted-syntax
      state.result.data = [...state.result.data, ...payload.data];
    } else {
      state.result.total = payload.total;
      state.result.data = payload.data || [];
    }
  },

};
