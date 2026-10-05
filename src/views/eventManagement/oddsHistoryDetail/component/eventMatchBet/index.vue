<template>
  <div class="pt-[20px]">
    <div class="relative pl-10 pr-5 w-full text-white dark:bg-[#3e3e3e]">
      <TimeLine />
      <div>
        <div class="bg-[#deedfe] dark:bg-[#676877] h-[35px] flex relative">
          <EventIcon
            v-for="(item, index) in matchData.event"
            :key="index"
            :type="t('主队')"
            :data="item.home"
            :index="index"
          />
        </div>

        <!-- - 内容部分 -->
        <BetAmount
          :renderList="renderList"
          :matchId="matchId"
          @getBetDetail="getBetDetail"
        />

        <div class="bg-[#deedfe] dark:bg-[#676877] h-[35px] flex relative">
          <EventIcon
            v-for="(item, index) in matchData.event"
            :key="index"
            :type="t('客队')"
            :data="item.away"
            :index="index"
          />
        </div>
      </div>
      <TimeLine />

      <!-- - 左侧球队信息 -->
      <div
        :class="[
          'absolute top-[30px] flex items-center left-0 cursor-pointer justify-center',
          i === 1 && '!top-auto bottom-2'
        ]"
        v-for="i in [0, 1]"
        :key="i"
      >
        <el-tooltip
          :content="
            i === 0 ? matchData.homeTeamNameCn : matchData.awayTeamNameCn
          "
          placement="top-start"
        >
          <el-image
            :src="i === 0 ? homePic : awayPic"
            class="h-[30px] w-[30px]"
          >
            <template #error>
              <div class="text-xs text-black">{{ t('加载失败') }}</div>
            </template>
          </el-image>
        </el-tooltip>
      </div>
    </div>
    <!-- 注单信息 -->
    <el-scrollbar height="300px" v-if="betInfo.length">
      <div class="pr-4 pl-10 pt-3">
        <el-descriptions
          :title="t('注单信息')"
          direction="vertical"
          v-for="(item, index) in betInfo"
          :key="index"
          :column="8"
          size="small"
          border
        >
          <el-descriptions-item :label="t('用户信息')" align="center">
            <div class="flex flex-col">
              <div>
                <span>{{ t('用户ID:') }}</span>
                <span>{{ item.userId }}</span>
              </div>
              <div>
                <span>{{ t('用户名:') }}</span>
                <span>{{ item.userName }}</span>
              </div>
              <div>
                <span>{{ t('商户名:') }}</span>
                <span>{{ tenantObj[item.tenantId]?.tenantName }}</span>
              </div>
              <div>
                <span>{{ t('商户编码:') }}</span>
                <span>{{ tenantObj[item.tenantId]?.name }}</span>
              </div>
            </div>
          </el-descriptions-item>
          <el-descriptions-item :label="t('赛事信息')" align="center">
            <div
              v-for="(d, i) in item.combineOrderDetails"
              :key="i"
              :class="[
                item.combineOrderDetails.length > 1 &&
                  'border-b-[1px] border-solid border-[#f0f0f0] dark:border-[#303030] py-1',
                i === item.combineOrderDetails.length - 1 && 'border-none'
              ]"
            >
              <div>
                {{ d.homeTeamNameCn }}
                vs
                {{ d.awayTeamNameCn }}
              </div>
              <div>{{ d.sportNameCn }}/{{ d.leagueNameCn }}</div>
              <div>{{ t('赛事ID:') }}{{ d.matchId }}</div>
              <div>
                {{ t('开赛时间:')
                }}{{
                  dayjs(d.beginTime ?? Date.now()).format('MM-DD HH:mm:ss')
                }}
              </div>
            </div>
          </el-descriptions-item>
          <el-descriptions-item :label="t('注单详情')" :span="2" align="center">
            <div
              v-for="(d, i) in item.combineOrderDetails"
              :key="i"
              :class="[
                item.combineOrderDetails.length > 1 &&
                  'border-b-[1px] border-solid border-[#f0f0f0] dark:border-[#303030] py-1',
                i === item.combineOrderDetails.length - 1 && 'border-none'
              ]"
            >
              <div>
                {{
                  `玩法：${useSportFormatDetail(d)[4]} ${getIsInplay(
                    d.isInplay
                  )}`
                }}
                {{
                  d.isInplay == 1
                    ? displayHomeAwayScore(d.scoreBenchmark, d.sportId)
                    : ''
                }}
              </div>
              <div>
                {{ useSportFormatDetail(d)[3] }} @{{
                  getViewOddFn(d.oddFinally, d.marketTypeFinally, d.marketType)
                }}
              </div>
              <div>{{ t('注单号:') }} {{ item.id }}</div>
              <div>
                {{ t('投注时间:')
                }}{{
                  item.createTime
                    ? dayjs(item.createTime).format('MM-DD HH:mm:ss')
                    : ''
                }}
              </div>
              <div
                v-if="
                  item.billStatus === 1 &&
                  d.settleScore &&
                  !(
                    displayHomeAwayScore(d.settleScore, d.sportId, 'home') ==
                      '' ||
                    displayHomeAwayScore(d.settleScore, d.sportId, 'away') == ''
                  )
                "
              >
                {{ t('赛果：')
                }}{{ displayHomeAwayScore(d.settleScore, d.sportId) }}
              </div>
            </div>
          </el-descriptions-item>
          <el-descriptions-item :label="t('状态')" align="center">
            <div class="flex flex-col items-center" :key="index">
              <div
                :style="{
                  background: getStatus(
                    item.status,
                    item.billStatus,
                    item.betResultArr,
                    item.isReserve,
                    item.riskStatusArr,
                    item.isSpecialSettle
                  ).bgColor
                }"
                class="flex justify-center items-center rounded-md text-white px-5"
              >
                {{
                  betStatusMap[
                    getStatus(
                      item.status,
                      item.billStatus,
                      item.betResultArr,
                      item.isReserve as number,
                      item.riskStatusArr,
                      item.isSpecialSettle
                    ).status as keyof typeof betStatusMap
                  ]
                }}
              </div>
              <div
                class="text-center"
                v-if="
                  getStatus(
                    item.status,
                    item.billStatus,
                    item.betResultArr,
                    item.isReserve,
                    item.riskStatusArr,
                    item.isSpecialSettle
                  ).status === betStatus.settlementBet
                "
              >
                {{
                  item.settleTime
                    ? dayjs(item.settleTime).format('MM-DD HH:mm:ss')
                    : ''
                }}
              </div>
              <div v-if="String(item.seriesType).slice(-3) === '001'">
                {{ t('总赔率:')
                }}{{
                  String(item.seriesType).slice(-3) === '001'
                    ? calculateSeriesTypeTotal(item.combineOrderDetails)
                    : ''
                }}
              </div>
            </div>
          </el-descriptions-item>
          <el-descriptions-item :label="t('赔率')" align="center">
            <div
              v-for="(d, i) in item.combineOrderDetails"
              :key="i"
              :class="[
                item.combineOrderDetails.length > 1 &&
                  'border-b-[1px] border-solid border-[#f0f0f0] dark:border-[#303030] py-1',
                i === item.combineOrderDetails.length - 1 && 'border-none'
              ]"
            >
              <div class="text-center">
                {{
                  getViewOddFn(d.oddFinally, d.marketTypeFinally, d.marketType)
                }}
              </div>
              <div class="text-center">
                {{ markeTypeMap[d.marketType as keyof typeof markeTypeMap] }}
              </div>
              <div
                class="text-center"
                v-if="getOddStatus(d?.betResult, d.riskStatus)"
              >
                <span
                  :class="
                    [EBetResultType.WIN, EBetResultType.WIN_HALF].includes(
                      d?.betResult
                    )
                      ? 'win'
                      : 'lose'
                  "
                >
                  {{ getOddStatus(d?.betResult, d.riskStatus) }}
                </span>
              </div>
            </div>
          </el-descriptions-item>
          <el-descriptions-item :label="t('投注额')" align="center">
            <div>
              <div class="text-center">
                {{
                  addThousandSeparator((+item.productAmountTotal).toFixed(2))
                }}
              </div>
            </div>
          </el-descriptions-item>
          <el-descriptions-item :label="t('用户输赢')" align="center">
            <div>
              <span
                v-if="item.profitAmount"
                :class="item.profitAmount > 0 ? 'win' : 'lose'"
                >{{ (+item.profitAmount).toFixed(2) }}</span
              >
              <span v-else>-</span>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import EventIcon from './com/EventIcon.vue';
