<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';

interface ReportRow {
  id: number;
  title: string;
  type: string;
  status: string;
  created_at: string;
}

const rows = ref<ReportRow[]>([]);
const loading = ref(false);

const total = computed(() => rows.value.length);

const loadReports = async () => {
  loading.value = true;

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://madok.devnotation.com/api'}/reports/list`, {
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
  } catch (error) {
    rows.value = [];
    ElMessage.warning('Reports endpoint is not available yet. Connect the Madok admin API to view live data.');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  void loadReports();
});
</script>

<template>
  <div class="page-panel">
    <div class="page-header">
      <div>
        <p class="eyebrow">Content</p>
        <h2>Reports</h2>
      </div>
    </div>

    <el-card shadow="never">
      <template #header>
        <div class="card-title">All reports</div>
      </template>

      <div v-if="loading" class="loading-box">Loading reports…</div>
      <el-empty v-else-if="rows.length === 0" description="No reports are available yet." />

      <el-table v-else :data="rows" stripe>
        <el-table-column prop="id" label="ID" width="90" />
        <el-table-column prop="title" label="Title" min-width="200" />
        <el-table-column prop="type" label="Type" width="140" />
        <el-table-column prop="status" label="Status" width="120" />
        <el-table-column prop="created_at" label="Created" width="180" />
      </el-table>
    </el-card>

    <div class="muted-label">Visible records: {{ total }}</div>
  </div>
</template>
