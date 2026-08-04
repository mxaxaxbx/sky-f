import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  RouteLocationNormalized,
  NavigationGuardNext,
} from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/home/home.vue'),
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  },
  // auth routes
  {
    path: '/auth',
    name: 'auth',
    component: () => import('../views/auth/index.vue'),
    children: [
      {
        path: 'confirmsession',
        name: 'confirmsession',
        component: () => import('../views/auth/confirmsession.vue'),
        meta: {
          title: 'Verificando sesión',
        },
      },
    ],
  },
  // public share route (no authentication required)
  {
    path: '/share/:token',
    name: 'share',
    component: () => import('../views/share/index.vue'),
    meta: {
      title: 'Shared with you',
    },
  },
  // app routes
  {
    path: '/app',
    name: 'app',
    component: () => import('../views/app/index.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: 'app-home',
        // component: () => import('../views/app/home.vue'),
        meta: {
          title: 'Home',
        },
        redirect: { name: 'app-files-list' },
      },
      // files
      {
        path: 'files',
        name: 'app-files',
        component: () => import('../views/app/files/index.vue'),
        meta: {
          title: 'Cloud Drive',
          requiresAuth: true,
        },
        children: [
          {
            path: '',
            name: 'app-files-list',
            component: () => import('../views/app/files/list.vue'),
            meta: {
              title: 'Cloud Drive',
            },
          },
          {
            path: 'details/:id',
            name: 'app-files-details',
            component: () => import('../views/app/files/details.vue'),
            meta: {
              title: 'Details',
            },
          },
        ],
      },
      // search
      {
        path: 'search',
        name: 'app-search',
        component: () => import('../views/app/search/index.vue'),
        meta: {
          title: 'Search',
          requiresAuth: true,
        },
      },
      // folders
      {
        path: 'folders',
        name: 'app-folders',
        component: () => import('../views/app/folders/index.vue'),
        meta: {
          title: 'Folders',
          requiresAuth: true,
        },
        children: [
          {
            path: ':id',
            name: 'app-folders-content',
            component: () => import('../views/app/folders/content.vue'),
            meta: {
              title: 'Contenido de la carpeta',
            },
          },
        ],
      },
      // trash
      {
        path: 'trash',
        name: 'app-trash',
        component: () => import('../views/app/trash/index.vue'),
        meta: {
          title: 'Event Horizon',
          requiresAuth: true,
        },
      },
      // editor
      {
        path: 'editor',
        name: 'app-editor',
        component: () => import('../views/EditorView.vue'),
        meta: {
          title: 'Editor',
          requiresAuth: true,
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.onError((error) => {
  if (error.name === 'ChunkLoadError' || error.message.includes('Failed to fetch dynamically imported module')) {
    window.location.reload();
  }
});

router.beforeEach((to, from, next) => {
  // Set title
  if (to.meta.title) {
    document.title = `${to.meta.title} - sky`;
  }

  if (
    to.matched.some(
      (record: RouteRecordRaw) => record.meta?.requiresAuth,
    )
  ) {
    if (!localStorage.getItem('token')) {
      const { VUE_APP_DG_USERS_APP } = process.env;
      window.location.href = `${VUE_APP_DG_USERS_APP}/auth/provider?app=sky`;
      return false;
    }
  }

  if (to.query.redirect && !to.path.startsWith('/auth')) {
    if (to.query.redirect === 'undefined') {
      return next({ name: 'app-home' });
    }
    // redirect to the to path
    return next(to.query.redirect as string);
  }

  return next();
});

export default router;
