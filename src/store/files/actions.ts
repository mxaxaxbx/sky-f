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
    // get the files from the payload
    const files = payload.getAll('file');

    files.forEach((file: FormDataEntryValue) => {
      const fileObj = file as File;
      context.state.uploadFiles.push({
        id: 0,
        name: fileObj.name,
        size: fileObj.size,
        contentType: fileObj.type,
        userId: 0,
        r2Key: '',
        r2Url: '',
        uploadCompleted: false,
        error: '',
        created: 0,
        updated: 0,
      });
    });

    console.log('uploadFiles', context.state.uploadFiles);
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
