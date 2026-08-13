import { ActionTree, ActionContext } from 'vuex';
import { AxiosResponse, AxiosRequestConfig } from 'axios';

import { storageClient } from '@/http-client';
import { snakeToCamel, camelToSnake } from '@/utils';

import { RootStateI } from '../state';
import {
  ShareStateI,
  ShareI,
  CreatedShareI,
  PublicShareMetaI,
  ShareVerifyResultI,
  SharedFileI,
} from './state';

export const actions: ActionTree<ShareStateI, RootStateI> = {

  // Create a share link for a file or folder (authenticated user)
  async createShare(
    context: ActionContext<ShareStateI, RootStateI>,
    payload: {
      fileId?: number | null;
      folderId?: number | null;
      password?: string | null;
      expiresAt?: number | null;
    },
  ): Promise<CreatedShareI> {
    const { data } = await storageClient.post('/api/shares', camelToSnake(payload));
    const createdShare: CreatedShareI = snakeToCamel(data);
    context.commit('setCreatedShare', createdShare);
    context.commit('addShare', createdShare.share);
    return createdShare;
  },

  // List all share links of the authenticated user
  async listShares(
    context: ActionContext<ShareStateI, RootStateI>,
  ): Promise<ShareI[]> {
    const { data } = await storageClient.get('/api/shares');
    const shares: ShareI[] = snakeToCamel(data);
    context.commit('setShares', shares);
    return shares;
  },

  // Revoke (delete) a share link by its token
  async revokeShare(
    context: ActionContext<ShareStateI, RootStateI>,
    payload: string,
  ): Promise<void> {
    await storageClient.delete(`/api/shares/${payload}`);
    context.commit('removeShare', payload);
  },

  // Update the password and/or expiration of a share link
  async updateShare(
    context: ActionContext<ShareStateI, RootStateI>,
    payload: {
      token: string;
      password?: string | null;
      expiresAt?: number | null;
    },
  ): Promise<ShareI> {
    const { token, ...body } = payload;
    const { data } = await storageClient.patch(`/api/shares/${token}`, camelToSnake(body));
    const share: ShareI = snakeToCamel(data);
    context.commit('updateShare', share);
    return share;
  },

  // Retrieve public metadata of a share (no authentication required)
  async getPublicShareMeta(
    context: ActionContext<ShareStateI, RootStateI>,
    payload: string,
  ): Promise<PublicShareMetaI> {
    const { data } = await storageClient.get(`/api/public/shares/${payload}`);
    const meta: PublicShareMetaI = snakeToCamel(data);
    context.commit('setPublicMeta', meta);
    return meta;
  },

  // Verify the password of a password-protected share, returns a temporary access token
  async verifyShare(
    context: ActionContext<ShareStateI, RootStateI>,
    payload: {
      token: string;
      password: string;
    },
  ): Promise<ShareVerifyResultI> {
    const { token, ...body } = payload;
    const { data } = await storageClient.post(
      `/api/public/shares/${token}/verify`,
      camelToSnake(body),
    );
    const result: ShareVerifyResultI = snakeToCamel(data);
    context.commit('setAccessToken', result.token);
    return result;
  },

  // Download a shared file/folder using the temporary access token
  async downloadShare(
    context: ActionContext<ShareStateI, RootStateI>,
    payload: {
      token: string;
      accessToken?: string;
    },
  ): Promise<SharedFileI[]> {
    const accessToken = payload.accessToken || context.state.accessToken;

    const { data } = await storageClient.get(
      `/api/public/shares/${payload.token}/download`,
      accessToken
        ? { headers: { Authorization: `Bearer ${accessToken}` } }
        : undefined,
    );

    const camel = snakeToCamel(data);

    // A folder share returns { files: [...] }; a single-file share
    // returns the presigned link directly as { url, ... }.
    let files: SharedFileI[] = [];
    if (Array.isArray(camel.files)) {
      files = camel.files;
    } else if (camel.url) {
      files = [{
        id: camel.id || 0,
        name: camel.name || '',
        size: camel.size || 0,
        url: camel.url,
      }];
    }

    context.commit('setSharedFiles', files);
    return files;
  },

  // Get public share content (presigned URL redirect) - unprotected or already authorized
  async getPublicShareContent(
    context: ActionContext<ShareStateI, RootStateI>,
    payload: string,
  ): Promise<string> {
    context.commit('setPublicShareLoading', true);
    context.commit('setPublicShareError', null);

    try {
      // Request with maxRedirects: 0 to capture the 302 redirect
      const response = await storageClient.get(
        `/api/public/shares/${payload}/content`,
        {
          maxRedirects: 0,
          validateStatus: (status: number) => status === 302 || status === 200,
        },
      );

      let presignedUrl = '';

      // Handle redirect response (302)
      if (response.status === 302 && response.headers.location) {
        presignedUrl = response.headers.location as string;
      } else if (response.status === 200 && response.data?.url) {
        presignedUrl = response.data.url as string;
      } else if (response.status === 200) {
        presignedUrl = response.data as string;
      }

      context.commit('setPublicShareContent', {
        url: presignedUrl,
        fileName: response.headers['content-disposition']
          ?.split('filename=')[1]
          ?.replace(/"/g, ''),
      });

      context.commit('setPublicShareLoading', false);
      return presignedUrl;
    } catch (error) {
      const errorMessage = (error as any)?.response?.data?.error
        || (error as Error)?.message
        || 'Failed to retrieve share content';

      context.commit('setPublicShareError', errorMessage);
      context.commit('setPublicShareLoading', false);
      throw error;
    }
  },

  // Get public share content with streaming option (preserves Range/ETag support)
  async getPublicShareContentStream(
    context: ActionContext<ShareStateI, RootStateI>,
    payload: {
      token: string;
      range?: string;
    },
  ): Promise<AxiosResponse> {
    context.commit('setPublicShareLoading', true);
    context.commit('setPublicShareError', null);

    try {
      const config: AxiosRequestConfig = {
        responseType: 'stream',
        maxRedirects: 1,
      };

      if (payload.range) {
        config.headers = { Range: payload.range };
      }

      const response = await storageClient.get(
        `/api/public/shares/${payload.token}/content?dl=1`,
        config,
      );

      context.commit('setPublicShareLoading', false);
      return response;
    } catch (error) {
      const errorMessage = (error as any)?.response?.data?.error
        || (error as Error)?.message
        || 'Failed to retrieve share content stream';

      context.commit('setPublicShareError', errorMessage);
      context.commit('setPublicShareLoading', false);
      throw error;
    }
  },

  // Verify password for protected share - sets httpOnly session cookie
  async verifySharePassword(
    context: ActionContext<ShareStateI, RootStateI>,
    payload: {
      token: string;
      password: string;
    },
  ): Promise<void> {
    context.commit('setPublicShareLoading', true);
    context.commit('setPublicShareError', null);

    try {
      // Make request with credentials to include cookies
      await storageClient.post(
        `/api/public/shares/${payload.token}/verify`,
        { password: payload.password },
        {
          withCredentials: true,
        },
      );

      context.commit('setPublicShareLoading', false);
    } catch (error) {
      const errorMessage = (error as any)?.response?.data?.error
        || 'Invalid password';

      context.commit('setPublicShareError', errorMessage);
      context.commit('setPublicShareLoading', false);
      throw error;
    }
  },

  // Clear public share state (useful when navigating away)
  clearPublicShareState(
    context: ActionContext<ShareStateI, RootStateI>,
  ): void {
    context.commit('clearPublicShareState');
  },

};
