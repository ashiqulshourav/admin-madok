import { defineStore } from 'pinia';
import sound from '@/assets/media/order_sound.mp3';
import dayjs from 'dayjs';

export const useRiskNoticeStore = defineStore('RISKNOTICESTATE', {
  state: (): RiskManagementDataAPI.RiskNotice => ({
    esportAuditCount: 0,
    jjAuditCount: 0,
    sportAuditCount: 0,
    riskNotificationRefresh: '30',
    riskNotificationSwitch: 0,
    createTimeStart: 0,
    createTimeEnd: 0,
    isLoop: false,
  }),
  actions: {
    set_is_loop(_: boolean) {
      this.isLoop = _;
    },
    async setRiskNotice() {
      const riskNoticeRes = await API.getRiskNoticeAggregate({
        createTimeStart:
          this.createTimeStart ||
          dayjs().subtract(30, 'day').startOf('day').valueOf(),
        createTimeEnd: this.createTimeEnd || dayjs().endOf('day').valueOf()
      });

      if (!riskNoticeRes.code) {
        if (this.riskNotificationSwitch) {
          const existingValue =
            Number(this.esportAuditCount) +
            Number(this.jjAuditCount) +
            Number(this.sportAuditCount);
          const newValue =
            Number(riskNoticeRes.data.esportAuditCount) +
            Number(riskNoticeRes.data.jjAuditCount) +
            Number(riskNoticeRes.data.sportAuditCount);
          // play sound
          if (newValue > existingValue) {
            const audio = new Audio(sound);
            audio.play();
          }
        }

        this.esportAuditCount = riskNoticeRes.data.esportAuditCount;
        this.jjAuditCount = riskNoticeRes.data.jjAuditCount;
        this.sportAuditCount = riskNoticeRes.data.sportAuditCount;
      }
    },
    setRiskNoticeRefreshSecond(second: string) {
      this.riskNotificationRefresh = second;
    },
    async setRiskNotificationSwitch() {
      const res = await API.getRiskNotification();

      if (!res.code) {
        this.riskNotificationSwitch = res.data.riskNotificationSwitch;
      }
    },
    setRiskNoticeTimeFrame(date: {
      createTimeStart: number;
      createTimeEnd: number;
    }) {
      this.createTimeStart = date.createTimeStart;
      this.createTimeEnd = date.createTimeEnd;
    }
  },
  getters: {
    totalCount: state =>
      Number(state.esportAuditCount) +
      Number(state.jjAuditCount) +
      Number(state.sportAuditCount)
  },
  persist: {
    enabled: true,
    strategies: [{ storage: localStorage }]
  }
});
