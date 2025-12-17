import { createStore, Store } from 'vuex';

import auth from './auth';
import notifications from './notifications';
// import teachers from './teachers';
// import courses from './courses';
import files from './files';
import theme from './theme';

import { state, RootStateI } from './state';
import { mutations } from './mutations';

const store: Store<RootStateI> = createStore({
  state,
  getters: {
  },
  mutations,
  actions: {
  },
  modules: {
  },
});

store.registerModule('auth', auth);
store.registerModule('notifications', notifications);
// store.registerModule('teachers', teachers);
// store.registerModule('courses', courses);
store.registerModule('files', files);
store.registerModule('theme', theme);

export default store;
