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
};

export {
  mutations,
};
