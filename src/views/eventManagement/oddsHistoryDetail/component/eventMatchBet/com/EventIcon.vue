<template>
  <div
    class="absolute w-4 cursor-pointer flex items-center h-full -translate-x-1/2"
    :style="{
      left:
        (+s.time / 5400) * 100 === 100 ? '99%' : `${(+s.time / 5400) * 100}%`
    }"
    v-for="(s, l) in data"
    :key="l"
  >
    <el-tooltip placement="top-start">
      <template #content>
        <span>{{ eMap[s.type as keyof typeof eMap] }}</span>
        <span class="font-bold">&nbsp;{{ getSecond(+s.time) }}'</span>
      </template>
      <img
        :class="['w-4 h-4', s.type === 'goal' && 'animate-rotate360']"
        :src="IconMap[s.type as keyof typeof IconMap]"
      />
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { getSecond } from '@/utils/formatDate';
defineProps<{
  data: EventAPI.EventData[];
  index: number;
  type: string;
}>();

const eMap = {
  goal: t('进球'),
  yellow_card: t('黄牌'),
  corner: t('角球'),
  red_card: t('红牌')
};

//- 图标列表
const IconMap = {
  goal: new URL('@/assets/event_img/goal.png', import.meta.url).href,
  yellow_card: new URL('@/assets/event_img/yellow_card.png', import.meta.url)
    .href,
  corner: new URL('@/assets/event_img/corner.png', import.meta.url).href,
  red_card: new URL('@/assets/event_img/red.png', import.meta.url).href
};
</script>

<style scoped></style>
