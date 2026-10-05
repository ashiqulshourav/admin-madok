<template>
  <div class="pt-4">
    <pure-table
      class="table_container"
      align-whole="center"
      showOverflowTooltip
      table-layout="auto"
      :loading="loading"
      size="small"
      border
      adaptive
      :data="dataList"
      :columns="columns"
      :pagination="{ ...pagination, pageSizes: pageSizeArr }"
      :paginationSmall="true"
      :header-cell-style="tableHeaderStyle"
      @page-current-change="handleCurrentChange"
    >
      <template #methods="{ row }: { row: EventAPI.PageData }">
        <div class="flex flex-col">
          <span>
            {{ useSportFormatDetail(row.combineOrderDetails[0])[4] }}
          </span>
          <span
            >{{ useSportFormatDetail(row.combineOrderDetails[0])[3] }} @{{
              getViewOddFn(
                row.combineOrderDetails[0].oddFinally,
                row.combineOrderDetails[0].marketTypeFinally,
                row.combineOrderDetails[0].marketType
              )
            }}</span
          >
        </div>
      </template>
    </pure-table>
  </div>
</template>

<script setup lang="ts">
import { usePublicHooks } from '@/hooks';
import { PaginationProps } from '@pureadmin/table';
import { columns } from '../util/betColumn';
import { useSportFormatDetail, getViewOddFn } from '@/utils/formatMatch';
import { pageSizeArr } from '@/utils/math';

const props = defineProps<{
  index: number;
  matchId: number | string;
}>();

const { tableHeaderStyle } = usePublicHooks();
const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true
});

const loading = ref(false);

onMounted(() => {
  init();
});
/* 
{
  "matchId": 0,
  "startMinutes": 0,
  "pageSize": 20,
  "pageNum": 1
}
 */

const handleCurrentChange = () => {};
const dataList = reactive<EventAPI.PageData[]>([]);
const init = async () => {
  const res = await API.getMatchBetList({
    matchId: props.matchId,
    startMinutes: props.index,
    pageSize: pagination.pageSize,
    pageNum: pagination.currentPage
  });
  if (res.code) return;
  pagination.total = res.data.count;
  dataList.length = 0;
  dataList.push(...res.data.pageData);
};
</script>
