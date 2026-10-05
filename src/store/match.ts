import { defineStore } from 'pinia';
import { MatchType } from './types';
import { LeagueClassifyType } from '@/utils/maps/sports_map';
import {removeEmptyStringKeys} from "@/utils/utilFn";

export const useMatchStore = defineStore('MATCHSTATE', {
  state: (): MatchType => ({
    sportLeagueList: [],
    esportLeagueList: [],
    countryList: [],
    sportId: 1,
    matchSearchLoading: false,
    settleRequestLoading: false,
  }),
  actions: {
    async set_lagueList(
      category: LeagueClassifyType,
      sportId: number | string,
      leagueNameCn: string
    ) {
      const params = {
        pageSize: 9999,
        pageNum: 1,
        category,
        sportId,
        leagueNameCn
      };
      let listType: string;
      if (category === LeagueClassifyType.SPORT_CLASSIFY) {
        listType = 'sportLeagueList';
      } else {
        listType = 'esportLeagueList';
      }
      this.matchSearchLoading = true;
      const res: MetadataAPI.LeagueListRes = await API.getLeagueList(removeEmptyStringKeys(params));
      this.matchSearchLoading = false;
      if (res.code) {
        this.reset_lagueList();
      } else {
        this[listType] = res.data.list ?? [];
      }
    },
    reset_lagueList() {
      this.sportLeagueList.length = 0
      this.esportLeagueList.length = 0;
    },
    async set_countryList() {
      if (this.countryList.length > 0) return;
      const res: MetadataAPI.getCountryListResType = await API.getCountryList({
        pageNum: 1,
        pageSize: 9999
      });
      this.countryList = res.data.list;
    },

    search_league_list(query: string, currentSportId: number | string, category: LeagueClassifyType = 0) {
      if (query !== '') this.set_lagueList(category, currentSportId, query)
      else this.reset_lagueList()
    },
    set_settleRequestLoading(_: boolean) {
      this.settleRequestLoading = _;
    },
    set_currentSportId(id: number) {
      this.sportId = id;
    }
  },
  persist: {
    enabled: true,
    strategies: [{ storage: localStorage }]
  }
});
