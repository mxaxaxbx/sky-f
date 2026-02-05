export interface FileI {
  id: string | number;
  name: string;
  size: number;
  contentType: string;
  userId: string | number;
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
  file: FileI;
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
  file: {
    id: 0,
    name: '',
    size: 0,
    contentType: '',
    userId: 0,
    r2Key: '',
    r2Url: '',
    uploadCompleted: false,
    error: '',
    created: 0,
    updated: 0,
  },
};
