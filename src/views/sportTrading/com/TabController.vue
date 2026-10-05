<template>
  <el-scrollbar :class="type" :always="true">
    <el-collapse
      ref="collapseRef"
      v-model="activeNames"
      class="w-[400px] max-h-full"
      :accordion="false"
      @change="handleChange"
    >
      <el-collapse-item
        :name="item.type"
        v-for="item in matchList"
        :key="item.type"
        class="h-full"
      >
        <template #title>
          {{
            item.type === 'nover'
              ? t('进行中')
              : item.type === 'nobegin'
              ? t('未开赛')
              : item.type
          }}
          ({{ item.size }})
        </template>
        <div class="max-h-[600px] hide_scroll">
          <DynamicScroller
            :items="item.matchDtoList"
            :min-item-size="9"
            key-field="matchId"
            class="overflow-y-auto max-h-[600px]"
          >
            <template #default="{ item, active }">
              <DynamicScrollerItem
                :item="item"
                :active="active"
                :size-dependencies="[item.matchId]"
                :data-index="item.matchId"
                :data-active="active"
                class="message"
              >
                <div
                  :class="[
                    'flex items-center border-b-[1px] border-solid border-[#f0f0f0] dark:border-[#303030] p-2  cursor-pointer',
                    item.matchId === currentMatch?.matchId &&
                      'bg-[--el-color-primary-light-9]'
                  ]"
                  @click="changeSelectItem(item)"
                >
                  <div class="flex">
                    <el-button size="small" type="primary">{{
                      getSportType(item.sportId)
                    }}</el-button>

                    <div class="ml-3 mr-4 flex flex-col w-[125px]">
                      <div class="flex items-center">
                        <span
                          class="w-4 items-center h-4 flex flex-shrink-0 mr-1 text-[12px] justify-center bg-primary rounded-full text-white"
                        >
                          <span class="font-bold scale-75">
                            {{
                              item.riskLevel < 0
                                ? t('未')
                                : item.riskLevel > 100
                                ? '99+'
                                : item.riskLevel
                            }}
                          </span>
                        </span>
                        <ReText
                          class="leading-none"
                          type="primary"
                          size="small"
                          @click.stop="copyTxt(item.leagueId, 'league')"
                          :tippyProps="{ content: item.leagueNameCn }"
                        >
                          {{ item.leagueNameCn }}
                        </ReText>
                      </div>
                      <span class="self-start">{{ item.beginTime }}</span>
                    </div>
                  </div>

                  <div class="pr-2 ml-6 flex-grow-1">
                    <div
                      class="flex mb-2 text-xs w-[150px] items-center"
                      @click.stop="copyTxt(item.matchId.toString(), 'match')"
                    >
                      <div
                        class="text-[--el-color-primary] !text-xs flex items-center"
                      >
                        <div class="max-w-[100px] flex items-center">
                          <ReText
                            type="primary"
                            size="small"
                            :tippyProps="{ content: item.homeTeamNameCn }"
                          >
                            {{ item.homeTeamNameCn }}
                          </ReText>
                        </div>
                        <span
                          class="w-5 font-bold h-5 flex items-center text-[12px] justify-center scale-75 bg-[--el-color-warning] text-white rounded-full leading-4"
                        >
                          <span class="font-bold">{{ t('主') }}</span>
                        </span>
                      </div>
                      <div :class="['text-[--el-color-primary] !mr-2 !ml-2']">
                        V
                      </div>
                      <ReText
                        type="primary"
                        size="small"
                        :tippyProps="{ content: item.awayTeamNameCn }"
                      >
                        {{ item.awayTeamNameCn }}
                      </ReText>
                    </div>
                    <div class="flex cursor-pointer">
                      <IconGroup
                        :typeNum="item.isSale"
                        @changeMatchStatus="d => changeMatchStatus(d, item)"
                        :operateStatus="item.operateStatus"
                      />
                    </div>
                  </div>
                </div>
              </DynamicScrollerItem>
            </template>
          </DynamicScroller>
        </div>
      </el-collapse-item>
    </el-collapse>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { t } from '@/plugins/i18n';
import IconGroup from './IconGroup.vue';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';
import { ReText } from '@/components/ReText';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';
import { copyTextToClipboard } from '@pureadmin/utils';
import { message } from '@/utils/message';

const collapseRef = ref();
const emits = defineEmits(['changeSelectMatch', 'changeStatus']);

const props = defineProps<{
  matchList: sportTradingDataAPI.getMorningSetMatchListData[];
  currentMatch: sportTradingDataAPI.MatchDtoList;
  type: 'early' | 'in';
}>();

const copyTxt = (val: string, type: 'league' | 'match') => {
  const eMap = {
    league: t('联赛ID复制成功'),
    match: t('赛事ID复制成功')
  };
  copyTextToClipboard(val);
  message(eMap[type], { type: 'success' });
};

const activeNames = computed({
  get() {
    const arr = [];
    props.matchList.length && arr.push(props.matchList[0].type);
    return arr;
  },
  set(_) {
    // console.log('TabController.vue文件 103==============行打印=', v);
  }
});

const handleChange = (_: string[]) => {};

//- 切换赛事
const changeSelectItem = (_: sportTradingDataAPI.MatchDtoList) => {
  emits('changeSelectMatch', _);
};

const changeMatchStatus = (
  status: number,
  item: sportTradingDataAPI.MatchDtoList
) => {
  // item.isSale = status;
  emits('changeStatus', {
    status,
    classify: 'match',
    matchId: item.matchId,
    item
  });
};

//- 获取当前玩法
const getSportType = (_: number) => {
  return SPORT_ID_MAP.find(item => item.value === _)?.label;
};
</script>

<style lang="scss">
.early {
  ::-webkit-scrollbar {
    display: none !important;
  }
}
.in {
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 3px;
    background: rgba(0, 0, 0, 0.1);
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 3px;
    height: 100px;
    -webkit-box-shadow: inset005pxrgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }
  ::-webkit-scrollbar {
    width: 6px;
    background: transparent !important;
  }
}

.el-collapse-item__content {
  padding-bottom: 0;
}
</style>
