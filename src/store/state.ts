export interface RootStateI {
  version: string;
  sidebar: boolean;
  isRecording: boolean;
  showRecorder: boolean;
  recorderFolderId: number | string | null;
}

export interface OptionI {
  content: string;
  action: string;
}

export const state: RootStateI = {
  version: '0.0.1',
  sidebar: JSON.parse(localStorage.getItem('sidebar') || 'true'),
  isRecording: false,
  showRecorder: false,
  recorderFolderId: null,
};
