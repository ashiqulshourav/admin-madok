<template>
  <el-button
    class="reset-margin"
    link
    type="default"
    :size="size"
    v-if="!row.isBackEndReturnData"
    :icon="useRenderIcon(EditPen)"
    @click="editChild(row)"
  >
    {{ t('编辑') }}
  </el-button>

  <el-button
    class="reset-margin"
    link
    type="primary"
    :size="size"
    v-if="!row.isBackEndReturnData"
    :disabled="!row.isEdit"
    :icon="useRenderIcon('saveIcon')"
    @click="handleChildrenData"
  >
    {{ t('保存') }}
  </el-button>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import EditPen from '@iconify-icons/ep/edit-pen';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import { message } from '@/utils/message';

const props = defineProps<{
  size: any;
  list: SattleDataAPI.MatchEventsList[];
  row: SattleDataAPI.MatchEventsList;
  index: number;
}>();

const emites = defineEmits(['editChild', 'handleChildrenData']);

const editChild = (row: SattleDataAPI.MatchEventsList) =>
  emites('editChild', row);

const handleChildrenData = () => {
  if (props.index > 0) {
    if (
      (props.list![props.index - 1]!.eventTime as number) >=
      (props.row!.eventTime as number)
    ) {
      message(t('时间不能小于前一个事件发生时间'), { type: 'error' });
      props.row.eventTime = '';
      return;
    }
  }
  emites('handleChildrenData');
};
</script>

<style lang="scss" scoped></style>
