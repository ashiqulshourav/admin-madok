<template>
  <div class="flex justify-between w-full">
    <div class="flex-grow items-center flex mr-1 max-w-[45%] overflow-hidden">
      <div
        class="flex items-center cursor-pointer"
        @click="copyText('leagueId')"
      >
        <span
          class="w-4 h-4 flex items-center text-[12px] flex-shrink-0 justify-center bg-primary text-center rounded-full leading-4 text-white mr-1"
        >
          <span class="scale-75 font-bold">
            {{
              currentMatch.riskLevel < 0
                ? t('未')
                : currentMatch.riskLevel > 100
                ? '99+'
                : currentMatch.riskLevel
            }}
          </span>
        </span>
        <ReText
          class="leading-none flex flex-grow"
          type="primary"
          size="small"
          :tippyProps="{ content: currentMatch.leagueNameCn }"
        >
          {{ currentMatch.leagueNameCn }}
        </ReText>
      </div>
      <div
        class="flex pl-2 flex-grow cursor-pointer"
        @click="copyText('matchId')"
      >
        <div class="flex flex-grow w-0 items-center">
          <ReText
            class="leading-none"
            :type="
              currentMatch.HandicapTeam?.toUpperCase() === 'HOME'
                ? 'danger'
                : 'primary'
            "
            size="small"
            :tippyProps="{ content: currentMatch.homeTeamNameCn }"
          >
            {{ currentMatch.homeTeamNameCn }}
          </ReText>
          <span
            class="w-5 font-bold h-5 flex items-center text-[12px] scale-75 justify-center bg-[--el-color-warning] flex-shrink-0 text-white rounded-full"
            >{{ t('主') }}</span
          >
          <div class="text-[--el-color-primary] flex-shrink-0 !mr-1 !ml-1">
            V
          </div>
          <ReText
            class="leading-none"
            :type="
              currentMatch.HandicapTeam?.toUpperCase() === 'AWAY'
                ? 'danger'
                : 'primary'
            "
            size="small"
            :tippyProps="{ content: currentMatch.awayTeamNameCn }"
          >
            {{ currentMatch.awayTeamNameCn }}
          </ReText>
        </div>
      </div>
    </div>

    <div class="flex justify-end ml-2">
      <el-button
        round
        size="small"
        :class="['xl:!ml-1', locale === 'en' ? '!w-[90px]' : '!w-[61px]']"
        v-for="(item, index) in handicapList"
        :key="index"
        :type="selectContentType === item.listType ? 'primary' : ''"
        @click="changeSelectType(item.listType)"
        >{{ item.val }}({{ item.amount }})</el-button
      >
    </div>
  </div>

  <div class="flex items-center pl-3 pt-1 mb-2">
    <span>{{ currentMatch?.beginTime }}</span>
    <div class="flex pl-2 cursor-pointer mr-4">
      <IconGroup
        :typeNum="currentMatch?.isSale"
        @changeMatchStatus="changeMatchStatus"
        :operateStatus="currentMatch.operateStatus"
      />
    </div>
    <el-text type="primary">{{ currentMatch.sourceCode }}</el-text>
  </div>
</template>

<script setup lang="ts">
import { handicapListType } from '../util/type';
import { t } from '@/plugins/i18n';
import IconGroup from './IconGroup.vue';
import { ReText } from '@/components/ReText';
import { copyTextToClipboard } from '@pureadmin/utils';
import { message } from '@/utils/message';
import { useTranslationLang } from '@/layout/hooks/useTranslationLang';

const { locale } = useTranslationLang();
const props = defineProps<{
  currentMatch: sportTradingDataAPI.MatchDtoList;
  handicapList: handicapListType[];
  selectContentType: string;
}>();

const emits = defineEmits(['changeSelectType', 'changeStatus']);
//- 修改选择类型
const changeSelectType = (type: string) => {
  emits('changeSelectType', type);
};

const copyText = (type: string) => {
  let val;
  if (type === 'leagueId') {
    val = props.currentMatch.leagueId;
    message(t('联赛ID复制成功'), { type: 'success' });
  } else {
    val = props.currentMatch.matchId;
    message(t('赛事ID复制成功'), { type: 'success' });
  }

  copyTextToClipboard(val.toString());
};

//- 修改图标类型
const changeMatchStatus = (status: number) => {
  emits('changeStatus', {
    status,
    classify: 'match',
    matchId: props.currentMatch.matchId,
    item: props.currentMatch
  });
};
</script>

<style scoped></style>
