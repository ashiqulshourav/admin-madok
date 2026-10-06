import { defineStore } from 'pinia';
import { authApi, type AdminUser } from '@/api/auth';

interface AuthState {
  user: AdminUser | null;
  permissions: string[];
  csrfToken: string;
  isReady: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    permissions: [],
    csrfToken: sessionStorage.getItem('madok_csrf') || '',
    isReady: false
  }),

  getters: {
    isAuthenticated: state => Boolean(state.user),
    hasPermission: state => (permission: string) => {
      if (!permission) {
        return true;
      }

      return state.permissions.includes(permission) || state.permissions.includes('*');
    }
  },

  actions: {
    async initialize() {
      if (this.isReady) {
        return true;
      }

      try {
        const response = await authApi.me();
        const payload = response.data?.data;

        if (payload?.user) {
          this.user = payload.user;
          this.permissions = payload.permissions || [];
          this.csrfToken = payload.csrf_token || this.csrfToken;
          this.isReady = true;
          return true;
        }

        this.clearSession();
        return false;
      } catch (error) {
        this.clearSession();
        return false;
      }
    },

    async login(email: string, password: string) {
      const response = await authApi.login({ email, password });
      const payload = response.data?.data;

      if (!payload?.user) {
        throw new Error('Unable to sign in.');
      }

      this.user = payload.user;
      this.permissions = payload.permissions || [];
      this.csrfToken = payload.csrf_token || this.csrfToken;
      this.isReady = true;

      if (this.csrfToken) {
        sessionStorage.setItem('madok_csrf', this.csrfToken);
      }

      return payload;
    },

    async logout() {
      try {
        await authApi.logout();
      } catch (error) {
        // Ignore backend logout failures and clear local session anyway.
      }

      this.clearSession();
    },

    clearSession() {
      this.user = null;
      this.permissions = [];
      this.csrfToken = '';
      this.isReady = false;
      sessionStorage.removeItem('madok_csrf');
    }
  }
});
