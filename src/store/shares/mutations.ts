import { MutationTree } from 'vuex';

import {
  ShareStateI,
  ShareI,
  CreatedShareI,
  PublicShareMetaI,
  SharedFileI,
  PublicShareContentI,
} from './state';

export const mutations: MutationTree<ShareStateI> = {

  setShares(state: ShareStateI, payload: ShareI[]) {
    state.shares = payload || [];
  },

  addShare(state: ShareStateI, payload: ShareI) {
    state.shares = [...state.shares, payload];
  },

  updateShare(state: ShareStateI, payload: ShareI) {
    state.shares = state.shares.map(
      (share) => (share.token === payload.token ? payload : share),
    );
  },

  removeShare(state: ShareStateI, payload: string) {
    state.shares = state.shares.filter((share) => share.token !== payload);
  },

  setCreatedShare(state: ShareStateI, payload: CreatedShareI | null) {
    state.createdShare = payload;
  },

  setPublicMeta(state: ShareStateI, payload: PublicShareMetaI | null) {
    state.publicMeta = payload;
  },

  setAccessToken(state: ShareStateI, payload: string) {
    state.accessToken = payload;
  },

  setSharedFiles(state: ShareStateI, payload: SharedFileI[]) {
    state.sharedFiles = payload || [];
  },

  setPublicShareContent(state: ShareStateI, payload: PublicShareContentI | null) {
    state.publicShareContent = payload;
  },

  setPublicShareLoading(state: ShareStateI, payload: boolean) {
    state.publicShareLoading = payload;
  },

  setPublicShareError(state: ShareStateI, payload: string | null) {
    state.publicShareError = payload;
  },

  clearPublicShareState(state: ShareStateI) {
    state.publicShareContent = null;
    state.publicShareLoading = false;
    state.publicShareError = null;
  },

};
