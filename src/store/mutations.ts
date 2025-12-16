import { MutationTree } from 'vuex';

import { PaginationI, RootStateI } from './state';

const mutations: MutationTree<RootStateI> = {
  toggleSidebar(state) {
    state.sidebar = !state.sidebar;
  },
  closeSidebar(state) {
    state.sidebar = false;
  },
  setPaginationQuery(state, payload: string) {
    state.pagination.query = payload;
  },
};

export {
  mutations,
};
