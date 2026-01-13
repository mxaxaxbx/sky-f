import { MutationTree } from 'vuex';

import { RootStateI } from './state';

const mutations: MutationTree<RootStateI> = {
  toggleSidebar(state) {
    state.sidebar = !state.sidebar;
    localStorage.setItem('sidebar', JSON.stringify(state.sidebar));
  },
};

export {
  mutations,
};
