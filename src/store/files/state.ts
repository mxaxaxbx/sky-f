export interface FileI {
  id: string;
  name: string;
  size: number;
  contentType: string;
  userId: string;
  r2Key: string;
  r2Url: string;
  uploadCompleted: boolean;
  error: string;
  created: number;
  updated: number;
}

export interface FilesResultI {
  data: FileI[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface FilesStateI {
  result: FilesResultI;
  uploadProgress: number;
  uploadFiles: FileI[];
}

export const state: FilesStateI = {
  result: {
    data: [],
    page: 1,
    perPage: 0,
    total: 0,
    totalPages: 0,
  },
  uploadProgress: 0,
  uploadFiles: [],
};
