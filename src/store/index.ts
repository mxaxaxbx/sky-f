import { createStore, Store } from 'vuex';

import auth from './auth';
import notifications from './notifications';
import files from './files';
import folders from './folders';
import theme from './theme';
import subscriptions from './subscriptions';

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
store.registerModule('files', files);
store.registerModule('folders', folders);
store.registerModule('theme', theme);
store.registerModule('subscriptions', subscriptions);

export default store;
