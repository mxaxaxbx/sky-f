import { createApp } from 'vue';
import App from './App.vue';

import router from './router';
import store from './store';

import clickOutside from './directives/click-outside';
import checkPerm from './directives/perm';
import { registerServiceWorker } from './registerServiceWorker';
import { checkAndEmptyOldTrash } from './services/trash-scheduler';
import { initPrefetcher } from './services/prefetcher';

import './index.css';

const app = createApp(App);

app.use(store);
app.use(router);
app.use(clickOutside);
app.use(checkPerm);

store.dispatch('theme/initTheme');
app.mount('#app');

// Run trash cleanup on app start and every hour
checkAndEmptyOldTrash();
setInterval(checkAndEmptyOldTrash, 60 * 60 * 1000);

registerServiceWorker();

// Start route-based prefetcher (speculation rules)
initPrefetcher(router as any);
