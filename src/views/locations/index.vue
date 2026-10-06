<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';

interface LocationRow {
  id: number;
  title: string;
  type: string;
  created_at: string;
  report_count: number;
}

const rows = ref<LocationRow[]>([]);
const loading = ref(false);

const total = computed(() => rows.value.length);

const loadLocations = async () => {
  loading.value = true;

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://madok.devnotation.com/api'}/locations/list`, {
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
    ElMessage.warning('Location data is not connected yet.');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  void loadLocations();
});
</script>

<template>
  <div class="page-panel">
    <div class="page-header">
      <div>
        <p class="eyebrow">Directory</p>
        <h2>Locations</h2>
      </div>
    </div>

    <el-card shadow="never">
      <template #header>
        <div class="card-title">All locations</div>
      </template>

      <div v-if="loading" class="loading-box">Loading locations…</div>
      <el-empty v-else-if="rows.length === 0" description="No locations are available yet." />

      <el-table v-else :data="rows" stripe>
        <el-table-column prop="id" label="ID" width="90" />
        <el-table-column prop="title" label="Title" min-width="220" />
        <el-table-column prop="type" label="Type" width="140" />
        <el-table-column prop="report_count" label="Reports" width="110" />
        <el-table-column prop="created_at" label="Created" width="180" />
      </el-table>
    </el-card>

    <div class="muted-label">Visible records: {{ total }}</div>
  </div>
</template>
