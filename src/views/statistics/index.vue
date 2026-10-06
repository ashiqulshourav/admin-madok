<script setup lang="ts">
import { onMounted, ref } from 'vue';

const metricGroups = ref([
  { label: 'Daily reports', value: 0 },
  { label: 'Weekly reports', value: 0 },
  { label: 'Monthly reports', value: 0 },
  { label: 'Top reported locations', value: 0 }
]);

const loading = ref(false);

const loadStatistics = async () => {
  loading.value = true;

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://madok.devnotation.com/api'}/statistics/overview`, {
      credentials: 'include',
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) {
      return;
    }

    const payload = await response.json();
    const data = payload?.data || {};

    metricGroups.value = [
      { label: 'Daily reports', value: Number(data.daily_reports || 0) },
      { label: 'Weekly reports', value: Number(data.weekly_reports || 0) },
      { label: 'Monthly reports', value: Number(data.monthly_reports || 0) },
      { label: 'Top reported locations', value: Number(data.top_locations || 0) }
    ];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  void loadStatistics();
});
</script>

<template>
  <div class="page-panel">
    <div class="page-header">
      <div>
        <p class="eyebrow">Analytics</p>
        <h2>Statistics</h2>
      </div>
    </div>

    <div v-if="loading" class="loading-box">Loading statistics…</div>

    <div v-else class="stats-grid">
      <div v-for="item in metricGroups" :key="item.label" class="stat-card primary">
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
      </div>
    </div>
  </div>
</template>
