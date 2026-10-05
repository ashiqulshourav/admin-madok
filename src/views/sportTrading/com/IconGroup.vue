<template>
  <div v-if="!hasAuth('UPDATE_STATUS')">-</div>
  <template v-else>
    <IconifyIconOffline
      :style="{
        color: typeNum === SALE_STATUS.open ? '#409EFF' : '#A8ABB2'
      }"
      @click.stop="changeType(SALE_STATUS.open)"
      icon="trading_play"
    />
    <IconifyIconOffline
      class="text-sm ml-2 mr-2"
      icon="trading_switch"
      :style="{
        color: typeNum === SALE_STATUS.close ? '#F56C6C' : '#A8ABB2'
      }"
      @click.stop="changeType(SALE_STATUS.close)"
    />
    <IconifyIconOffline
      :class="['text-sm mr-2', closeThreeIcon && 'cursor-not-allowed']"
      :style="{
        color: typeNum === SALE_STATUS.sealing ? '#F56C6C' : '#A8ABB2'
      }"
      icon="trading_pause"
      @click.stop="!closeThreeIcon && changeType(SALE_STATUS.sealing)"
    />
    <IconifyIconOffline
      :style="{
        color:
          typeNum === SALE_STATUS.lock || operateStatus === 1
            ? '#F56C6C'
            : '#A8ABB2'
      }"
      :class="[operateStatus === 1 && 'cursor-not-allowed']"
      icon="trading_lock"
      @click.stop="operateStatus !== 1 && changeType(SALE_STATUS.lock)"
    />
  </template>
</template>

<script setup lang="ts">
import { SALE_STATUS } from '../util/playMap';
import { hasAuth } from '@/router/utils';
const props = defineProps<{
  typeNum?: number | null;
  closeThreeIcon?: boolean;
  renderType?: string;
  operateStatus?: number | string;
}>();

const emits = defineEmits(['changeMatchStatus']);
const changeType = (status: number) => {
  if (props.typeNum === status && props.renderType !== 'classify') return;
  emits('changeMatchStatus', status);
};
</script>

<style scoped></style>
