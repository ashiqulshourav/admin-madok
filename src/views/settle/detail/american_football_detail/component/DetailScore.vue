<template>
  <el-col class="mb-2" :span="4">
    <div class="flex">
      <span>{{ t('上半场赛果') }}:</span>
      <span class="ml-1">{{ scoreList[0] }}</span>
    </div>
  </el-col>
  <el-col class="mb-2" :span="6">
    <div class="flex">
      <span>{{ t('下半场赛果') }}:</span>
      <span class="ml-1">{{ scoreList[1] }}</span>
    </div>
  </el-col>
  <el-col class="mb-2" :span="4">
    <div class="flex">
      <span>{{ t('加时赛赛果') }}:</span>
      <span class="ml-1">{{ scoreList[3] }}</span>
    </div>
  </el-col>
  <el-col class="mb-2" :span="6">
    <div class="flex">
      <span>{{ t('全场赛果') }}:</span>
      <span class="ml-1">{{ scoreList[2] }}</span>
    </div>
  </el-col>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';

const props = defineProps<{
  eventList: SattleDataAPI.newBasketballEventsList[];
}>();

const scoreList = computed(() => {
  let halfS1 = 0;
  let halfS2 = 0;
  let secondHalfS1 = 0;
  let secondHalfS2 = 0;
  let fullS1 = 0;
  let fullS2 = 0;
  let overTimeS1 = 0;
  let overTimeS2 = 0;
  const l = props.eventList;
  if (l[0]?.periodType === 4) {
    halfS1 = +(l[0]?.t1 || 0) + +(l[1]?.t1 || 0);
    halfS2 = +(l[0]?.t2 || 0) + +(l[1]?.t2 || 0);
    secondHalfS1 = +(l[2]?.t1 || 0) + +(l[3]?.t1 || 0);
    secondHalfS2 = +(l[2]?.t2 || 0) + +(l[3]?.t2 || 0);
    overTimeS1 = +(l[4]?.t1 || 0);
    overTimeS2 = +(l[4]?.t2 || 0);
    fullS1 =
      +(l[0]?.t1 || 0) +
      +(l[1]?.t1 || 0) +
      +(l[2]?.t1 || 0) +
      +(l[3]?.t1 || 0) +
      +(l[4]?.t1 || 0);
    fullS2 =
      +(l[0]?.t2 || 0) +
      +(l[1]?.t2 || 0) +
      +(l[2]?.t2 || 0) +
      +(l[3]?.t2 || 0) +
      +(l[4]?.t2 || 0);
  } else {
    halfS1 = +(l[0]?.t1 || 0);
    halfS2 = +(l[0]?.t2 || 0);
    secondHalfS1 = +(l[1]?.t1 || 0);
    secondHalfS2 = +(l[1]?.t2 || 0);
    overTimeS1 = +(l[2]?.t1 || 0);
    overTimeS2 = +(l[2]?.t2 || 0);
    fullS1 = +(l[0]?.t1 || 0) + +(l[1]?.t1 || 0) + +(l[2]?.t1 || 0);
    fullS2 = +(l[0]?.t2 || 0) + +(l[1]?.t2 || 0) + +(l[2]?.t2 || 0);
  }

  return [
    `${halfS1} - ${halfS2}`,
    `${secondHalfS1} - ${secondHalfS2}`,
    `${fullS1} - ${fullS2}`,
    `${overTimeS1} - ${overTimeS2}`
  ];
});
</script>

<style scoped></style>
