<template>
  <div
    class="search-form bg-bg_color w-[99/100] pl-8 py-[12px] text-sm relative"
  >
    <div class="flex items-center">
      <span class="mr-5 font-bold">{{ t('选择数据源') }}:</span>
      <el-checkbox-group v-model="selectData.dataSourceCode">
        <el-checkbox :disabled="true" label="188" value="XJ" />
        <el-checkbox :disabled="true" :label="t('熊猫')" value="PS" />
        <el-checkbox :disabled="true" :label="t('播控')" value="VS" />
        <el-checkbox :disabled="true" :label="t('操盘')" value="Value C" />
      </el-checkbox-group>
    </div>

    <div class="flex items-center my-4">
      <span class="mr-5 font-bold">{{ t('赔率切换') }}:</span>
      <el-button-group>
        <el-button
          size="small"
          :type="selectData.oddsType === 'OU' ? 'primary' : 'default'"
          @click="changeList({ type: 'oddsType', val: 'OU' })"
          >{{ t('欧赔') }}</el-button
        >
        <el-button
          size="small"
          :type="selectData.oddsType === 'HK' ? 'primary' : 'default'"
          @click="changeList({ type: 'oddsType', val: 'HK' })"
          >{{ t('亚赔') }}</el-button
        >
        <el-button
          size="small"
          :type="selectData.oddsType === 'ML' ? 'primary' : 'default'"
          @click="changeList({ type: 'oddsType', val: 'ML' })"
          >{{ t('马来赔') }}</el-button
        >
      </el-button-group>
    </div>

    <div class="flex items-center">
      <span class="mr-5 font-bold">{{ t('选择玩法') }}:</span>
      <div class="flex items-center">
        <el-button
          size="small"
          v-for="item in playMethodsList"
          round
          :key="item.key"
          :type="selectData.kindsCode === item.key ? 'primary' : 'default'"
          @click="
            changeList({ type: 'kindsCode', val: item.key, c: item.type })
          "
          >{{ item.title }}</el-button
        >
      </div>
    </div>
    <div class="absolute right-0 bottom-2">
      <el-button
        class="mr-5"
        type="primary"
        size="small"
        @click="exportFile"
        :icon="useRenderIcon(Download)"
        >{{ t('导出报表') }}</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { playMethodsList } from '../utils/map';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import Download from '@iconify-icons/ep/download';
import { message } from '@/utils/message';
import { usePublicHooks } from '@/hooks';
const props = defineProps<{
  selectData: EventAPI.getMatchEventWithOddsHistoryReqType;
  list: EventAPI.getMatchEventWithOddsHistoryResData[];
  matchId: string;
}>();

const emits = defineEmits(['changeList']);
const { exportDialog } = usePublicHooks();
const router = useRouter();
const exportFile = () => {
  if (props.list.length > 500000) {
    message(`当前条件下数据量为${props.list.length}，大于50万条，不支持导出!`, {
      type: 'error'
    });
  } else if (!props.list.length) {
    message('数据量为零，无法导出', { type: 'error' });
  } else {
    exportDialog({
      firstTitle: t('导出当前列表数据?'),
      router,
      callback: async () => {
        const res = await API.exportMatchEventWithOddsHistoryExcel({
          matchId: props.matchId,
          // matchId: '316066',
          dataSourceCode: (props.selectData.dataSourceCode as string[]).join(
            ','
          ),
          oddsType: props.selectData.oddsType,
          kindsCode: props.selectData.kindsCode
        });
        if (res.code) {
          message(res.msg, { type: 'error' });
          throw 'error';
        }
      }
    });
  }
};

//- 分类切换
const changeList = (d: { type: string; val: string }) => {
  emits('changeList', d);
};
</script>

<style scoped lang="scss"></style>
