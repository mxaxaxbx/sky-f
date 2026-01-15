export default {
  namespaced: true,

  state: {
    theme: localStorage.getItem('theme') || 'dark',
  },

  mutations: {
    setTheme(state, newTheme) {
      state.theme = newTheme;
      localStorage.setItem('theme', newTheme);
    },
  },

  actions: {
    toggleTheme({ commit, state, dispatch }) {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      commit('setTheme', newTheme);
      dispatch('initTheme');
    },
    initTheme({ state }) {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(state.theme);
    },
  },
};
