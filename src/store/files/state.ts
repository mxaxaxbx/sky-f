export interface SearchItemI {
  id: string | number;
  name: string;
  itemType: string;
  size: number;
  contentType: string;
  userId: string | number;
  folderId: null | number;
  isTrash: boolean;
  uploadCompleted: boolean;
  created: number;
  updated: number;
}

export interface SearchResultI {
  data: SearchItemI[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

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
  folderId: null | number | string;
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
  searchResult: SearchResultI;
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
    folderId: null,
    created: 0,
    updated: 0,
  },
  searchResult: {
    data: [],
    page: 1,
    perPage: 0,
    total: 0,
    totalPages: 0,
  },
};
