import { useRiskNoticeStore } from '@/store/riskNotice';
import dayjs from 'dayjs';

export function useRiskNotice() {
  const riskNotificationRefresh = ref('30');
  const riskNotificationSwitch = ref(0);
  const riskNoticeStore = useRiskNoticeStore();
  const esportAuditCount = ref(0);
  const jjAuditCount = ref(0);
  const sportAuditCount = ref(0);

  async function getRiskNotification() {
    const res = await API.getRiskNotification();
    if (!res.code) {
      riskNotificationRefresh.value = res.data.riskNotificationRefresh!;
      riskNotificationSwitch.value = res.data.riskNotificationSwitch!;
      await riskNoticeStore.setRiskNotificationSwitch();
    }
  }

  async function setRiskNotification() {
    const res = await API.setRiskNotification({
      riskNotificationRefresh: riskNotificationRefresh.value,
      riskNotificationSwitch: riskNotificationSwitch.value
    });

    if (!res.code) {
      await riskNoticeStore.setRiskNotice();
      await riskNoticeStore.setRiskNotificationSwitch();
    }
  }

  async function getRiskNoticeAggregate() {
    const riskNoticeRes = await API.getRiskNoticeAggregate({
      createTimeStart: dayjs().subtract(30, 'day').startOf('day').valueOf(),
      createTimeEnd: dayjs().endOf('day').valueOf()
    });

    if (!riskNoticeRes.code) {
      esportAuditCount.value = riskNoticeRes.data.esportAuditCount!;
      jjAuditCount.value = riskNoticeRes.data.jjAuditCount!;
      sportAuditCount.value = riskNoticeRes.data.sportAuditCount!;
    }
  }

  onMounted(() => {
    getRiskNotification();
    getRiskNoticeAggregate();
  });

  return {
    riskNotificationRefresh,
    riskNotificationSwitch,
    setRiskNotification,
    esportAuditCount,
    jjAuditCount,
    sportAuditCount,
    getRiskNoticeAggregate
  };
}
