<template>
  <div>
    <pure-table
      class="table_container"
      align-whole="center"
      showOverflowTooltip
      table-layout="fixed"
      :loading="loading"
      size="small"
      border
      adaptive
      :data="dataList"
      :header-cell-style="tableHeaderStyle"
      :pagination="{ ...pagination, pageSizes: pageSizeArr }"
      :columns="columns"
      :paginationSmall="true"
      @selection-change="handleSelectionChange"
      @page-size-change="handleSelectionChange"
      @page-current-change="handleSelectionChange"
    >
    </pure-table>
  </div>
</template>

<script setup lang="ts">
import { columns } from '../utils/DelayTimeTableList';
import { PaginationProps } from '@pureadmin/table';
import { pageSizeArr } from '@/utils/math';
import { usePublicHooks } from '@/hooks';

const props = defineProps<{
  id: string;
}>();

const { tableHeaderStyle } = usePublicHooks();
const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 12,
  currentPage: 1,
  background: true
});

const dataList = reactive<UserAPI.getBettingDelayRecordDataList[]>([]);
const loading = ref(true);

onMounted(() => {
  init();
});

const handleSelectionChange = (n: number) => {
  pagination.currentPage = n;
  init();
};

const init = async () => {
  loading.value = true;
  const res = await API.getBettingDelayRecord({
    userId: props.id,
    pageSize: pagination.pageSize,
    pageNum: pagination.currentPage
  });
  loading.value = false;
  if (res.code) return;
  dataList.length = 0;
  pagination.total = res.data.total;
  dataList.push(...res.data.list);
};
</script>

<style scoped></style>
