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
          title: 'Inicio',
        },
        redirect: { name: 'app-files-list' },
      },
      {
        path: 'files',
        name: 'app-files',
        component: () => import('../views/app/files/index.vue'),
        meta: {
          title: 'Archivos',
          requiresAuth: true,
        },
        children: [
          {
            path: '',
            name: 'app-files-list',
            component: () => import('../views/app/files/list.vue'),
            meta: {
              title: 'Archivos',
            },
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  // Set title
  if (to.meta.title) {
    document.title = `${to.meta.title} - sky`;
  }

  if (to.matched.some((record: RouteRecordRaw) => record.meta?.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!localStorage.getItem('token')) {
      const { VUE_APP_DG_USERS_APP } = process.env;
      window.location.href = `${VUE_APP_DG_USERS_APP}/auth/provider?app=sky`;
    } else {
      next();
    }
  }
  next();
});

export default router;
