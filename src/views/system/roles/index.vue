<script setup lang="ts">
import { onMounted, ref } from 'vue';

interface RoleRow {
  id: number;
  name: string;
  description: string;
  permissions: string[];
}

const rows = ref<RoleRow[]>([]);
const loading = ref(false);

const loadRoles = async () => {
  loading.value = true;

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://madok.devnotation.com/api'}/roles/list`, {
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
  void loadRoles();
});
</script>

<template>
  <div class="page-panel">
    <div class="page-header">
      <div>
        <p class="eyebrow">Security</p>
        <h2>Roles & permissions</h2>
      </div>
    </div>

    <el-card shadow="never">
      <template #header>
        <div class="card-title">Role matrix</div>
      </template>

      <div v-if="loading" class="loading-box">Loading roles…</div>
      <el-empty v-else-if="rows.length === 0" description="No roles are available yet." />

      <el-table v-else :data="rows" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="description" label="Description" min-width="240" />
        <el-table-column label="Permissions" min-width="220">
          <template #default="scope">
            <span>{{ (scope.row.permissions || []).slice(0, 4).join(', ') }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
