import { GetterTree } from 'vuex';

import { RootStateI } from '../state';
import { TrashStateI } from './state';

export const getters: GetterTree<TrashStateI, RootStateI> = {
  isEmptyingOldTrash(state: TrashStateI): boolean {
    return state.emptyOldTrashLoading;
  },

  emptyOldTrashError(state: TrashStateI): string | null {
    return state.emptyOldTrashError;
  },

  lastEmptyOldTrashResult(state: TrashStateI) {
    return state.lastEmptyOldTrashResult;
  },

  deletedFilesCount(state: TrashStateI): number {
    return state.lastEmptyOldTrashResult?.deletedFiles || 0;
  },

  deletedFoldersCount(state: TrashStateI): number {
    return state.lastEmptyOldTrashResult?.deletedFolders || 0;
  },
};
