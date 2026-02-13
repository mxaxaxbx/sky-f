export interface FolderI {
  id: string | number;
  name: string;
  userId: string | number;
  folderId: null | number;
  isTrash: boolean;
  created: number;
  updated: number;
}

export interface FoldersStateI {
  trashFolder: FolderI;
  folder: FolderI;
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
};
