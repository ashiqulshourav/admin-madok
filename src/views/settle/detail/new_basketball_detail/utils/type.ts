export type FormProps = {
  matchId?: string | number;
  matchType?: string;
  matchName: string;
  halfSettlementStatus: number | string;
  fullSettlementStatus: number | string;
  dataVendors?: string;
  [key: string]: any;
};



export type SearchFormType = {
  leagueId: string;
  matchId: string;
  status: string;
  startTime: string;
  endTime: string;
};

export enum SPORT_TYPE {
  football = 1,
  basketball = 2,
  tennis = 3,
  billiards = 5,
  volleyball = 6,
  darts = 8,
  boxing = 10,
  hockey = 28,
  badminton = 19,
  pingpong = 23,
  rugby = 9,
  american_football = 16,
}

export type parentRowType = {
  row: SattleDataAPI.getSettlementDataList;
  index?: number;
};

export type MatchEventRowType = {
  row: SattleDataAPI.newBasketballEventsList;
  index: number;
};
