import { createApp } from 'vue';
import App from './App.vue';

import router from './router';
import store from './store';

import clickOutside from './directives/click-outside';
import checkPerm from './directives/perm';

import './index.css';

const app = createApp(App);

app.use(store);
app.use(router);
app.use(clickOutside);
app.use(checkPerm);

store.dispatch('theme/initTheme');
app.mount('#app');
