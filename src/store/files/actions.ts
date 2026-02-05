import { ActionTree, ActionContext } from 'vuex';
import { AxiosProgressEvent } from 'axios';

import { storageClient } from '@/http-client';
import { snakeToCamel, camelToSnake } from '@/utils';

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

    const { data } = await storageClient.post('/api/storage/generate-upload-url', camelToSnake(context.state.uploadFiles));

    const dataArray: FileI[] = snakeToCamel(data);

    const completedFiles: FileI[] = [];

    dataArray.forEach(async (item: FileI) => {
      if (item.r2Url) {
        // get file from formdata payload by name
        const file = payload.getAll('file').find((fileItem: FormDataEntryValue) => (fileItem as File).name === item.name);
        if (file) {
          try {
            const response = await fetch(item.r2Url, {
              method: 'PUT',
              body: file,
            });
            console.log('response', response);
            if (response.ok) {
              completedFiles.push(item);
            }
          } catch (error: unknown) {
            // eslint-disable-next-line no-param-reassign
            (item as FileI).error = error as string;
            console.error(error);
          }
        }
      }

      const { data: confirmedData } = await storageClient.post('/api/storage/confirm-uploads', camelToSnake(completedFiles));
      console.log('confirmedData', confirmedData);
      // TODO: validate current page and query through route query params
      context.dispatch('filter', {
        query: '',
        page: 1,
      });
    });
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

  async getFileDetails(
    context: ActionContext<FilesStateI, RootStateI>,
    payload: string,
  ): Promise<void> {
    const { data } = await storageClient.get(`/api/storage/filedetails/${payload}`);
    context.commit('setFile', snakeToCamel(data));
  },

  async getDownloadUrl(
    context: ActionContext<FilesStateI, RootStateI>,
    payload: FileI,
  ): Promise<void> {
    const { data } = await storageClient.get(`/api/storage/get-download-url/${payload.id}`);
    const { url } = snakeToCamel(data);

    const ael = document.createElement('a');
    ael.href = url;
    ael.download = payload.name;
    ael.click();
    ael.remove();
  },

};
