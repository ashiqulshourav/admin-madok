declare namespace MetadataAPI {
  type LeagueListParams = {
    pageNum?: number;
    pageSize?: number;
    countryId?: number;
    leagueId?: number;
    leagueId188Bet?: number;
    leagueLogo?: string;
    leagueNameCn?: string;
    leagueNameEn?: string;
    level?: number;
    category?: number;
    sportId?: number | string;
    leagueTagsId?: ConfigCenterDataAPI.LeagueTagType[];
  };
  type updateLeagueParamsType = {
    leagueLogo?: string;
    leagueId?: number | string;
    countryId?: number | string;
    leagueId188Bet?: number | string;
    leagueNameCn?: string;
    leagueNameEn?: string;
    level?: number | string;
    sportId?: number | string;
    category?: number | string;
    leagueTagsId?: ConfigCenterDataAPI.LeagueTagType[];
  };

  type LeagueList = {
    leagueId: number | string;
    sportId: number | string;
    category?: number | string;
    countryId: number | string;
    leagueNameCn: string;
    leagueNameEn: string;
    leagueLogo?: string;
    leagueId188Bet?: number | string;
    level: string | number;
    riskLevel?: number | string;
    isEsportType?: boolean;
    leagueTagsId?: ConfigCenterDataAPI.LeagueTagType[];
    reservationSwitch?: number;
  };
  type LeagueListData = {
    total: number;
    list: LeagueList[];
    pageNum: number;
    pageSize: number;
    size: number;
    startRow: number;
    endRow: number;
    pages: number;
    prePage: number;
    nextPage: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    navigatePages: number;
    navigatepageNums: number[];
    navigateFirstPage: number;
    navigateLastPage: number;
  }

  type LeagueListRes = COMMON.BASE_RES_TYPE<LeagueListData>;
  type updateLeagueResType = COMMON.BASE_RES_TYPE<null>;

  type TeamList = {
    teamId: number;
    countryId: number;
    sportId: number;
    leagueId: number;
    teamNameCn: string;
    stadiumName?: string;
    teamNameEn: string;
    teamLogo?: string;
    level: number;
    isCountryTeam?: number;
  }
  type TeamListData = Omit<LeagueListData, 'list'> & { list: TeamList[] }
  type TeamListRes = {
    code: number;
    msg: string;
    data: TeamListData;
  }
  type AddBasketballEeventRes = {
    code: number;
    msg: string;
    data: TeamListData;
    failure: boolean;
    success: boolean;
    ts: number;
  }

  type UpLoadData = {
    remoteFileName: string;
    url: string;
    relativelyFileName: string;
    originalFileName: string;
  }

  type fileUploadResType = COMMON.BASE_RES_TYPE<UpLoadData>
  type AddHockeyEventRes = AddBasketballEeventRes;
  type AddBoxingEventRes = AddBasketballEeventRes;
  type AddDartsEventRes = AddBasketballEeventRes;

  type AddSportEventRes = {
    code: number;
    msg: string;
    data?: TeamListData;
    failure?: boolean;
    success?: boolean;
    ts: number;
  };


  type PlayerList = {
    birthday: string;
    countryId: number;
    gender: string;
    height: number;
    isCountryPlayer: number;
    nickName: string;
    pageNum: number;
    pageSize: number;
    picture: string;
    playerId: number;
    playerNameCn: string;
    teamId: number;
  }

  type PlayerListData = Omit<LeagueListData, 'list'> & { list: PlayerList[] }
  type PlayerListRes = {
    code: number;
    msg: string;
    data: PlayerListData;
  }

  type TeamListParamsType = {
    pageNum: number;
    pageSize: number;
    countryId?: number;
    isCountryTeam?: number;
    leagueId?: number;
    level?: number;
    sportId?: number;
    stadiumName?: string;
    teamId?: number;
    teamLogo?: string;
    teamNameCn?: string;
    teamNameEn?: string;
  }

  type UpdateTeamParamsType = Partial<TeamListParamsType>

  type getCountryListType = {
    countryId: number;
    countryNameCn: string;
    countryNameEn: string;
    countryLogo: string;
    countryId188Bet: number;
  }

  type getCountryListDataType = {
    total: number;
    list: getCountryListType[];
    pageNum: number;
    pageSize: number;
    size: number;
    startRow: number;
    endRow: number;
    pages: number;
    prePage: number;
    nextPage: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    navigatePages: number;
    navigatepageNums: number[];
    navigateFirstPage: number;
    navigateLastPage: number;
  }

  type getCountryListResType = COMMON.BASE_RES_TYPE<getCountryListDataType>

}

declare namespace MatchCombineAPI {
  type matchSourceDetail = {
    id: number,
    matchId: number,
    sportNameCn: string,
    sportNameEn: string,
    leagueNameCn: string,
    leagueNameEn: string,
    matchNameCn: string,
    matchNameEn: string,
    homeTeamNameCn: string,
    homeTeamNameEn: string,
    awayTeamNameCn: string,
    awayTeamNameEn: string,
    beginTime: string,
    startTime: null,
    endTime: null,
    videoMatchId: number,
    matchId188bet: number,
    category: number,
    dataSourceCode: string,
    pairingStatus: number,
    oppositeStatus: number,
    pageSize: number,
    pageNum: number,
    isDataSourceOdds: number,
    pandaOppositeStatus: number,
  }
  type matchSourceData = {
    data: {
      list: matchSourceDetail[],
      pageSize: number,
      pageNum: number,
      total: number,
    }
  }
  type matchPairingDetail = {
    "matchId": number,
    "countryId": null,
    "sportId": number,
    "leagueId": number,
    "matchName": null,
    "homeTeamId": number,
    "awayTeamId": number,
    "beginTime": string,
    "beginTimeLong": null,
    "playingField": null,
    "isNeutral": null,
    "level": null,
    "isSale": null,
    "videoUrl": null,
    "status": string,
    "hb": null,
    "hip": null,
    "ip": number,
    "mt": null,
    "uc": null,
    "currentScore": null,
    "currentTime": null,
    "currentPc": null,
    "pandaResult": number,
    "pandaMatchId": number,
    "pandaVideoId": "",
    "pandaOppositeStatus": number,
    "pandaLinkId": null,
    "matchId188bet": number,
    "videoMatchId": number,
    "videoReverse": null,
    "category": number,
    "periodType": null,
    "isChampion": null,
    "settlementStatus": null,
    "halfSettlementStatus": null,
    "fullSettlementStatus": null,
    "handicapStatus": null,
    "unSettlementEvents": null,
    "leagueNameCn": string,
    "leagueNameEn": string,
    "homeTeamNameCn": string,
    "homeTeamNameEn": string,
    "awayTeamNameCn": string,
    "awayTeamNameEn": string,
    "settlementType": null,
    "matchCondition": null,
    "startTime": null,
    "endTime": null,
    "leagueIds": null,
    "saleHandicaps": null,
    "allHandicaps": null,
    "pageSize": number,
    "pageNum": number,
    "cancelOrderTimes": null,
    "reSettleStatus": null,
    "overTimeAndPenaltyKickStatus": null,
    "openMatchIds": null,
    "filterMatchIds": null,
    "pairingType": number,
    "pairingTime": null,
    "pairingUser": string,
    "dataSourceCode": string
  }
  type matchPairingData = {
    data: {
      list: matchPairingDetail[],
      pageSize: number,
      pageNum: number,
    }
  }

}
