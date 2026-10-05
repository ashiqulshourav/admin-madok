export type SearchFormType = {
  sportId: number | string;
  leagueNameOrId: number | string;
  matchNameOrId: number | string;
  startTime: number | string;
  endTime: number | string;
}
export type WarningSearchFormType = {
  sportId: number | string;
  leagueNameOrId: number | string;
  matchNameOrId: number | string;
  startTime: number | string;
  endTime: number | string;
}

export type handicapListType =
  {
    listType: string;
    val: string;
    list: sportTradingDataAPI.MainBetItemsDtoList[];
    amount: number;
    amountType: string;
    betItemsIdList: number[];
    isSale: null | number;
  }