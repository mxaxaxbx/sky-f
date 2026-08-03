export interface EditorStateI {
  currentFileName: string | null;
  currentFileContent: string;
  hasUnsavedChanges: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fileHandle: any;
  currentFileSize: number; // in bytes
  isLargeFile: boolean;
}

export const state: EditorStateI = {
  currentFileName: null,
  currentFileContent: '',
  hasUnsavedChanges: false,
  fileHandle: null,
  currentFileSize: 0,
  isLargeFile: false,
};
