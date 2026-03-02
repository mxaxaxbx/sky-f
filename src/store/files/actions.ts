import { ActionTree, ActionContext } from 'vuex';

import { storageClient } from '@/http-client';
import { snakeToCamel, camelToSnake } from '@/utils';

import { RootStateI } from '../state';
import { FileI, FilesStateI } from './state';
import { FolderI } from '../folders/state';

export const actions: ActionTree<FilesStateI, RootStateI> = {

  async filter(
    context: ActionContext<FilesStateI, RootStateI>,
    payload: {
      query: string;
      page: number;
      orderBy: string;
      order: string;
      folderId: number | string | null;
    },
  ): Promise<void> {
    // convert the payload to url query params
    let params = '';

    const payloadData = camelToSnake(payload);

    Object.entries(payloadData).forEach(([key, value]) => {
      params += `${key}=${value}&`;
    });

    const { data } = await storageClient.get(`/api/storage/listfiles?${params.toString()}`);
    context.commit('setResult', snakeToCamel(data));
  },

  async upload(
    context: ActionContext<FilesStateI, RootStateI>,
    payload: FormData,
  ): Promise<void> {
    try {
      // get the files from the payload
      const files = payload.getAll('file');

      files.forEach((file: FormDataEntryValue) => {
        const fileObj = file as File;
        console.log('fileObj', fileObj);
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
          folderId: null,
        });
      });

      const { data } = await storageClient.post('/api/storage/generate-upload-url', camelToSnake(context.state.uploadFiles));

      const dataArray: FileI[] = snakeToCamel(data);

      const completedFiles: FileI[] = [];

      dataArray.forEach(async (item: FileI) => {
        if (item.r2Url) {
          // get file from formdata payload by name
          const file = payload.getAll('file')
            .find((fileItem: FormDataEntryValue) => (fileItem as File).name === item.name);
          console.log('file', file);
          if (file) {
            try {
              const headers = new Headers();
              headers.set('Content-Type', (file as File).type || 'application/octet-stream');
              const response = await fetch(item.r2Url, {
                method: 'PUT',
                body: file,
                redirect: 'follow',
                headers,
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
    } finally {
      // Always clear upload files and reset progress after upload completes or fails
    }
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

  async downloadFile(
    context: ActionContext<FilesStateI, RootStateI>,
    payload: FileI,
  ): Promise<void> {
    const blobUrl = await context.dispatch('getBlobUrl', {
      name: payload.name,
      userId: payload.userId,
    });
    console.log('blobUrl', blobUrl);
    if (blobUrl) {
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = payload.name;
      a.target = '_blank';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      a.remove();
      return;
    }

    const { data } = await storageClient.get(
      `/api/storage/get-download-url/${payload.id}`,
    );
    const { url } = data;

    await context.dispatch('generateBlobAndSaveInCache', {
      url,
      name: payload.name,
      download: true,
      userId: payload.userId,
    });
  },

  async previewFile(
    context: ActionContext<FilesStateI, RootStateI>,
    payload: FileI,
  ): Promise<void> {
    const { data } = await storageClient.get(
      `/api/storage/get-download-url/${payload.id}`,
    );
    const { url } = data;
    const linkEl = document.createElement('a');
    linkEl.href = url;
    linkEl.target = '_blank';
    linkEl.click();
    linkEl.remove();
  },

  async getDownloadUrl(
    context: ActionContext<FilesStateI, RootStateI>,
    payload: FileI,
  ): Promise<void> {
    const { data } = await storageClient.get(`/api/storage/get-download-url/${payload.id}`);
    const { url } = data;

    return url;
  },

  async getBlobUrl(
    context: ActionContext<FilesStateI, RootStateI>,
    payload: {
      name: string,
      userId: number,
    },
  ): Promise<string | null> {
    // check if the blob url is still valid
    const blobUrl = sessionStorage.getItem(`${payload.userId}-${payload.name}`);
    if (blobUrl) {
      return blobUrl;
    }
    return null;
  },

  async search(
    context: ActionContext<FilesStateI, RootStateI>,
    payload: {
      q: string,
      page: number,
    },
  ): Promise<void> {
    const { data } = await storageClient.get(`/api/storage/search?q=${payload.q}&page=${payload.page}`);
    context.commit('setSearchResult', snakeToCamel(data));
  },

  async moveFilesToFolder(
    context: ActionContext<FilesStateI, RootStateI>,
    payload: FolderI[],
  ): Promise<void> {
    const { data } = await storageClient.post('/api/files/move-files-to-folder', camelToSnake(payload));
    context.commit('setFiles', snakeToCamel(data));
  },

  async changeFileName(
    context: ActionContext<FilesStateI, RootStateI>,
    payload: {
      id: number | string,
      name: string,
    },
  ): Promise<void> {
    const { data } = await storageClient.put('/api/files/change-file-name', camelToSnake(payload));
    console.log('data', data);
  },

};
