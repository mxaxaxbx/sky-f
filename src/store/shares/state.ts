export interface ShareI {
  id: number;
  fileId: null | number;
  folderId: null | number;
  token: string;
  expiresAt: number;
  userId: number;
  created: number;
  updated: number;
}

export interface CreatedShareI {
  share: ShareI;
  url: string;
}

export interface PublicShareMetaI {
  isPasswordProtected: boolean;
  name: string;
  type: string;
}

export interface ShareVerifyResultI {
  expiresAt: number;
  token: string;
}

export interface SharedFileI {
  id: number;
  name: string;
  size: number;
  url: string;
}

export interface ShareStateI {
  shares: ShareI[];
  createdShare: CreatedShareI | null;
  publicMeta: PublicShareMetaI | null;
  accessToken: string;
  sharedFiles: SharedFileI[];
}

export const state: ShareStateI = {
  shares: [],
  createdShare: null,
  publicMeta: null,
  accessToken: '',
  sharedFiles: [],
};
