import { ActionTree, ActionContext } from 'vuex';

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

    const files: SharedFileI[] = snakeToCamel(data).files || [];
    context.commit('setSharedFiles', files);
    return files;
  },

};
