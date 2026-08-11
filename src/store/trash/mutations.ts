import { MutationTree } from 'vuex';
import { TrashStateI, EmptyOldTrashResultI } from './state';

export const mutations: MutationTree<TrashStateI> = {
  setEmptyOldTrashLoading(state: TrashStateI, payload: boolean) {
    state.emptyOldTrashLoading = payload;
  },

  setEmptyOldTrashError(state: TrashStateI, payload: string | null) {
    state.emptyOldTrashError = payload;
  },

  setLastEmptyOldTrashResult(state: TrashStateI, payload: EmptyOldTrashResultI | null) {
    state.lastEmptyOldTrashResult = payload;
  },

  clearEmptyOldTrashState(state: TrashStateI) {
    state.emptyOldTrashLoading = false;
    state.emptyOldTrashError = null;
    state.lastEmptyOldTrashResult = null;
  },
};
