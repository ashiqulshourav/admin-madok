<template>
  <div class="flex flex-col mb-2">
    <MatchTitle @changeStatus="changeStatus" :current-match="matchData" />

    <!-- - 赛事内容列表 -->
    <div class="w-ful overflow-y-auto pl-5 pt-1" @mouseleave="clearTime">
      <div
        class="ml-24 mt-2 flex"
        :name="index"
        v-for="(item, index) in matchData.renderList"
        :key="index"
      >
        <div class="flex items-center self-start w-[160px]">
          <el-button type="primary" size="small">
            {{ item.val }}
          </el-button>
          <div class="flex justify-between ml-4 text-xs cursor-pointer">
            <IconGroup
              :typeNum="item.isSale"
              @changeMatchStatus="
                status =>
                  changeStatus({
                    matchId: matchData.matchId,
                    status,
                    classify: 'category',
                    betItemsIdList: item.betItemsIdList,
                    item
                  })
              "
            />
          </div>
        </div>

        <div class="flex-grow text-xs overflow-x-hidden">
          <div
            class="ml-5 flex w-full border-b-[1px] border-solid border-[#f0f0f0] dark:border-[#303030] mb-2"
            v-for="(_, idx) in item.list"
            :key="idx"
          >
            <div
              class="flex items-center pl-2 self-start w-[280px] justify-between bg-[--el-color-primary-light-9] h-[35px] pr-2"
            >
              <span class="text-[#409EFF] font-bold">{{ _.betItemsName }}</span>

              <div class="flex pl-2 cursor-pointer">
                <IconGroup
                  :typeNum="_.isSale"
                  type="pan"
                  @changeMatchStatus="
                    status =>
                      changeStatus({
                        matchId: matchData.matchId,
                        status,
                        classify: 'pan',
                        betItemsIdList: _.betItemsIdList,
                        categoryData: _,
                        item
                      })
                  "
                />
              </div>
            </div>

            <div class="flex-grow text-sx">
              <div
                v-for="(d, i) in _.kindsCodeDtoList"
                :key="i"
                class="border-b-[1px] border-solid border-[#f0f0f0] dark:border-[#503e3e]"
              >
                <div
                  :class="[
                    'flex w-full items-center h-[35px]',
                    l === 0 && 'bg-[--el-color-primary-light-9]'
                  ]"
                  v-for="(s, l) in d.betItemsDtoList"
                  :key="`${i}-${l}`"
                >
                  <div class="text-[--el-color-primary] text-center w-1/4">
                    {{ panName(s, matchData) }}
                  </div>
                  <div
                    :class="[
                      'flex items-center text-center w-1/6',
                      s.odds < 0 && 'translate-x-[-2px]'
                    ]"
                  >
                    <el-text
                      class="!text-xs font-bold"
                      :type="s.oddsType === 'OU' ? 'primary' : 'danger'"
                    >
                      {{ ODDS_TYPE_MAP[s.oddsType] }}
                    </el-text>
                    <span class="ml-2">
                      {{ s.odds.toFixed(2) }}
                    </span>
                  </div>
                  <InputCom
                    :s="s"
                    :saleStatus="_.isSale"
                    @clearMatchTime="v => $emit('clearMatchTime', v)"
                    :selectNum="selectNum"
                    :selectItem="selectItem"
                    :betItemsDtoList="d.betItemsDtoList"
                    @changeSelectNum="
                      (v, s) => shortcutSelectNum(v, s, d.betItemsDtoList)
                    "
                  />
                  <div
                    :class="[
                      'text-[--el-color-primary] w-1/6 text-center',
                      (s.betCount > 0 || s.betAmount > 0) && 'cursor-pointer'
                    ]"
                    @click="
                      goBetOroderPage(s.betCount > 0 || s.betAmount > 0, s)
                    "
                  >
                    {{ s.betCount }}/{{ s.betAmount }}
                  </div>
                  <div
                    class="text-[--el-color-primary] w-1/6 text-center"
                    v-if="l === 0"
                  >
                    {{ d.betAmountDiffer ?? '' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MatchTitle from './MatchTitle.vue';
import IconGroup from '../../com/IconGroup.vue';
import {
  ODDS_TYPE_MAP,
  PLAY_MATCH_NAME,
  goalScoring
} from '../../util/playMap';
import InputCom from '../../com/InputCom.vue';
import { useBetStore } from '@/store/bet';

const betItemsDtoList = reactive<sportTradingDataAPI.BetItemsDtoList[]>([]);
const props = defineProps<{
  matchData: sportTradingDataAPI.getAlarmMatchListType;
  matchList: sportTradingDataAPI.getAlarmMatchListType[];
}>();

//- 求当前玩法名称
const panName = (
  s: sportTradingDataAPI.BetItemsDtoList,
  currentMatch: sportTradingDataAPI.getAlarmMatchListType
) => {
  return (
    PLAY_MATCH_NAME(
      s.kindsCode,
      s.handicap,
      currentMatch.homeTeamNameCn,
      currentMatch.awayTeamNameCn
    )[s.homeOrAway ? s.homeOrAway : s.handicap]?.replace('&', ' ') ??
    goalScoring(
      s.kindsCode,
      s.handicap,
      s.n,
      currentMatch.homeTeamNameCn,
      currentMatch.awayTeamNameCn,
      s.renderName
    )?.replace('&', ' ')
  );
};

//-快捷选择数字事件
const selectNum = ref(0);
const shortcutSelectNum = (
  _: number,
  s: sportTradingDataAPI.BetItemsDtoList,
  list: sportTradingDataAPI.BetItemsDtoList[]
) => {
  if (_ === 0) return;
  const params: {
    betItemsId: string;
    oddsType: string;
    afterOdds: number;
    beforeOdds: number;
    betItemsName: string;
    oddsVariable: number;
  }[] = [];
  //- 下盘需要递减
  if (list.length === 2) {
    const otherIdx = list.findIndex(item => item.betItemsId !== s.betItemsId);

    params.push(
      ...list.map((d, index: number) => ({
        oddsType: d.oddsType,
        beforeOdds: d.odds,
        afterOdds: d.dpOdds,
        betItemsId: d.betItemsId,
        betItemsName: `${d.betItemsName}-${panName(d, props.matchData)}`,
        oddsVariable: index !== otherIdx ? _ : _ * -1
      }))
    );
    emits('sendNewOdds', params);
  } else {
    //- 长度大于3的盘口
    const d = list.find(
      item => item.betItemsId === s.betItemsId
    ) as sportTradingDataAPI.BetItemsDtoList;
    nextTick(() => {
      params.push({
        oddsType: d.oddsType,
        betItemsId: d.betItemsId,
        beforeOdds: d.odds,
        afterOdds: d.dpOdds,
        betItemsName: `${d.betItemsName}-${panName(d, props.matchData)}`,
        oddsVariable: _
      });
      emits('sendNewOdds', params);
    });
  }
};

const selectItem = ref<sportTradingDataAPI.BetItemsDtoList>(
  {} as sportTradingDataAPI.BetItemsDtoList
);

const emits = defineEmits([
  'changeSelectType',
  'clearMatchTime',
  'changeStatus',
  'sendNewOdds'
]);

const isShowScroll = ref(false);
const scrollPostitonObj = reactive({ left: '0px', top: '0px' });

const clearTime = () => {
  emits('clearMatchTime', -1);
  selectItem.value.sourceBetItemsId = -1;
  isShowScroll.value = false;
};

const mouseEvent = (
  e: any,
  s: sportTradingDataAPI.BetItemsDtoList,
  type: 'enter' | 'leave',
  list?: sportTradingDataAPI.BetItemsDtoList[]
) => {
  //- 进入之后清空所有内容
  if (type === 'enter') {
    isShowScroll.value = false;
    props.matchList.forEach(item => {
      item.renderList.forEach(_ => {
        _.list.forEach(d => {
          d.kindsCodeDtoList.forEach(_ => {
            _.betItemsDtoList.forEach(r => {
              r.sourceBetItemsId = -1;
            });
          });
        });
      });
    });
    selectItem.value = s;
    scrollPostitonObj.left = `${
      e.target.getBoundingClientRect().left + (s.dpOdds < 0 ? 76 : 70)
    }px`;
    scrollPostitonObj.top = `${e.target.getBoundingClientRect().top - 168}px`;
    betItemsDtoList.length = 0;
    betItemsDtoList.push(...(list as sportTradingDataAPI.BetItemsDtoList[]));
    s.sourceBetItemsId = 1;
  } else {
    if (!isShowScroll.value) s.sourceBetItemsId = -1;
  }
  emits('clearMatchTime', s.sourceBetItemsId);
};

//- 修改图标状态(包含盘，赛事，玩法)
const changeStatus = (d: {
  matchId: number;
  status: number;
  classify?: 'match' | 'category' | 'pan';
  betItemsIdList?: number[];
  categoryData?: sportTradingDataAPI.MainListType;
  item?: sportTradingDataAPI.renderListType;
}) => {
  emits('changeStatus', d);
};

const showShortcutContainer = () => (isShowScroll.value = true);

//- 跳转到订单界面
const betStore = useBetStore();
const router = useRouter();
const goBetOroderPage = (
  isGo: boolean,
  s: sportTradingDataAPI.BetItemsDtoList
) => {
  if (!isGo) return;
  betStore.set_gameplay_data({
    matchId: s.matchId,
    betItemsId: s.betItemsId
  });
  router.push('/operateManager/sportBettingCenter');
};
</script>

<style scoped></style>
