<template>
  <div class="bg-bg_color w-full pl-8 pb-3 pt-[12px]">
    <div class="text-center font-bold text-2xl mb-3 relative">
      <span>{{ t('盘口详情') }}</span>
      <IconifyIconOffline
        icon="cancelIcon"
        class="absolute right-4 top-1 cursor-pointer"
        @click="$router.go(-1)"
      />
    </div>
    <el-row :gutter="20">
      <el-col
        class="mb-2"
        v-for="(item, index) in renderList"
        :key="index"
        :span="item.span"
      >
        <div class="flex items-center">
          <div class="mr-2 text-sm flex-shrink-0">{{ item.title }}:</div>
          <div class="text-sm flex" v-html="item.val"></div>
          <el-text
            class="!ml-2 cursor-pointer"
            type="primary"
            v-if="index === 7 && hasAuth('ENABLEMANUALSETTLE')"
            @click="eidtMatchRule"
            >{{ t('编辑') }}</el-text
          >
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="text-sm">
      <slot> </slot>
      <el-col :span="4" v-if="!hideAllSettleBtn">
        <el-button
          v-if="hasAuth('FULLSETTLE')"
          :type="renderObj.fullSettlementStatus === 1 ? 'danger' : 'primary'"
          :loading="allSettleLoading"
          :disabled="renderObj.fullSettlementStatus === 1"
          @click="allSettleBtnClick"
          size="small"
        >
          {{
            renderObj.fullSettlementStatus === 1 ? t('结算完成') : t('全场结算')
          }}
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';
import { hasAuth } from '@/router/utils';
import { addDialog, closeDialog } from '@/components/ReDialog';
import UdateMatchRuleDialog from './UdateMatchRuleDialog.vue';

const props = withDefaults(
  defineProps<{
    renderObj: SattleDataAPI.getSettlementDataList;
    allSettleLoading: boolean;
    hideAllSettleBtn?: boolean;
    isFootBallTitle?: boolean;
    baseTitle?: string;
    eventList: SattleDataAPI.newBasketballEventsList[];
  }>(),
  {
    hideAllSettleBtn: false,
    isFootBallTitle: false
  }
);

const emits = defineEmits(['allSettleBtnClick', 'reloadMatch']);
const allSettleBtnClick = () => emits('allSettleBtnClick');

//- 编辑赛事规则
const eidtMatchRule = () => {
  addDialog({
    title: t('赛制编辑'),
    width: '25%',
    center: true,
    closeOnClickModal: false,
    hideFooter: true,
    showClose: false,
    contentRenderer: ({ options, index }) =>
      h(UdateMatchRuleDialog, {
        matchId: props.renderObj.matchId,
        sportId: props.renderObj.sportId,
        periodType: props.renderObj.periodType,
        onCloseDialog: (_: boolean) => {
          closeDialog(options, index);
          if (_) emits('reloadMatch');
        }
      })
  });
};

const renderList = computed(() => {
  const _ = props.renderObj;
  return [
    { title: t('赛事ID'), val: _?.matchId, span: 4 },
    {
      title: t('联赛'),
      val: _?.leagueNameCn ?? history.state.params?.leagueNameCn,
      span: 6
    },
    {
      title: t('赛种'),
      val: SPORT_ID_MAP.find(item => item.value === _?.sportId)?.label,
      span: 4
    },

    {
      title: t('比赛方'),
      val: `<span>${
        _?.homeTeamNameCn ?? '_'
      }</span> <span class="ml-1 mr-1 font-bold">VS</span> <span>${
        _?.awayTeamNameCn ?? '_'
      }</span>`,
      span: 6
    },
    {
      title: t('开赛时间'),
      val: _?.beginTime,
      span: 4
    },
    {
      title: t('盘口状态'),
      val: _?.isSale === 0 ? t('未开售') : t('已开售'),
      span: 4
    },
    {
      title: '结算状态',
      val: _?.fullSettlementStatus === 0 ? t('未结算') : t('已结算'),
      span: 6
    },
    {
      title: '赛制',
      val: `
      <span>${props.baseTitle}</span>
      `,
      span: 6
    }
  ];
});
</script>

<style scoped></style>
