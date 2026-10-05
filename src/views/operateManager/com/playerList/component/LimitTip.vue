<template>
  <div v-if="category === 0" class="flex items-center justify-center">
    <div>
      <el-tooltip v-if="betDelay" effect="dark" placement="top">
        <template #content>{{ sportList }}</template>
        <span>{{ betDelay + 's' }} ,&nbsp;</span>
      </el-tooltip>
      <span v-else> - , &nbsp;</span>
    </div>
    <div>
      <el-tooltip v-if="betDelayDj" effect="dark" placement="top">
        <template #content>{{ eSportList }}</template>
        <span>{{ betDelayDj + 's' }} </span>
      </el-tooltip>
      <span v-else> - </span>
    </div>
  </div>
  <div v-else>
    <el-tooltip
      v-if="betDelayDj"
      effect="dark"
      content="123"
      placement="top-start"
    >
      <span>{{ betDelayDj + 's' }} </span>
    </el-tooltip>
    <span v-else> - </span>
  </div>
</template>

<script setup lang="ts">
import { SPORT_ID_MAP, ESPORT_ID_MAP } from '@/utils/maps/sports_map';
const props = defineProps<{
  category: number;
  betDelay: string;
  betDelayDj: string;
  sportIds: string;
  sportIdsDj: string;
}>();

const sportList = computed(() => {
  return SPORT_ID_MAP.filter(d => {
    const l = props.sportIds.split(',');
    return l.includes(d.value.toString());
  })
    .map(item => item.label)
    .join(',');
});

const eSportList = computed(() => {
  return ESPORT_ID_MAP.filter(d => {
    const l = props.sportIdsDj.split(',');
    return l.includes(d.value.toString());
  })
    .map(item => item.label)
    .join(',');
});
</script>

<style scoped></style>
