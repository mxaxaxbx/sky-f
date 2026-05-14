import { MutationTree } from 'vuex';

import { RootStateI } from './state';

const mutations: MutationTree<RootStateI> = {
  toggleSidebar(state) {
    state.sidebar = !state.sidebar;
    localStorage.setItem('sidebar', JSON.stringify(state.sidebar));
  },
  closeSidebar(state) {
    state.sidebar = false;
    localStorage.setItem('sidebar', JSON.stringify(false));
  },
  setRecorder(state, { show, folderId }) {
    state.showRecorder = show;
    if (folderId !== undefined) {
      state.recorderFolderId = folderId;
    }
  },
  setRecording(state, isRecording) {
    state.isRecording = isRecording;
  },
};

export {
  mutations,
};
