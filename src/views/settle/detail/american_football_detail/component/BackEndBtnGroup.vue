<template>
  <div class="flex">
    <template
      v-if="renderObj.settlementType === 2 && renderObj.reSettleStatus === 0"
    >
      <el-button
        class="reset-margin"
        link
        type="primary"
        size="small"
        :icon="useRenderIcon('settle')"
        @click="resetMatchEvent(row, index)"
      >
        {{ !row.isEdit ? t('开启重新结算') : t('重新结算') }}
      </el-button>
      <el-button
        class="reset-margin"
        link
        type="danger"
        size="small"
        :icon="useRenderIcon(Delete)"
        @click="cancelMatchEvent(row, index)"
      >
        {{ t('取消事件') }}
      </el-button>
    </template>
    <template v-if="renderObj.reSettleStatus === 1">
      <el-button
        class="reset-margin"
        link
        type="primary"
        size="small"
        @click="row.isEdit = true"
      >
        {{ t('编辑') }}
      </el-button>
      <el-button
        class="reset-margin"
        link
        type="primary"
        size="small"
        @click="confirmResetMatchEvent(row, true)"
      >
        {{ t('保存') }}
      </el-button>
      <el-button
        class="reset-margin"
        link
        type="danger"
        size="small"
        @click="deletMatchevent(row, index)"
      >
        {{ t('删除') }}
      </el-button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import { t } from '@/plugins/i18n';
import Delete from '@iconify-icons/ep/delete';

defineProps<{
  row: SattleDataAPI.newBasketballEventsList;
  dataList: SattleDataAPI.newBasketballEventsList[];
  index: number;
  renderObj: SattleDataAPI.getSettlementDataList;
}>();

const emits = defineEmits([
  'cancelMatchEvent',
  'resetSettleBtnClick',
  'resetMatchEvent',
  'confirmResetMatchEvent',
  'deletMatchevent'
]);

const cancelMatchEvent = (...data) => emits('cancelMatchEvent', ...data);
const resetMatchEvent = (...data) => emits('resetMatchEvent', ...data);
const deletMatchevent = (...data) => emits('deletMatchevent', ...data);
const confirmResetMatchEvent = (...data) =>
  emits('confirmResetMatchEvent', ...data);
</script>

<style scoped></style>
