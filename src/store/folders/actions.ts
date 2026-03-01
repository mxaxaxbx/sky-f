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
    context.dispatch('filter', { query: '', page: 1 });
  },

  async filter(
    context: ActionContext<FoldersStateI, RootStateI>,
    payload: {
      query: string;
      page: number;
      folderId: number | string | null;
    },
  ): Promise<void> {
    // convert the payload to url query params
    let params = '';

    const payloadData = camelToSnake(payload);

    Object.entries(payloadData).forEach(([key, value]) => {
      params += `${key}=${value}&`;
    });

    console.log('params', params);

    const { data } = await storageClient.get(`/api/folders/list-folders?${params}`);
    console.log('data', data);
    context.commit('setResult', snakeToCamel(data));
  },

  async getFolderDetails(
    context: ActionContext<FoldersStateI, RootStateI>,
    payload: {
      folderId: number;
    },
  ): Promise<void> {
    const { data } = await storageClient.get(`/api/folders/get-folder-details/${payload.folderId}`);
    context.commit('setFolder', snakeToCamel(data));
  },

  async moveFoldersToFolder(
    context: ActionContext<FoldersStateI, RootStateI>,
    payload: FolderI[],
  ): Promise<void> {
    const { data } = await storageClient.post('/api/folders/move-folders-to-folder', camelToSnake(payload));
    context.commit('setResult', snakeToCamel(data));
  },

  async changeFolderName(
    context: ActionContext<FoldersStateI, RootStateI>,
    payload: {
      id: number | string,
      name: string,
    },
  ): Promise<void> {
    const { data } = await storageClient.put('/api/folders/change-folder-name', camelToSnake(payload));
    console.log('data', data);
  },

};
