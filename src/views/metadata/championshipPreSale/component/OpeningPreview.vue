<template>
  <div class="flex flex-col pl-10 pr-10 min-h-96">
    <div class="mb-2">
      <span>{{ t('赛事ID') }}:</span>
      <span>{{ matchId }}</span>
    </div>
    <div class="mb-2 flex justify-between">
      <div>
        <span>{{ t('比赛名称') }}:</span>
        <span>{{ matchInfo.leagueNameCn }}</span>

        <span class="ml-3">{{ t('比赛时间') }}:</span>
        <span class="ml-1">
          {{
            dayjs(matchInfo.beginTimeLong).format('YYYY-MM-DD HH:mm:ss')
          }}</span
        >
      </div>
      <div class="mb-2 flex justify-between">
        <span
          >{{ t('开售盘口/总盘口数:') }} {{ openLen }} /
          {{ matchInfo.allHandicaps }}</span
        >
      </div>
    </div>

    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane
        :label="o.betItemsName"
        :name="index"
        v-for="(o, index) in renderList"
        :key="index"
      >
        <div
          :class="['flex items-center justify-between']"
          v-if="o.handicapList.length"
        >
          <div class="flex-grow mb-1 w-1/4">
            <el-button
              class="text-center flex justify-between break_word w-[30%]"
              v-for="(d, idx) in o.handicapList"
              :key="idx"
            >
              <span
                class="text-ellipsis overflow-hidden whitespace-nowrap max-w-[90%]"
              >
                {{ d.handicap }}
              </span>
              <span>
                {{ d.odds }}
              </span>
            </el-button>
          </div>
          <div class="h-8 flex justify-center items-center cursor-pointer ml-3">
            <el-popconfirm
              :title="t('是否确认修改锁盘状态?')"
              @confirm="upateLockStatus(o.handicapList)"
            >
              <template #reference>
                <IconifyIconOffline
                  style="font-size: 20px"
                  :icon="o.handicapList[0].isSale === 2 ? 'unlock' : 'lock'"
                />
              </template>
            </el-popconfirm>
          </div>
        </div>
        <div v-else v-loading="isLoading">
          <el-empty :description="t('暂无数据')" :image-size="100" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { ref } from 'vue';
import dayjs from 'dayjs';
import { message } from '@/utils/message';

const activeName = ref(0);
const timer = ref();
const openLen = ref(0);
const isLoading = ref(true);

const renderList = reactive<SaleDataAPI.ChampionBetItemsListData[]>([]);

const props = withDefaults(
  defineProps<{ matchId: number; matchInfo: SaleDataAPI.PreSaleList }>(),
  {}
);

onMounted(() => {
  getBetItemsList();
});

//- 获取冠军盘口列表
const getBetItemsList = async () => {
  isLoading.value = true;
  const res = await API.getChampionBetItemsList({ matchId: props.matchId });
  if (res.code) return;
  openLen.value = 0;
  if (res.data.length) {
    renderList.length = 0;
    renderList.push(...res.data);
  }
  renderList.forEach(item => {
    item.isSale === 2 && (openLen.value += 1);
  });
  isLoading.value = false;
};

const emits = defineEmits(['reloadTable']);

const upateLockStatus = async (cItem: SaleDataAPI.HandicapList[]) => {
  try {
    const params = {
      matchId: cItem[0].matchId,
      betItemList: cItem
        .filter(_ => _)
        .map(_ => `${_.betItemsId}_${_.handicap}`)
    };
    const res: SaleDataAPI.saleBetItemsResType =
      cItem[0].isSale === 2
        ? await API.saleBetItems(params)
        : await API.openSaleBetItems(params);
    message(res.msg, { type: res.code ? 'error' : 'success' });
    if (res.code) return;
    getBetItemsList();
    emits('reloadTable');
  } catch (error) {
    console.log('OpeningPreview.vue文件 192==============行打印=', error);
  }
};

onUnmounted(() => {
  timer.value && clearInterval(timer.value);
});
</script>

<style lang="scss" scoped>
:deep() {
  .el-collapse {
    border-top: none;
    .el-collapse-item:last-child {
      .el-collapse-item__wrap,
      .el-collapse-item__header {
        border-bottom: none;
      }
    }
  }
  .break_word {
    white-space: unset;
  }
  .el-tabs__content {
    max-height: 600px;
    overflow-y: auto;
  }
  .el-button {
    margin: 0 5px 5px !important;
    font-size: 12px;
    &:hover,
    &:focus {
      cursor: auto;
      background: transparent;
      border-color: #dcdfe6;
      color: var(--el-text-color-regular);
    }
    & > span {
      display: flex;
      justify-content: space-around;
      width: 100%;
      span {
        flex-grow: 1;
        text-align: center;
        &:first-child {
          text-align: left;
        }
        &:last-child {
          text-align: right;
        }
      }
    }
  }
}
</style>
