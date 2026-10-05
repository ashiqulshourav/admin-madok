import { defineStore } from 'pinia';

export const useBettingAuditStore = defineStore('BETTING_AUDIT', {
  state: (): any => ({
    dataFetchingTime: 60,
    hasDataFetching: true
  }),
  actions: {
    setDataFetchingTime(time: number) {
      this.dataFetchingTime = time;
    },
    setHasDataFetching() {
      this.hasDataFetching = !this.hasDataFetching;
    }
  },
  persist: {
    enabled: true,
    strategies: [{ storage: localStorage }]
  }
});
