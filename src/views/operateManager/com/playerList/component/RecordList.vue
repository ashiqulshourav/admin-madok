<template>
  <div class="main">
    <el-dialog
      v-model="isOpen"
      class="divide-y divide-slate-200"
      width="800"
      @close="emits('onClose')"
    >
      <template #title>
        <p class="pl-5 font-medium">
          {{ title }}
        </p>
      </template>
      <PureTableBar
        :title="t(`用户ID：${props.recordForm.id}`)"
        :columns="recordColumns"
        @refresh="emits('onSearch', 'reload')"
      >
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            class="table_container"
            align-whole="center"
            showOverflowTooltip
            table-layout="auto"
            :loading="props.loading"
            :size="size"
            :default-sort="{ prop: 'level', order: 'descending' }"
            :data="props.recordList"
            :columns="dynamicColumns"
            :pagination="props.pagination"
            :paginationSmall="size === 'small' ? true : false"
            :header-cell-style="tableHeaderStyle"
            @page-size-change="handleRecordTableWidthChange"
            @page-current-change="handleRecordCurrentChange"
          />
        </template>
      </PureTableBar>
      <template #footer>
        <div class="pr-5">
          <el-button
            v-if="hasAuth('SETTING')"
            type="primary"
            @click="emits('onClose')"
            >{{ t('确定') }}</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
import { ref, watch } from 'vue';
import { recordFormType } from '../utils/types';
import { t } from '@/plugins/i18n';
import { hasAuth } from '@/router/utils';
import { usePublicHooks } from '@/hooks';
import { recordColumns } from './TableColumnList';
import type { PaginationProps } from '@pureadmin/table';

const { tableHeaderStyle } = usePublicHooks();

const props = defineProps<{
  isOpen: boolean;
  recordForm: recordFormType;
  loading: boolean;
  recordList: UserAPI.recordType[];
  pagination: PaginationProps;
}>();

const isOpen = ref(props.isOpen);
const emits = defineEmits([
  'onClose',
  'onSearch',
  'selectionChange',
  'pageSizeChange',
  'pageCurrentChange'
]);

const title = computed(() => {
  let str: string = '';
  if (props.recordForm.labelType === 1) {
    str = t('用户风控标签修改记录');
  } else if (props.recordForm.labelType === 2) {
    str = t('属性标签修改记录');
  } else {
    str = t('赔率分组修改记录');
  }
  return str;
});

function handleRecordTableWidthChange(val: number) {
  emits('pageSizeChange', val);
}

function handleRecordCurrentChange(val: number) {
  emits('pageCurrentChange', val);
}
watch(
  () => props.isOpen,
  (newValue: boolean) => {
    isOpen.value = newValue;
  }
);
</script>
