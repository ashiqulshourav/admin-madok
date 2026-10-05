import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw
} from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },

  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index.vue')
  },

  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
