<script setup lang="ts">
import { onMounted, ref } from 'vue';

interface AuditLogRow {
  id: number;
  action: string;
  entity: string;
  description: string;
  created_at: string;
}

const rows = ref<AuditLogRow[]>([]);
const loading = ref(false);

const loadAuditLogs = async () => {
  loading.value = true;

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://madok.devnotation.com/api'}/audit/list`, {
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
  void loadAuditLogs();
});
</script>

<template>
  <div class="page-panel">
    <div class="page-header">
      <div>
        <p class="eyebrow">Security</p>
        <h2>Audit logs</h2>
      </div>
    </div>

    <el-card shadow="never">
      <template #header>
        <div class="card-title">Recent admin activity</div>
      </template>

      <div v-if="loading" class="loading-box">Loading activity…</div>
      <el-empty v-else-if="rows.length === 0" description="No audit entries are available yet." />

      <el-table v-else :data="rows" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="action" label="Action" width="180" />
        <el-table-column prop="entity" label="Entity" width="160" />
        <el-table-column prop="description" label="Description" min-width="260" />
        <el-table-column prop="created_at" label="Date" width="170" />
      </el-table>
    </el-card>
  </div>
</template>
