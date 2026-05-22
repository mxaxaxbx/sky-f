import {
  ActionContext,
  ActionTree,
  Module,
  MutationTree,
} from 'vuex';

import { RootStateI } from './state';

export interface ThemeStateI {
  theme: 'dark' | 'light';
}

export const state: ThemeStateI = {
  theme: (localStorage.getItem('theme') as ThemeStateI['theme']) || 'dark',
};

export const mutations: MutationTree<ThemeStateI> = {
  setTheme(themeState: ThemeStateI, newTheme: ThemeStateI['theme']) {
    // Vuex mutations intentionally mutate store state in place.
    // eslint-disable-next-line no-param-reassign
    themeState.theme = newTheme;
    localStorage.setItem('theme', newTheme);
  },
};

export const actions: ActionTree<ThemeStateI, RootStateI> = {
  toggleTheme(
    { commit, state: themeState, dispatch }: ActionContext<ThemeStateI, RootStateI>,
  ) {
    const newTheme: ThemeStateI['theme'] = themeState.theme === 'dark' ? 'light' : 'dark';
    commit('setTheme', newTheme);
    dispatch('initTheme');
  },
  initTheme({ state: themeState }: ActionContext<ThemeStateI, RootStateI>) {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(themeState.theme);
  },
};

const module: Module<ThemeStateI, RootStateI> = {
  namespaced: true,
  state,
  mutations,
  actions,
};

export default module;
