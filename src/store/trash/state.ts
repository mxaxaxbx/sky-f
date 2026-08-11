export interface EmptyOldTrashResultI {
  message: string;
  deletedFiles: number;
  deletedFolders: number;
}

export interface TrashStateI {
  emptyOldTrashLoading: boolean;
  emptyOldTrashError: string | null;
  lastEmptyOldTrashResult: EmptyOldTrashResultI | null;
}

export const state: TrashStateI = {
  emptyOldTrashLoading: false,
  emptyOldTrashError: null,
  lastEmptyOldTrashResult: null,
};
