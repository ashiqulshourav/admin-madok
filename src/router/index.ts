import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw
} from 'vue-router';

import AdminLayout from '@/layout/AdminLayout.vue';
import LoginView from '@/views/login/index.vue';
import DashboardView from '@/views/dashboard/index.vue';
import ReportsView from '@/views/reports/index.vue';
import LocationsView from '@/views/locations/index.vue';
import StatisticsView from '@/views/statistics/index.vue';
import UsersView from '@/views/system/users/index.vue';
import RolesView from '@/views/system/roles/index.vue';
import SettingsView from '@/views/system/settings/index.vue';
import AuditLogsView from '@/views/system/audit-logs/index.vue';
import ForbiddenView from '@/views/error/403.vue';
import NotFoundView from '@/views/error/404.vue';
import { useAuthStore } from '@/store/auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      guest: true,
      title: 'Sign in'
    }
  },
  {
    path: '/',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard' },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: DashboardView,
        meta: { requiresAuth: true, permission: 'dashboard.view', title: 'Dashboard' }
      },
      {
        path: 'reports',
        name: 'Reports',
        component: ReportsView,
        meta: { requiresAuth: true, permission: 'reports.view', title: 'Reports' }
      },
      {
        path: 'locations',
        name: 'Locations',
        component: LocationsView,
        meta: { requiresAuth: true, permission: 'locations.view', title: 'Locations' }
      },
      {
        path: 'statistics',
        name: 'Statistics',
        component: StatisticsView,
        meta: { requiresAuth: true, permission: 'statistics.view', title: 'Statistics' }
      },
      {
        path: 'system/users',
        name: 'AdminUsers',
        component: UsersView,
        meta: { requiresAuth: true, permission: 'users.view', title: 'Admin users' }
      },
      {
        path: 'system/roles',
        name: 'Roles',
        component: RolesView,
        meta: { requiresAuth: true, permission: 'roles.manage', title: 'Roles & permissions' }
      },
      {
        path: 'system/settings',
        name: 'Settings',
        component: SettingsView,
        meta: { requiresAuth: true, permission: 'settings.manage', title: 'Settings' }
      },
      {
        path: 'system/audit-logs',
        name: 'AuditLogs',
        component: AuditLogsView,
        meta: { requiresAuth: true, permission: 'audit.view', title: 'Audit logs' }
      }
    ]
  },
  {
    path: '/error/403',
    name: 'Forbidden',
    component: ForbiddenView,
    meta: { title: 'Forbidden' }
  },
  {
    path: '/error/404',
    name: 'NotFound',
    component: NotFoundView,
    meta: { title: 'Page not found' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/error/404'
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();

  if (!authStore.isReady && !to.meta.guest) {
    await authStore.initialize();
  }

  if (to.meta.guest && authStore.isAuthenticated) {
    next('/dashboard');
    return;
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ path: '/login', query: { redirect: to.fullPath } });
    return;
  }

  if (to.meta.permission && !authStore.hasPermission(String(to.meta.permission))) {
    next('/error/403');
    return;
  }

  next();
});

export default router;
