<template>
  <div
    class="pl-5 pr-5 text-sm flex-grow relative w-[calc(100%-400px)]"
    ref="contentRef"
  >
    <ContentTitle
      :currentMatch="currentMatch"
      :handicapList="handicapList"
      :selectContentType="selectContentType"
      @changeSelectType="changeSelectType"
      @changeStatus="changeStatus"
    />
    <!-- - 赛事内容列表 -->
    <div
      class="w-full overflow-hidden pl-5 h-[calc(100%-60px)]"
      @mouseleave="clearTime"
    >
      <div
        class="flex items-center justify-center min-h-[500px]"
        v-if="panIsEmpty"
      >
        <el-empty :description="t('暂无数据')" :image-size="100" />
      </div>
      <template v-else>
        <el-scrollbar ref="contentScrollRef">
          <el-collapse ref="collapseRef" v-model="activeNames">
            <el-collapse-item
              :name="index"
              v-for="(item, index) in handicapList"
              :key="index"
              :class="[!item.list.length && 'collapse_empty']"
            >
              <template #title>
                <div class="flex items-center">
                  <el-button type="primary" size="small">
                    {{ item.val }}
                  </el-button>
                  <div class="flex justify-between ml-4">
                    <IconGroup
                      :typeNum="item.isSale"
                      renderType="classify"
                      @changeMatchStatus="
                        status =>
                          changeStatus({
                            status,
                            classify: 'category',
                            betItemsIdList: item.betItemsIdList,
                            item
                          })
                      "
                    />
                  </div>
                </div>
              </template>
              <div
                class="ml-5 flex w-full mb-2"
                v-for="(_, idx) in item.list"
                :key="idx"
              >
                <div
                  class="flex items-center pl-2 self-start w-[280px] justify-between bg-[--el-color-primary-light-9] h-[35px] pr-2"
                >
                  <ReText
                    size="small"
                    :tippyProps="{ content: _.betItemsName }"
                  >
                    <span class="text-[#409EFF] font-bold leading-none">{{
                      _.betItemsName.replace('&', ' ')
                    }}</span>
                  </ReText>

                  <div class="flex pl-2 cursor-pointer">
                    <IconGroup
                      :typeNum="_.isSale"
                      renderType="pan"
                      @changeMatchStatus="
                        status =>
                          changeStatus({
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

                <div class="flex-grow">
                  <div v-for="(d, i) in _.kindsCodeDtoList" :key="i">
                    <div
                      :class="[
                        'flex w-full items-center h-[35px] ',
                        l === 0 && 'bg-[--el-color-primary-light-9]'
                      ]"
                      v-for="(s, l) in d.betItemsDtoList"
                      :key="`${i}-${l}`"
                    >
                      <div
                        class="text-[--el-color-primary] text-left ml-2 pl-[8px] leading-none w-1/4"
                      >
                        <ReText size="small" @click="copyText(s.betItemsId)">
                          {{ panName(s, currentMatch) }}
                        </ReText>
                      </div>

                      <div class="flex items-center text-center w-1/6">
                        <el-text
                          class="!text-xs font-bold"
                          :type="s.oddsType === 'OU' ? 'primary' : 'danger'"
                        >
                          {{ ODDS_TYPE_MAP[s.oddsType] }}
                        </el-text>
                        <span class="ml-2 min-w-[45px] text-right">
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
                          (s.betCount > 0 || s.betAmount > 0) &&
                            'cursor-pointer'
                        ]"
                        @click="
                          goBetOroderPage(s.betCount > 0 || s.betAmount > 0, s)
                        "
                      >
                        {{ s.betCount }}/{{ s.betAmount }}
                      </div>
                      <div
                        :class="[
                          'text-[--el-color-primary] w-1/6 text-center',
                          l !== 0 && 'invisible'
                        ]"
                      >
                        {{ d.betAmountDiffer ?? '' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-scrollbar>
      </template>
    </div>

    <el-dialog
      v-model="dialogStatus"
      :append-to="contentRef"
      :append-to-body="false"
      :align-center="true"
      width="150"
      custom-class="over_dialog"
      modal-class="over_mdal"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <MatchCountDown
        :type="type"
        :status="matchStatus"
        @closeDialog="onCloseDialog"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { handicapListType } from '../util/type';
import IconGroup from './IconGroup.vue';
import ContentTitle from './ContentTitle.vue';
import { ODDS_TYPE_MAP, PLAY_MATCH_NAME, goalScoring } from '../util/playMap';
import InputCom from './InputCom.vue';
import { t } from '@/plugins/i18n';
import { useBetStore } from '@/store/bet';
import { ReText } from '@/components/ReText';
import MatchCountDown from './MatchCountDown.vue';
import { copyTextToClipboard } from '@pureadmin/utils';

const contentRef = ref();
const collapseRef = ref();
const activeNames = ref([1]);
const contentScrollRef = ref();
const selectItem = ref<sportTradingDataAPI.BetItemsDtoList>(
  {} as sportTradingDataAPI.BetItemsDtoList
);
const props = defineProps<{
  currentMatch: sportTradingDataAPI.MatchDtoList;
  handicapList: handicapListType[];
  selectContentType: string;
  panIsEmpty: boolean;
  isShowDialog: boolean;
  matchStatus: 'nobegin' | 'canceled' | 'over';
  type: string;
}>();

const dialogStatus = computed({
  get() {
    return props.isShowDialog;
  },
  set(_) {}
});

watch(
  () => props.currentMatch,
  () => {
    activeNames.value = [1];
  }
);

//- 监听内容分类改变
watch(
  () => props.selectContentType,
  v => {
    const index = props.handicapList.findIndex(item => item.listType === v);
    activeNames.value = [index];
    contentScrollRef.value.scrollTo(0, 0);
  }
);

const emits = defineEmits([
  'changeSelectType',
  'clearMatchTime',
  'changeStatus',
  'sendNewOdds',
  'onCloseDialog'
]);

//- 求当前玩法名称
const panName = (
  s: sportTradingDataAPI.BetItemsDtoList,
  currentMatch: sportTradingDataAPI.MatchDtoList
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

//- 修改选择类型
const changeSelectType = (type: string) => {
  emits('changeSelectType', type);
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
        betItemsId: d.betItemsId.toString(),
        betItemsName: `${d.betItemsName}-${panName(d, props.currentMatch)}`,
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
        betItemsId: d.betItemsId.toString(),
        beforeOdds: d.odds,
        afterOdds: d.dpOdds,
        betItemsName: `${d.betItemsName}-${panName(d, props.currentMatch)}`,
        oddsVariable: _
      });
      emits('sendNewOdds', params);
    });
  }
};

//- 粘贴
const copyText = (str: string) => {
  copyTextToClipboard(str);
};

const clearTime = () => {
  selectItem.value.sourceBetItemsId = -1;
  emits('clearMatchTime', -1);
};

//- 修改图标状态(包含盘，赛事，玩法)
const changeStatus = (d: {
  status: number;
  classify?: 'match' | 'category' | 'pan';
  betItemsIdList?: number[];
  categoryData?: sportTradingDataAPI.MainBetItemsDtoList;
  item?: handicapListType;
}) => {
  emits('changeStatus', d);
};

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

const onCloseDialog = () => emits('onCloseDialog');
</script>

<style lang="scss">
.collapse_empty {
  .el-collapse-item__wrap {
    height: 0;
  }
}

.over_mdal {
  position: absolute;
  .el-overlay-dialog {
    position: absolute;
    .el-dialog__header {
      display: none;
    }
    .el-dialog {
      background-color: transparent !important;
      box-shadow: none;
    }
  }
}
</style>
