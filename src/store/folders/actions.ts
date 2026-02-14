import { ActionTree, ActionContext } from 'vuex';

import { storageClient } from '@/http-client';
import { snakeToCamel, camelToSnake } from '@/utils';

import { RootStateI } from '../state';
import { FolderI, FoldersStateI } from './state';

export const actions: ActionTree<FoldersStateI, RootStateI> = {

  async getTrashFolder(
    context: ActionContext<FoldersStateI, RootStateI>,
  ): Promise<void> {
    const { data } = await storageClient.get('/api/folders/get-trash-folder');
    context.commit('setTrashFolder', snakeToCamel(data));
  },

  async createFolder(
    context: ActionContext<FoldersStateI, RootStateI>,
    name: string,
  ): Promise<void> {
    const { data } = await storageClient.post('/api/folders/create-folder', { name });
    context.commit('setFolder', snakeToCamel(data));
  },

};
