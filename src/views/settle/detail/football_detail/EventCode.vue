<template>
  <el-select
    :disabled="!row.isEdit"
    :class="[row.canceled && 'canceled', '!w-[150px]']"
    v-model="row.redOrYellow"
    :placeholder="t('请选择')"
    v-if="item.type === 'yellow_red_card'"
    @change="teamChangeEvent(row, index, item.tableList, item.type)"
  >
    <el-option :label="t('红牌')" :value="2" />
    <el-option :label="t('黄牌')" :value="1" />
  </el-select>
  <span v-else>{{
    MATCH_EVENT_CODE[row.eventCode as keyof typeof MATCH_EVENT_CODE]
  }}</span>
</template>

<script setup lang="ts">
import { MatchEventRowType } from './util/type';
import { MATCH_EVENT_CODE } from '@/utils/maps/sports_map';
import { t } from '@/plugins/i18n';

defineProps<
  MatchEventRowType & {
    item: SattleDataAPI.ChildrenDataList;
  }
>();
const emits = defineEmits(['teamChangeEvent']);
const teamChangeEvent = (...data: any[]) => emits('teamChangeEvent', ...data);
</script>

<style scoped></style>
