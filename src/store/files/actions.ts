import { ActionTree, ActionContext } from 'vuex';
import { AxiosProgressEvent } from 'axios';

import { storageClient } from '@/http-client';
import { camelToSnake, snakeToCamel } from '@/utils';

import { RootStateI } from '../state';
import { FileI, FilesStateI } from './state';

export const actions: ActionTree<FilesStateI, RootStateI> = {
  async filter(
    context: ActionContext<FilesStateI, RootStateI>,
    payload: {
      query: string;
      page: number;
    },
  ): Promise<void> {
    // convert the payload to url query params
    let params = '';

    Object.entries(payload).forEach(([key, value]) => {
      params += `${key}=${value}&`;
    });

    const { data } = await storageClient.get(`/api/storage/listfiles?${params.toString()}`);
    context.commit('setResult', snakeToCamel(data));
  },
  async upload(
    context: ActionContext<FilesStateI, RootStateI>,
    payload: FormData,
  ): Promise<void> {
    storageClient.post(
      '/api/storage/upload',
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          // eslint-disable-next-line no-unsafe-optional-chaining
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded) / progressEvent.total)
            : 0;
          context.commit('setUploadProgress', progress);
        },
      },
    );
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 1000));
    context.dispatch('filter', null);
  },
  async download(
    context: ActionContext<FilesStateI, RootStateI>,
    payload: FileI,
  ): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    const DG_STORAGE = process.env.VUE_APP_DG_SKY_SVC;
    const link = `${DG_STORAGE}/api/storage/getfile/${payload.id}?token=${token}`;
    window.open(link, '_blank');
  },
};
