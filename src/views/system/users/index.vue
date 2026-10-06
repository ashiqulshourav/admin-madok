<script setup lang="ts">
import { onMounted, ref } from 'vue';

interface UserRow {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

const rows = ref<UserRow[]>([]);
const loading = ref(false);

const loadUsers = async () => {
  loading.value = true;

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://madok.devnotation.com/api'}/users/list`, {
      credentials: 'include',
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) {
      rows.value = [];
      return;
    }

    const payload = await response.json();
    rows.value = Array.isArray(payload?.data?.items)
      ? payload.data.items
      : Array.isArray(payload?.data?.list)
        ? payload.data.list
        : [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  void loadUsers();
});
</script>

<template>
  <div class="page-panel">
    <div class="page-header">
      <div>
        <p class="eyebrow">System</p>
        <h2>Admin users</h2>
      </div>
    </div>

    <el-card shadow="never">
      <template #header>
        <div class="card-title">User management</div>
      </template>

      <div v-if="loading" class="loading-box">Loading users…</div>
      <el-empty v-else-if="rows.length === 0" description="No admin users are available yet." />

      <el-table v-else :data="rows" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="Name" width="150" />
        <el-table-column prop="email" label="Email" min-width="200" />
        <el-table-column prop="role" label="Role" width="140" />
        <el-table-column prop="status" label="Status" width="110" />
        <el-table-column prop="created_at" label="Created" width="170" />
      </el-table>
    </el-card>
  </div>
</template>
