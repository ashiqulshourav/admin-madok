<template>
  <div class="bg-bg_color w-full pl-8 pb-3 pt-[5px]">
    <div class="text-center font-bold text-2xl mb-3 relative">
      <span>{{ t('盘口详情') }}</span>
      <IconifyIconOffline
        icon="cancelIcon"
        class="absolute right-4 top-1 cursor-pointer"
        @click="$router.go(-1)"
      />
    </div>
    <el-row>
      <el-col
        class="mb-2"
        v-for="(item, index) in renderList"
        :key="index"
        :span="item.span"
      >
        <div class="flex">
          <div class="mr-2 text-sm flex-shrink-0">{{ item.title }}:</div>
          <div class="text-sm flex" v-html="item.val"></div>
        </div>
      </el-col>
    </el-row>
    <slot> </slot>
  </div>
</template>
<script setup lang="ts">
import { useTranslationLang } from '@/layout/hooks/useTranslationLang';
import { t } from '@/plugins/i18n';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';
const { locale } = useTranslationLang();

const props = withDefaults(
  defineProps<{
    renderObj: SattleDataAPI.getSettlementDataList;
    allSettleLoading: boolean;
    hideAllSettleBtn?: boolean;
  }>(),
  { hideAllSettleBtn: false, isFootBallTitle: false }
);
const renderList = computed(() => {
  const _ = props.renderObj;
  return [
    { title: t('赛事ID'), val: _?.matchId, span: 2 },
    {
      title: t('联赛'),
      val: _?.leagueNameCn ?? history.state.params?.leagueNameCn,
      span: 4
    },
    { title: t('开赛时间'), val: _?.beginTime, span: 4 },
    {
      title: t('盘口状态'),
      val: _?.isSale === 0 ? t('未开售') : t('已开售'),
      span: locale.value === 'zh' ? 2 : 3
    },
    {
      title: t('赛种'),
      val: SPORT_ID_MAP.find(item => item.value === _?.sportId)?.label,
      span: 2
    },
    {
      title: t('比赛方'),
      val: `<span>${
        _?.homeTeamNameCn ?? '_'
      }</span> <span class="ml-1 mr-1 font-bold">VS</span> <span>${
        _?.awayTeamNameCn ?? '_'
      }</span>`,
      span: locale.value === 'zh' ? 7 : 6
    },
    {
      title: t('结算状态'),
      val: _?.fullSettlementStatus === 0 ? t('未结算') : t('已结算'),
      span: 3
    }
  ];
});
const emits = defineEmits(['allSettleBtnClick']);
</script>
<style scoped></style>
