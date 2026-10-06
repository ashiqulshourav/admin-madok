<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { dashboardApi, type DashboardSummary } from '@/api/dashboard';

interface StatCard {
  title: string;
  value: number;
  tone: 'primary' | 'success' | 'warning' | 'info';
}

const loading = ref(false);
const summary = ref<DashboardSummary>({});

const stats = computed<StatCard[]>(() => [
  { title: 'Total Reports', value: summary.value.total_reports || 0, tone: 'primary' },
  { title: 'Reports Today', value: summary.value.reports_today || 0, tone: 'success' },
  { title: 'Reports This Week', value: summary.value.reports_this_week || 0, tone: 'warning' },
  { title: 'Reports This Month', value: summary.value.reports_this_month || 0, tone: 'info' }
]);

const loadSummary = async () => {
  loading.value = true;

  try {
    const response = await dashboardApi.summary();
    summary.value = response.data?.data || {};
  } catch (error) {
    summary.value = {};
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  void loadSummary();
});
</script>

<template>
  <div class="page-panel">
    <div class="page-header">
      <div>
        <p class="eyebrow">Overview</p>
        <h2>Dashboard</h2>
      </div>
    </div>

    <div v-if="loading" class="loading-box">Loading dashboard…</div>

    <div v-else class="stats-grid">
      <div v-for="stat in stats" :key="stat.title" class="stat-card" :class="stat.tone">
        <span>{{ stat.title }}</span>
        <strong>{{ stat.value }}</strong>
      </div>
    </div>

    <div class="info-grid">
      <el-card shadow="never">
        <template #header>
          <div class="card-title">Summary</div>
        </template>
        <ul class="key-value-list">
          <li><span>Total Locations</span><strong>{{ summary.total_locations || 0 }}</strong></li>
          <li><span>Deleted Reports</span><strong>{{ summary.deleted_reports || 0 }}</strong></li>
          <li><span>Deleted Locations</span><strong>{{ summary.deleted_locations || 0 }}</strong></li>
          <li><span>Active Admin Users</span><strong>{{ summary.active_admin_users || 0 }}</strong></li>
        </ul>
      </el-card>

      <el-card shadow="never">
        <template #header>
          <div class="card-title">Real-time status</div>
        </template>
        <el-empty description="No recent activity is available yet. Connect the Madok admin API to populate live data." />
      </el-card>
    </div>
  </div>
</template>
