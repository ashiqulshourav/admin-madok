export type FormProps = {
  matchId?: string | number;
  matchType?: string;
  matchName: string;
  halfSettlementStatus: number | string;
  fullSettlementStatus: number | string;
  dataVendors?: string;
  [key: string]: any;
};

export type TempListType = {
  eventTime: number | string;
  homeAway: null;
  matchPeriodId: null | number;
  // player1Name: null,
  _tempDate?: number,
  isBackEndReturnData: false;
  t1: null;
  t2: null;
  eventCode: 'goal' | 'yellow_red_card' | 'corner';
  redOrYellow?: number;
};

export enum MatchEventType {
  Goal = 'goal',
  YellowRedCard = 'yellow_red_card',
  Corner = 'corner',
  MatchStatus = 'match_status'
}

export enum MatchTimeType {
  regular_season_first_half = 6, //- 常规赛上半场
  regular_season_first_all = 7, //- 常规赛下半场
  extraTimeFirstHalf = 41, //- 加时赛上半场
  extraTimeFirstAll = 42, //- 加时赛下半场
  PSO = 50,  //- 点球大战
}

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
  handball = 11,
  iceHockey = 12,
  cricket = 13
}

export enum SETTLE_BUTTON_TYPE {
  normal_half = 0,
  normal_all = 31,
  over_half = 100,
  over_all = 33,
  penalty_kick = 110,
  close = 120,
}

export type parentRowType = {
  row: SattleDataAPI.getSettlementDataList;
  index?: number;
};

export type MatchEventRowType = {
  row: SattleDataAPI.MatchEventsList;
  index: number;
};
