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
  matchPeriodId: null;
  // player1Name: null,
  isBackEndReturnData: false;
  t1: null;
  t2: null;
  eventCode: 'goal' | 'yellow_red_card' | 'corner';
  redOrYellow?: number;
};

export type SearchFormType = {
  leagueId: string;
  matchId: string;
  status: string;
  startTime: string;
  endTime: string;
  periodType: number | string;
};

export type sport_list_map_type = {
  label: string;
  value: number;
  linkName: string;
}

export enum MatchEventType {
  Goal = 'goal',
  YellowRedCard = 'yellow_red_card',
  Corner = 'corner',
  MatchStatus = 'match_status'
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

export type parentRowType = {
  row: SattleDataAPI.getSettlementDataList;
  index?: number;
};

export type MatchEventRowType = {
  row: SattleDataAPI.MatchEventsList;
  index?: number;
};
