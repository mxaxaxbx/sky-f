import { ActionTree, ActionContext } from 'vuex';

import { storageClient } from '@/http-client';
import { snakeToCamel, camelToSnake } from '@/utils';
import { getDB } from '@/utils/indexeddb';

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
    const completedFiles: FileI[] = [];

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

      await dataArray.forEach(async (item: FileI) => {
        if (item.r2Url) {
          // get file from formdata payload by name
          const file = payload.getAll('file')
            .find((fileItem: FormDataEntryValue) => (fileItem as File).name === item.name);
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
        if (confirmedData && confirmedData.length > 0) {
          confirmedData.forEach((file: FileI) => {
            context.dispatch('saveCacheFile', file);
          });
        }
        // TODO: validate current page and query through route query params
        context.dispatch('filter', {
          query: '',
          page: 1,
        });
      });
    } catch (error) {
      console.error(error);
    }
  },

  async getFileDetails(
    context: ActionContext<FilesStateI, RootStateI>,
    payload: string,
  ): Promise<void> {
    const { data } = await storageClient.get(`/api/storage/filedetails/${payload}`);
    context.commit('setFile', snakeToCamel(data));
    context.dispatch('saveCacheFile', snakeToCamel(data));
  },

  async downloadFile(
    context: ActionContext<FilesStateI, RootStateI>,
    payload: FileI,
  ): Promise<void> {
    const cached = await context.dispatch('getCacheFile', {
      id: payload.id,
    });

    if (cached) {
      console.log('Loaded from cache');

      const link = document.createElement('a');
      link.href = cached;
      link.download = payload.name;
      link.click();

      return;
    }

    console.log('Downloading and caching');

    await context.dispatch('saveCacheFile', payload);

    const base64 = await context.dispatch('getCacheFile', {
      id: payload.id,
    });

    if (base64) {
      const link = document.createElement('a');
      link.href = base64;
      link.download = payload.name;
      link.click();
      return;
    }

    console.log('Error downloading file');
  },

  async saveCacheFile(
    context: ActionContext<FilesStateI, RootStateI>,
    payload: FileI,
  ): Promise<void> {
    console.log('saveCacheFile', payload);
    const { data } = await storageClient.get(
      `/api/storage/get-download-url/${payload.id}`,
    );

    const { url } = data;

    const blob = await fetch(url).then((r) => r.blob());

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    const db = await getDB();
    // Skip if not supported
    if (!db) return;

    const tx = db.transaction('files', 'readwrite');
    const store = tx.objectStore('files');

    store.put({
      id: payload.id,
      base64,
      name: payload.name,
      type: payload.contentType,
    });

    // eslint-disable-next-line no-return-await
    await new Promise((resolve) => { tx.oncomplete = resolve; });
  },

  async getCacheFile(
    context: ActionContext<FilesStateI, RootStateI>,
    payload: { id: number | string },
  ): Promise<string | null> {
    const db = await getDB();

    // Skip if not supported
    if (!db) return null;

    const tx = db.transaction('files', 'readonly');
    const store = tx.objectStore('files');

    return new Promise((resolve, reject) => {
      const request = store.get(payload.id);

      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result.base64);
        } else {
          resolve(null);
        }
      };

      request.onerror = reject;
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
    await context.dispatch('saveCacheFile', payload);
  },

  async getDownloadUrl(
    context: ActionContext<FilesStateI, RootStateI>,
    payload: FileI,
  ): Promise<void> {
    const { data } = await storageClient.get(`/api/storage/get-download-url/${payload.id}`);
    const { url } = data;

    context.dispatch('saveCacheFile', payload);

    return url;
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
