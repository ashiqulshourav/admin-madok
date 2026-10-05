<template>
  <div class="flex">
    <div class="flex mr-2">
      <el-button
        size="small"
        :type="
          currentMatch.status === MATCH_STATUS.nover ? 'danger' : 'primary'
        "
        >{{
          currentMatch.status === MATCH_STATUS.nover ? t('滚球') : t('早盘')
        }}</el-button
      >
      <el-button size="small" color="#337ecc">{{ t('足球') }}</el-button>
    </div>
    <div class="flex items-start">
      <div class="flex flex-col">
        <div
          v-if="currentMatch.leagueId"
          class="flex items-center cursor-pointer"
          v-copy:click="{
            val: currentMatch.leagueId,
            tip: t('联赛ID复制成功')
          }"
        >
          <span
            class="w-4 h-4 flex items-center text-[12px] justify-center bg-primary text-center rounded-full text-white"
          >
            <span class="scale-75 font-bold">
              {{
                +currentMatch.riskLevel >= 200 || +currentMatch.riskLevel == -1
                  ? t('未')
                  : currentMatch.riskLevel
              }}
            </span>
          </span>
          <span class="text-[#409EFF] text-xs ml-1 font-bold">
            {{ currentMatch?.leagueNameCn }}
          </span>
        </div>
        <div class="text-xs mt-1" style="line-height: inherit">
          {{ currentMatch?.beginTime }}
        </div>
      </div>
      <div
        v-if="currentMatch.matchId"
        class="flex flex-col items-start pl-3 ml-3 text-sm cursor-pointer"
        v-copy:click="{
          val: currentMatch.matchId,
          tip: t('赛事ID复制成功')
        }"
      >
        <div class="flex items-center">
          <div
            style="line-height: inherit"
            :class="[
              ' text-xs flex items-center ',
              currentMatch.HandicapTeam?.toUpperCase() === 'HOME'
                ? 'text-[--el-color-danger]'
                : 'text-[--el-color-primary]'
            ]"
          >
            <span>{{ currentMatch?.homeTeamNameCn }}</span>
            <span
              class="w-5 font-bold h-5 flex items-center text-xs scale-75 justify-center bg-[--el-color-warning] text-white rounded-full"
              >{{ t('主') }}</span
            >
          </div>
          <div class="text-[--el-color-primary] !mr-1 !ml-1 text-xs">V</div>
          <div
            :class="[
              'text-xs',
              currentMatch.HandicapTeam?.toUpperCase() === 'AWAY'
                ? 'text-[--el-color-danger]'
                : 'text-[--el-color-primary] '
            ]"
          >
            {{ currentMatch?.awayTeamNameCn }}
          </div>
        </div>
        <div class="flex mt-1 cursor-pointer text-xs items-center">
          <IconGroup
            :typeNum="currentMatch?.isSale"
            :operateStatus="currentMatch.operateStatus"
            @changeMatchStatus="changeMatchStatus"
          />
          <el-text class="!ml-4" type="primary">{{
            currentMatch.betItemsResultDto.sourceCode
          }}</el-text>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import IconGroup from '../../com/IconGroup.vue';
import { MATCH_STATUS } from '../../util/playMap';

const props = defineProps<{
  currentMatch: sportTradingDataAPI.getAlarmMatchListType;
}>();

const emits = defineEmits(['changeSelectType', 'changeStatus']);

//- 修改图标类型
const changeMatchStatus = (status: number) => {
  emits('changeStatus', {
    matchId: props.currentMatch.matchId,
    status,
    classify: 'match'
  });
};
</script>

<style scoped></style>
