<template>
  <div class="search-form bg-bg_color w-[99/100] pt-[12px]">
    <div class="flex flex-col items-center">
      <div class="tex-xs py-2 flex justify-center">
        <span class="mr-1">{{ t('联赛ID') }}:</span>
        <span class="mr-1">{{ matchDetail.leagueId }}</span>
        <span>{{ matchDetail.leagueNameCn }}</span>
      </div>
      <div class="flex items-start justify-center">
        <span class="mt-2 min-w-[140px] text-center"
          >{{ matchDetail.homeTeamNameCn }} ({{ t('主') }})</span
        >
        <div class="flex items-center text-3xl flex-col mx-2">
          <span> {{ score[0] }} VS {{ score[1] }} </span>
          <div class="text-sm mb-1">
            {{ MATCH_STATUS[matchDetail.status as keyof typeof MATCH_STATUS] }}
          </div>
        </div>
        <span class="mt-2 min-w-[140px] text-center"
          >{{ matchDetail.awayTeamNameCn }}（{{ t('客') }}）</span
        >
      </div>

      <div class="flex text-sm flex-col">
        <div class="flex items-center">
          <span class="mr-1">{{ t('赛事ID') }}:</span>
          <span class="mr-1">{{ matchDetail.matchId }}</span>
          <span class="mr-1">{{ t('比赛时间') }}: </span>
          <span
            >{{ matchDetail.beginTime }}
            {{ WEEK_MAP[dayjs(matchDetail.beginTime).day()] }}</span
          >
        </div>
      </div>
      <div class="text-sm my-2">
        {{ t('数据有效期') }}: {{ matchDetail.dataValidityPeriod }}{{ t('天') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { MATCH_STATUS } from '@/utils/maps/sports_map';
import dayjs from 'dayjs';
import { WEEK_MAP } from '@/utils/formatDate';

const emits = defineEmits(['onSearch', 'exportFile']);
const props = defineProps<{
  matchDetail: EventAPI.oddsHistoryMatchDetailData;
}>();

const score = computed(() => {
  if (!props.matchDetail!.currentScore) return [0, 0];
  return props.matchDetail!.currentScore!.slice(1).split('A').join('');
});
</script>

<style scoped lang="scss"></style>
