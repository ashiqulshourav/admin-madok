<template>
  <div>
    <div class="translate-y-[-17px] w-[200px]">
      <span class="font-bold">{{ t('IP关联详情') }}</span>
      -
      <span>{{ ip }}</span>
    </div>
    <pure-table
      table-layout="auto"
      class="table_container"
      align-whole="center"
      :loading="loading"
      size="small"
      adaptive
      border
      :data="list"
      :columns="IpListColumn"
      :pagination="pagination"
      :paginationSmall="true"
      :header-cell-style="tableHeaderStyle"
      @page-size-change="handleCurrentChange"
      @page-current-change="handleCurrentChange"
    >
      <template #riskControlLabel="{ row }">
        <div class="p-1">
          <el-row
            v-if="row.riskControlLabelList.length"
            class="items-center"
            :gutter="20"
          >
            <LabelListCom
              :labels="row.riskControlLabelList"
              type="risk"
              expand
            />
          </el-row>
          <span v-else>-</span>
        </div>
      </template>
    </pure-table>
  </div>
</template>

<script setup lang="ts">
import type { PaginationProps } from '@pureadmin/table';
import { pageSizeArr } from '@/utils/math';
import { message } from '@/utils/message';
import { IpListColumn } from '../util/ipListColumn';
import { usePublicHooks } from '@/hooks';
import { t } from '@/plugins/i18n';
import LabelListCom from '../../playerList/component/LabelListCom.vue';
const { tableHeaderStyle } = usePublicHooks();

const { ip } = defineProps<{
  ip: string;
}>();
onMounted(() => {
  init();
});

const loading = ref(true);
const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true,
  pageSizes: pageSizeArr
});

function handleCurrentChange(val: number) {
  pagination.currentPage = val;
  init();
}

//- 初始化数据请求
const list = reactive<BetOrderAPI.getUserByIpResPageData[]>([]);
const init = async () => {
  loading.value = true;
  const res = await API.getUserByIp({
    ip,
    pageSize: pagination.pageSize,
    pageNum: pagination.currentPage
  });
  loading.value = false;
  if (res.code) return message(res.msg, { type: 'error' });
  pagination.total = res.data.count;
  list.length = 0;
  list.push(...res.data.pageData);
};
</script>

<style scoped></style>