import TimeLine from './com/TimeLine.vue';
import BetAmount from './com/BetAmount.vue';
import dayjs from 'dayjs';
import { addThousandSeparator } from '@/utils/formatNumber';
import {
  useSportFormatDetail,
  EBetResultType,
  getViewOddFn,
  markeTypeMap,
  calculateSeriesTypeTotal,
  displayHomeAwayScore,
  getIsInplay
} from '@/utils/formatMatch';
import { getStatus, betStatus, betStatusMap, getOddStatus } from './util/data';

const props = defineProps<{
  matchData: EventAPI.getMatchStatusticData;
  matchId: string;
}>();

const renderList = computed(() => {
  const s = props.matchData.bet.map(item => {
    let time = item.t.split(':');
    let t = +time[1];
    t = ((t / 60) * 100) / 100;
    t = +(+time[0] + t).toFixed(2);
    return [t, item.n, item.t, item.o];
  });
  return s;
});

const homePic = computed(() => {
  if (!props.matchData.homeTeamLogo) {
    return '';
  } else {
    return `https://awdpdownloads.domaf.com${props.matchData.homeTeamLogo}`;
  }
});
const awayPic = computed(() => {
  if (!props.matchData.awayTeamLogo) {
    return '';
  } else {
    return `https://awdpdownloads.domaf.com${props.matchData.awayTeamLogo}`;
  }
});

const betInfo = reactive<BetOrderAPI.BetOrderList[]>([]);

const getBetDetail = async (orderIdList: (string | number)[]) => {
  const res = await Promise.allSettled(
    orderIdList.map((orderId: string) => {
      return API.getCurrentBet({
        orderId,
        queryType: 1,
        pageSize: 20,
        pageNum: 1,
        export: false
      });
    })
  );
  betInfo.length = 0;
  res.forEach(item => {
    if (item.status === 'fulfilled') {
      const fulfilledItem = item as PromiseFulfilledResult<any>;
      if (fulfilledItem.value.code) return;
      betInfo.push(fulfilledItem.value.data.pageData[0]);
    }
  });
  //   const res = await API.getCurrentBet({
  //     orderId: orderIdList[0],
  //     queryType: 1,
  //     pageSize: 20,
  //     pageNum: 1,
  //     export: false
  //   });
  //   if (res.code) return message(res.msg, { type: 'error' });
  //   Object.assign(betInfo, res.data.pageData[0]);
};

onMounted(() => {
  getTenantList();
});

const tenantList = reactive<{ name: string; id: number; tenantName: string }[]>(
  []
);
const tenantObj = reactive<any>({});
const getTenantList = async () => {
  const res = await API.queryTenantList({ category: 0 });
  if (res.data?.length) {
    tenantList.push(...res?.data);
    tenantList.map(item => {
      tenantObj[item.id] = item;
    });
  }
};
</script>
