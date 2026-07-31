export interface EditorStateI {
  currentFileName: string | null;
  currentFileContent: string;
  hasUnsavedChanges: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fileHandle: any;
}

export const state: EditorStateI = {
  currentFileName: null,
  currentFileContent: '',
  hasUnsavedChanges: false,
  fileHandle: null,
};
