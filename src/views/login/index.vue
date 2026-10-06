<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '@/store/auth';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const form = reactive({
  email: '',
  password: ''
});

const loading = ref(false);
const errorMessage = ref('');

const onSubmit = async () => {
  errorMessage.value = '';

  if (!form.email || !form.password) {
    errorMessage.value = 'Email and password are required.';
    return;
  }

  loading.value = true;

  try {
    await authStore.login(form.email, form.password);
    const redirectTarget = String(route.query.redirect || '/dashboard');
    await router.push(redirectTarget);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to sign in.';
    errorMessage.value = message;
    ElMessage.error(message);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-brand">
        <div class="brand-mark">M</div>
        <div>
          <div class="brand-name">Madok</div>
          <div class="brand-subtitle">Administration</div>
        </div>
      </div>

      <h1>Welcome back</h1>
      <p class="subtitle">Sign in to manage reports, locations, users, and settings.</p>

      <el-alert
        v-if="errorMessage"
        :title="errorMessage"
        type="error"
        show-icon
        :closable="false"
        class="login-alert"
      />

      <el-form :model="form" class="login-form" @submit.prevent="onSubmit">
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" type="email" placeholder="name@madok.dev" />
        </el-form-item>

        <el-form-item label="Password" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            placeholder="Enter your password"
          />
        </el-form-item>

        <el-button type="primary" class="submit-button" :loading="loading" @click="onSubmit">
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </el-button>
      </el-form>
    </div>
  </div>
</template>
