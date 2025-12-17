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
    toggleTheme({ commit, state }) {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      commit('setTheme', newTheme);
    },
    initTheme({ state }) {
      document.documentElement.classList.toggle('light', state.theme === 'light');
    },
  },
};
