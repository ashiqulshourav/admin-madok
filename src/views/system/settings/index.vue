<script setup lang="ts">
import { onMounted, ref } from 'vue';

interface SettingItem {
  key: string;
  value: string;
  type: string;
  description: string;
}

const rows = ref<SettingItem[]>([]);
const loading = ref(false);

const loadSettings = async () => {
  loading.value = true;

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://madok.devnotation.com/api'}/settings/list`, {
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
  void loadSettings();
});
</script>

<template>
  <div class="page-panel">
    <div class="page-header">
      <div>
        <p class="eyebrow">Configuration</p>
        <h2>Settings</h2>
      </div>
    </div>

    <el-card shadow="never">
      <template #header>
        <div class="card-title">Database-driven settings</div>
      </template>

      <div v-if="loading" class="loading-box">Loading settings…</div>
      <el-empty v-else-if="rows.length === 0" description="No settings are configured yet." />

      <el-table v-else :data="rows" stripe>
        <el-table-column prop="key" label="Key" min-width="220" />
        <el-table-column prop="value" label="Value" width="180" />
        <el-table-column prop="type" label="Type" width="120" />
        <el-table-column prop="description" label="Description" min-width="260" />
      </el-table>
    </el-card>
  </div>
</template>
