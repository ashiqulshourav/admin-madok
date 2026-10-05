import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    id: null as number | null,
    name: '',
    email: '',
    role: ''
  }),

  getters: {
    isLoggedIn: state => state.id !== null
  },

  actions: {
    clearUser() {
      this.id = null;
      this.name = '';
      this.email = '';
      this.role = '';
    }
  }
});
