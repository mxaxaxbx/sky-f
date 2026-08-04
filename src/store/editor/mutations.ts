import { MutationTree } from 'vuex';
import { EditorStateI } from './state';

export const mutations: MutationTree<EditorStateI> = {
  SET_CURRENT_FILE_NAME(state, fileName: string | null) {
    state.currentFileName = fileName;
  },
  SET_CURRENT_FILE_CONTENT(state, content: string) {
    state.currentFileContent = content;
  },
  SET_HAS_UNSAVED_CHANGES(state, hasUnsavedChanges: boolean) {
    state.hasUnsavedChanges = hasUnsavedChanges;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SET_FILE_HANDLE(state, handle: any) {
    state.fileHandle = handle;
  },
  SET_FILE_SIZE(state, size: number) {
    state.currentFileSize = size;
    state.isLargeFile = size > 1024 * 1024; // > 1MB
  },
};
