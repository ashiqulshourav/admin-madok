import { defineStore } from "pinia";
import { store } from "@/store";
import { setType } from "./types";
import { getConfig } from "@/config";

export const useSettingStore = defineStore({
  id: "pure-setting",
  state: (): setType => ({
    title: getConfig().Title as string,
    fixedHeader: getConfig().FixedHeader,
    hiddenSideBar: getConfig().HiddenSideBar,
    settlePageInfo: {
      page: null,
      matchType: null,
    },
    settleHistoryPageInfo: {
      page: null,
      matchType: null,
    },
    playerListPageInfo: {
      page: null,
    },

  }),
  getters: {
    getTitle(state) {
      return state.title;
    },
    getFixedHeader(state) {
      return state.fixedHeader;
    },
    getHiddenSideBar(state) {
      return state.hiddenSideBar;
    }
  },
  actions: {
    CHANGE_SETTING({ key, value }) {
      if (Reflect.has(this, key)) {
        this[key] = value;
      }
    },
    changeSetting(data) {
      this.CHANGE_SETTING(data);
    },
    //- 结算页面信息保存
    save_selttle_page_info(info: { page: number | null; matchType: number | null }) {
      this.settlePageInfo = info;
    },
    //- 结算历史页面信息保存
    save_selttle_history_page_info(info: { page: number | null; matchType: number | null }) {
      this.settleHistoryPageInfo = info;
    },
    save_player_info(info: { page: number | null; }) {
      this.playerListPageInfo = info;
    },
  }
});

export function useSettingStoreHook() {
  return useSettingStore(store);
}
