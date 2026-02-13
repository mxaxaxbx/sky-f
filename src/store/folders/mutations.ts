import { MutationTree } from 'vuex';

import {
  FoldersStateI,
  FolderI,
} from './state';

export const mutations: MutationTree<FoldersStateI> = {

  setTrashFolder(state: FoldersStateI, payload: FolderI) {
    state.trashFolder = payload;
  },

};
