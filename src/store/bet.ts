import { defineStore } from 'pinia';
import { BetType } from './types';

export const useBetStore = defineStore('BETSTATE', {
  state: (): BetType => ({
    gameplayData: {
      matchId: '',
      betItemsId: ''
    },
    isOpenVoice: true
  }),
  actions: {
    set_gameplay_data(d: BetType['gameplayData']) {
      Object.assign(this.gameplayData, d)
    },
    set_is_open_voice(_: boolean) {
      this.isOpenVoice = _;
    }
  },
});
