<template>
  <el-dialog
    v-model="visible"
    class="divide-y divide-slate-200"
    width="800"
    :title="t('修改记录')"
  >
    <template #title> </template>
    <pure-table
      class="table_container"
      align-whole="center"
      showOverflowTooltip
      table-layout="fixed"
      :loading="loading"
      size="small"
      border
      adaptive
      :data="recordList"
      :header-cell-style="tableHeaderStyle"
      :pagination="{ ...pagination, pageSizes: pageSizeArr }"
      :columns="recordColumns"
      :paginationSmall="true"
      @selection-change="handleSelectionChange"
      @page-size-change="handleTableWidthChange"
      @page-current-change="handleSelectionChange"
    >
    </pure-table>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { t } from '@/plugins/i18n';
import { usePublicHooks } from '@/hooks';
import type { PaginationProps } from '@pureadmin/table';
import { pageSizeArr } from '@/utils/math';
import { recordColumns } from './TableColumnList';

const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true
});
const loading = ref<boolean>(false);

const { tableHeaderStyle } = usePublicHooks();

const props = defineProps({
  type: {
    type: Number,
    default: () => 0
  },
  currency: {
    type: Number,
    default: 1
  },
  modelValue: {
    type: Boolean,
    default: false
  }
});

const recordList = ref<any[]>([]);

const handleSelectionChange = (n: number) => {
  console.log(n);
  pagination.currentPage = n;
  fetch();
};
const handleTableWidthChange = (val: number) => {
  pagination.pageSize = val;
  fetch();
};
const fetch = async () => {
  loading.value = true;
  const params = {
    currency: props.currency,
    pageSize: pagination.pageSize,
    pageNum: pagination.currentPage,
    type: props.type
  };
  try {
    const res = await API.getUserLevelLimitLogList(params);
    recordList.value = res.data.list;
    pagination.total = res.data.total;
    loading.value = false;
  } catch (err) {
    loading.value = false;
  }
};
const emits = defineEmits(['onClose', 'update:modelValue']);

const visible = computed({
  get: () => props.modelValue,
  set: val => {
    emits('update:modelValue', val);
  }
});

onMounted(() => {
  fetch();
});
</script>
