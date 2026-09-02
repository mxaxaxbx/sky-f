import { Router } from 'vue-router';

type PrefetchFn = () => Promise<any>;

const defaultRules: Record<string, PrefetchFn[]> = {
  // When on the files list, users often open details, folders or the editor
  'app-files-list': [
    () => import('../views/app/files/details.vue'),
    () => import('../views/app/folders/index.vue'),
    () => import('../views/editor-view.vue'),
  ],
  // When viewing details, they might go back to list or open editor
  'app-files-details': [
    () => import('../views/app/files/list.vue'),
    () => import('../views/editor-view.vue'),
  ],
  // From a folder content page, users navigate to file details or files view
  'app-folders-content': [
    () => import('../views/app/folders/index.vue'),
    () => import('../views/app/files/list.vue'),
  ],
  'app-home': [() => import('../views/app/files/index.vue')],
  home: [() => import('../views/AboutView.vue'), () => import('../views/app/files/index.vue')],
};

export function initPrefetcher(router: Router, customRules?: Record<string, PrefetchFn[]>) {
  const rules = { ...defaultRules, ...(customRules || {}) };

  // Lightweight network/cost heuristics
  function shouldPrefetch() {
    if (typeof navigator === 'undefined') return false;
    // Honor Save-Data
    const connection = (navigator as any).connection || {};
    if ((navigator as any).saveData || connection.saveData) return false;
    const effectiveType = connection.effectiveType || '';
    if (effectiveType && ['slow-2g', '2g'].includes(effectiveType)) return false;
    if (!navigator.onLine) return false;
    return true;
  }

  let lastPrefetchAt = 0;
  function runPrefetchFor(routeName?: string) {
    if (!routeName) return;
    if (!shouldPrefetch()) return;
    const fns = rules[routeName];
    if (!fns || fns.length === 0) return;
    const now = Date.now();
    // throttle to at most one prefetch burst per 500ms
    if (now - lastPrefetchAt < 500) return;
    lastPrefetchAt = now;

    fns.forEach((fn) => {
      // defer slightly so navigation isn't impacted
      setTimeout(() => fn().catch((e) => {
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        const eUnused = e;
        return undefined;
      }), 150);
    });
  }

  router.afterEach((to) => {
    // Primary rule by route name
    runPrefetchFor(to.name as string);

    // Also try some simple heuristics: if on a parent route, prefetch common children
    if (to.name === 'app-files') {
      runPrefetchFor('app-files-list');
    }
  });

  return { rules, runPrefetchFor };
}

export default initPrefetcher;
