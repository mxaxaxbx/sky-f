export interface FolderI {
  id: string | number;
  name: string;
  userId: string | number;
  folderId: null | number | string;
  isTrash: boolean;
  created: number;
  updated: number;
}

export interface FoldersResultI {
  data: FolderI[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface FoldersStateI {
  trashFolder: FolderI;
  folder: FolderI;
  result: FoldersResultI;
  selectedFolders: FolderI[];
}

export const state: FoldersStateI = {
  trashFolder: {
    id: 0,
    name: '',
    userId: 0,
    folderId: null,
    isTrash: false,
    created: 0,
    updated: 0,
  },
  folder: {
    id: 0,
    name: '',
    userId: 0,
    folderId: null,
    isTrash: false,
    created: 0,
    updated: 0,
  },
  result: {
    data: [],
    page: 1,
    perPage: 0,
    total: 0,
    totalPages: 0,
  },
  selectedFolders: [],
};
