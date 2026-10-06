<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import { hasPermission } from '@/utils/permissions';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const menuItems = computed(() => {
  const permissions = authStore.permissions;

  return [
    {
      label: 'Dashboard',
      to: '/dashboard',
      permission: 'dashboard.view'
    },
    {
      label: 'Reports',
      to: '/reports',
      permission: 'reports.view'
    },
    {
      label: 'Locations',
      to: '/locations',
      permission: 'locations.view'
    },
    {
      label: 'Statistics',
      to: '/statistics',
      permission: 'statistics.view'
    },
    {
      label: 'Admin Users',
      to: '/system/users',
      permission: 'users.view'
    },
    {
      label: 'Roles & Permissions',
      to: '/system/roles',
      permission: 'roles.manage'
    },
    {
      label: 'Settings',
      to: '/system/settings',
      permission: 'settings.manage'
    },
    {
      label: 'Audit Logs',
      to: '/system/audit-logs',
      permission: 'audit.view'
    }
  ].filter(item => hasPermission(permissions, item.permission));
});

const currentUserName = computed(() => authStore.user?.name || 'Administrator');
const currentUserEmail = computed(() => authStore.user?.email || 'admin@madok.local');

const logout = async () => {
  await authStore.logout();
  await router.push('/login');
};

const isActive = (path: string) => route.path.startsWith(path);
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand-block">
        <div class="brand-mark">M</div>
        <div>
          <div class="brand-name">Madok</div>
          <div class="brand-subtitle">Admin</div>
        </div>
      </div>

      <nav class="sidebar-nav">
        <RouterLink
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          class="nav-item"
          :class="{ active: isActive(item.to) }"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="user-card">
        <div class="user-avatar">{{ currentUserName.charAt(0).toUpperCase() }}</div>
        <div>
          <div class="user-name">{{ currentUserName }}</div>
          <div class="user-email">{{ currentUserEmail }}</div>
        </div>
        <button class="logout-button" type="button" @click="logout">Logout</button>
      </div>
    </aside>

    <div class="content-panel">
      <header class="topbar">
        <div>
          <p class="eyebrow">Operations</p>
          <h1>{{ route.meta.title || 'Madok Admin' }}</h1>
        </div>
        <div class="topbar-actions">
          <span class="status-pill" :class="authStore.user?.status === 'disabled' ? 'disabled' : 'active'">
            {{ authStore.user?.status || 'active' }}
          </span>
        </div>
      </header>

      <main class="page-content">
        <router-view />
      </main>
    </div>
  </div>
</template>
