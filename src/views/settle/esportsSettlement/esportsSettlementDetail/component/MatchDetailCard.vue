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
        <el-button
          class="ml-2"
          size="small"
          type="primary"
          :disabled="renderObj.isSale === 0"
          @click="closeSettle"
          v-if="renderList.length - 1 === index && hasAuth('CLOSEDSALE')"
          >{{ t('关闭开售') }}</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { hasAuth } from '@/router/utils';
import { ESPORT_ID_MAP, ESPORT_MATCH_STATUS } from '@/utils/maps/sports_map';

const props = defineProps<{
  renderObj: EsportsSettlementAPI.ESportMatchById;
}>();

const emits = defineEmits(['closeSettle']);

const closeSettle = () => {
  emits('closeSettle');
};

const renderList = computed(() => {
  const _ = props.renderObj;
  return [
    { title: t('赛事ID'), val: _.matchId ?? '-' },
    { title: t('开赛时间'), val: _.beginTime ?? '-' },
    {
      title: t('游戏'),
      val: ESPORT_ID_MAP.find(r => r.value === +_.sportId)?.label
    },
    {
      title: t('赛事状态'),
      val: ESPORT_MATCH_STATUS[_.status as keyof typeof ESPORT_MATCH_STATUS]
    },
    {
      title: t('联赛'),
      val: _.leagueNameCn ?? '-'
    },
    {
      title: t('开售状态'),
      val: props.renderObj.isSale === 0 ? t('未开盘') : t('已开盘')
    },
    {
      title: t('队伍'),
      val: `${_.homeTeamNameCn ?? '-'} - ${_.awayTeamNameCn ?? '-'}`
    },
    { title: t('结算人员'), val: t('手动结算') }
  ];
});
</script>

<style scoped></style>
