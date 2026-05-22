import { ActionTree, ActionContext } from 'vuex';

import { storageClient } from '@/http-client';
import { snakeToCamel, camelToSnake } from '@/utils';

import { RootStateI } from '../state';
import { FolderI, FoldersStateI } from './state';
import { FileI } from '../files/state';

export const actions: ActionTree<FoldersStateI, RootStateI> = {

  async getPlan(
    context: ActionContext<FoldersStateI, RootStateI>,
  ): Promise<void> {
    const { data } = await storageClient.get('/api/subscription/plan');
    console.log('data', data);
  },

};
