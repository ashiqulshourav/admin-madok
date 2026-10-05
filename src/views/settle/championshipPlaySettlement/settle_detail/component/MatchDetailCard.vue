<template>
  <div class="bg-bg_color w-[99/100] pl-8 pb-3 pt-[12px] relative">
    <div class="text-center font-bold text-2xl">{{ t('盘口详情') }}</div>
    <IconifyIconOffline
      icon="cancelIcon"
      class="absolute right-4 top-1 cursor-pointer text-[26px]"
      @click="$router.go(-1)"
    />
    <el-row>
      <el-col
        class="mb-2"
        v-for="(item, index) in renderList"
        :key="index"
        :span="6"
        :offset="index % 2 === 0 ? 6 : 3"
      >
        <span class="mr-2 text-sm font-bold">{{ item.title }}:</span>
        <span class="text-sm">{{ item.val }}</span>
      </el-col>
      <el-col :span="6" :offset="3">
        <el-button
          class="ml-2"
          size="small"
          type="primary"
          :disabled="dataInfo?.isSale === 0"
          @click="closeSettle"
          v-if="hasAuth('CLOSEDSALE')"
          >{{ t('关闭开售') }}</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { hasAuth } from '@/router/utils';
import {
  ESPORT_ID_MAP,
  ESPORT_MATCH_STATUS,
  SPORT_ID_MAP
} from '@/utils/maps/sports_map';

const props = defineProps<{
  dataInfo: SattleDataAPI.getSettlementDataList;
}>();

const emits = defineEmits(['closeSettle']);

const closeSettle = () => {
  emits('closeSettle');
};

const renderList = computed(() => {
  const _ = props.dataInfo;
  return [
    { title: t('赛事ID'), val: _?.matchId },
    { title: t('比赛开始时间'), val: _?.beginTime },
    {
      title: t('赛种'),
      val: ESPORT_ID_MAP.concat(SPORT_ID_MAP).find(r => r.value === +_?.sportId)
        ?.label
    },
    { title: t('比赛状态'), val: ESPORT_MATCH_STATUS[_?.status] },
    {
      title: t('联赛名称'),
      val: _?.leagueNameCn ?? '-'
    },
    {
      title: t('盘口状态'),
      val: props.dataInfo?.isSale === 0 ? t('未开售') : t('已开售')
    },
    { title: t('结算类型'), val: t('手动结算') }
  ];
});
</script>

<style scoped></style>
