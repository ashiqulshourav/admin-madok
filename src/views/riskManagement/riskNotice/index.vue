<template>
  <div class="flex flex-col pl-20 pt-10">
    <div class="flex items-center mb-10 mt-2" v-if="hasAuth('GETRISKNOTIFICATION')">
      <span class="font-bold mr-5 text-[20px]">{{ t('待办事项') }}</span>

      <el-switch
        class="mr-10"
        inline-prompt
        active-text="on"
        inactive-text="off"
        v-model="riskNotificationSwitch"
        :active-value="1"
        :inactive-value="0"
        @change="setRiskNotification"
        :disabled="!hasAuth('SETRISKNOTIFICATION')"
      />
      <div class="flex">
        <el-button
          :type="currentSelectTimeIndex === index ? 'primary' : 'info'"
          v-for="(item, index) in timeList"
          :key="index"
          @click="changeTime(index)"
          :disabled="!hasAuth('SETRISKNOTIFICATION')"
          >{{ item }}s</el-button          
        >
      </div>
    </div>
    <div class="flex" v-if="hasAuth('RISKNOTICEAGGREGATE')">
      <div class="flex flex-col items-center cursor-pointer" @click="router.push('/riskManagement/manualOrderRejection')">
        <span>{{ t('手动接拒') }}</span>
        <span class="text-[30px]">{{jjAuditCount}}</span>
      </div>
      <div class="flex mr-10 ml-10 flex-col items-center cursor-pointer" @click="router.push('/riskManagement/sportBettingAudit?riskStatus=2')">
        <span>{{ t('体育注单审核') }}</span>
        <span class="text-[30px]">{{sportAuditCount}}</span>
      </div>
      <div class="flex flex-col items-center cursor-pointer" @click="router.push('/riskManagement/esportBettingAudit?riskStatus=2')">
        <span>{{ t('电竞注单审核') }}</span>
        <span class="text-[30px]">{{esportAuditCount}}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { useBetStore } from '@/store/bet';
import { useRiskNoticeStore } from '@/store/riskNotice';
import { useRiskNotice } from './util/hook';
import { useRouter } from "vue-router";
import { hasAuth } from '@/router/utils';

const router = useRouter();
const betStore = useBetStore();
const riskNoticeStore = useRiskNoticeStore();
const timeList = ['30', '60', '120', '180'];
const {
    riskNotificationSwitch,
    riskNotificationRefresh,
    setRiskNotification,
    esportAuditCount,
    jjAuditCount,
    sportAuditCount,
    getRiskNoticeAggregate
} = useRiskNotice();
const currentSelectTimeIndex = ref<number>(0);
const interval = ref<NodeJS.Timeout>();

const refreshRiskNotice = async () => {
  if (interval.value) clearInterval(interval.value);

  if (hasAuth('RISKNOTICEAGGREGATE')) {    
    if (riskNoticeStore.riskNotificationSwitch) {
      interval.value = setInterval(async () => {
        await getRiskNoticeAggregate();
      }, Number(riskNotificationRefresh.value) * 1000);
    }else {
        await getRiskNoticeAggregate();
    }
  }
};

onMounted(() => {
  refreshRiskNotice();
})

watch(
  () => [riskNotificationRefresh.value, riskNoticeStore.riskNotificationSwitch],
  () => {
    currentSelectTimeIndex.value = timeList.indexOf(riskNotificationRefresh.value);
    refreshRiskNotice();
  }
)

function changeTime (index: number) {
  currentSelectTimeIndex.value = index;
  riskNoticeStore.setRiskNoticeRefreshSecond(timeList[index]);
  riskNotificationRefresh.value = timeList[index];
  setRiskNotification();
}

</script>

<style scoped></style>
