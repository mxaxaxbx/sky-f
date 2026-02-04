import { ActionTree, ActionContext } from 'vuex';
import { AxiosProgressEvent } from 'axios';

import { storageClient } from '@/http-client';
import { snakeToCamel } from '@/utils';

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
    console.log('upload', payload);
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
    const linkel = document.createElement('a');
    linkel.href = link;
    linkel.target = '_blank';
    linkel.click();
    linkel.remove();
  },
};
