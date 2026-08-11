import { ActionTree, ActionContext } from 'vuex';

import { storageClient } from '@/http-client';
import { snakeToCamel } from '@/utils';

import { RootStateI } from '../state';
import { TrashStateI, EmptyOldTrashResultI } from './state';

export const actions: ActionTree<TrashStateI, RootStateI> = {
  async emptyOldTrash(
    context: ActionContext<TrashStateI, RootStateI>,
  ): Promise<EmptyOldTrashResultI> {
    try {
      context.commit('setEmptyOldTrashLoading', true);
      context.commit('setEmptyOldTrashError', null);

      const { data } = await storageClient.post('/api/trash/empty-old', {});
      const convertedData = snakeToCamel(data) as EmptyOldTrashResultI;

      context.commit('setLastEmptyOldTrashResult', convertedData);
      context.commit('setEmptyOldTrashLoading', false);

      return convertedData;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to empty old trash items';
      context.commit('setEmptyOldTrashError', errorMessage);
      context.commit('setEmptyOldTrashLoading', false);
      throw error;
    }
  },

  clearEmptyOldTrashState(context: ActionContext<TrashStateI, RootStateI>) {
    context.commit('clearEmptyOldTrashState');
  },
};
