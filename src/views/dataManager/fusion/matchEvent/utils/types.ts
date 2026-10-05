interface FormProps {
  matchDetail: MatchCombineAPI.matchSourceDetail;
}

export type searchFormType = {
  dataSourceCode?: string;
  sportId?: string|number;
  matchId?: string|number;
  leagueNameCn?: string;
  leagueNameEn?: string;
  homeTeamNameCn?: string;
  homeTeamNameEn?: string;
  awayTeamNameCn?: string;
  awayTeamNameEn?: string;
  pairingType: number;
  category?: number;
  startTime:string;
  endTime:string;
  pairingUser:string;
}

export type editSearchFormType = {
  sportId?: string|number;
  category:number;
  pageNum:number;
  pageSize:number;
  startTime:string|null;
  endTime:string|null;
  matchId188bet:number|null;
  leagueNameCn?: string;
  leagueNameEn?: string;
  homeTeamNameCn?: string;
  homeTeamNameEn?: string;
  awayTeamNameCn?: string;
  awayTeamNameEn?: string;
}

export type udpateOddsType = {
  matchId: number;
  isDataSourceOdds: number;
  type: number;
}

export type pairingRuleSettingType = {
  oppositeStatus: number;
  dpMatchId: number;
  matchId: number;
}

export type { FormProps };
