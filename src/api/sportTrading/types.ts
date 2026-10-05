declare namespace sportTradingDataAPI {
  type MorningSetMatchListParams = {
    pageNum?: number;
    pageSize?: number;
    sportId?: number | string;
    leagueNameOrId?: number | string;
    matchNameOrId?: number | string;
    startTime?: number | string;
    endTime?: number | string;
  };

  type MatchDtoList = {
    matchId: number;
    countryId?: any;
    sportId: number;
    leagueId: number;
    matchName: string;
    matchNameEn: string;
    homeTeamId: number;
    awayTeamId: number;
    beginTime: string;
    beginTimeLong: number;
    isSale?: any;
    category: number;
    periodType: number;
    leagueNameCn: string;
    leagueNameEn: string;
    homeTeamNameCn: string;
    homeTeamNameEn: string;
    awayTeamNameCn: string;
    awayTeamNameEn: string;
    operateStatus: string;
    dateTime: string;
    status?: any;
    level: number;
    riskLevel: number;
    HandicapTeam: string;
    val?: string;
    sourceCode: string;
  }

  type getMorningSetMatchListData = {
    type: string;
    matchDtoList: MatchDtoList[];
    size: number;
  }
  type getMorningSetMatchListRes = COMMON.BASE_RES_TYPE<getMorningSetMatchListData[]>

  type BetItemsDtoList = {
    betItemsId: string;
    matchId: number;
    kindsCode: string;
    betItemsName: string;
    betItemsNameEn?: any;
    sourceCode: string;
    sourceBetItemsId: number;
    sourceBetItemsMid: number;
    homeOrAway: string;
    handicap: string;
    handicapEn: null | boolean;
    odds: number;
    dpOdds?: any;
    isSale: number;
    displayIndex: number;
    handicapIndex: number;
    handicapItemIndex: number;
    oddsType: string;
    ctid: number;
    n: string;
    betCount: number;
    betAmount: number;
    oddsVariable: number;
    renderName?: string;
    previousDpOdds: number;
  }

  type KindsCodeDtoList = {
    betItemsIdList: number[];
    sourceBetItemsMid: number;
    betItemsDtoList: BetItemsDtoList[];
    isSale: number;
    betAmountDiffer: number;
  }

  type MainBetItemsDtoList = {
    betItemsIdList: number[];
    kindsCode: string;
    betItemsName: string;
    betItemsNameEn?: any;
    isSale: number;
    kindsCodeDtoList: KindsCodeDtoList[];
  }

  type getHandicapItemsData = {
    mainBetItemsDtoList: MainBetItemsDtoList[];
    goalBetItemsDtoList: MainBetItemsDtoList[];
    cornerBetItemsDtoList: MainBetItemsDtoList[];
    cardBetItemsDtoList: MainBetItemsDtoList[];
    overtimeBetItemsDtoList: MainBetItemsDtoList[];
    penaltyKickBetItemsDtoList: MainBetItemsDtoList[];
    specialBetItemsDtoList: MainBetItemsDtoList[];
    beginTimeLong: number;
    status: string; //赛事状态 nobegin  nover
    mainBetItemsSize: number;
    goalBetItemsSize: number;
    cornerBetItemsSize: number;
    cardBetItemsSize: number;
    overtimeBetItemsSize: number;
    penaltyKickBetItemsSize: number;
    specialBetItemsSize: number;
    sourceCode: string;
  }
  type getHandicapItemsRes = COMMON.BASE_RES_TYPE<getHandicapItemsData>

  type updateHandicapStatusParams = {
    matchId: number;
    operateMenu: string;
    groupName?: string;
    betItemsIds?: number[];
    isSale: number;
  }

  type updateHandicapOddsParams = {
    matchId: number;
    operateMenu: string;
    betItemsDtoList: { betItemsId: number; dpOdds: number }[];
  }

  type updateHandicapStatus = COMMON.BASE_RES_TYPE<null>
  type updateHandicapOddsParamsRes = COMMON.BASE_RES_TYPE<null>



  type MainListType = {
    betItemsIdList: number[];
    kindsCode: string;
    betItemsName: string;
    betItemsNameEn?: any;
    isSale: number;
    kindsCodeDtoList: KindsCodeDtoListType[];
  }



  type KindsCodeDtoListType = {
    betItemsIdList: number[];
    sourceBetItemsMid: number;
    isSale: number;
    betAmountDiffer: number;
    betItemsDtoList: BetItemsDtoList[];
  }


  type BetItemsResultDto = {
    mainBetItemsDtoList: MainListType[];
    goalBetItemsDtoList: MainListType[];
    cornerBetItemsDtoList: MainListType[];
    cardBetItemsDtoList: MainListType[];
    overtimeBetItemsDtoList: MainListType[];
    penaltyKickBetItemsDtoList: MainListType[];
    specialBetItemsDtoList: MainListType[];
    mainBetItemsSize: number;
    goalBetItemsSize: number;
    cornerBetItemsSize: number;
    cardBetItemsSize: number;
    overtimeBetItemsSize: number;
    penaltyKickBetItemsSize: number;
    specialBetItemsSize: number;
    status?: any;
    beginTimeLong?: any;
    currentTime?: any;
    sourceCode: string;
  }

  type getAlarmMatchListType = {
    matchId: number;
    countryId?: any;
    sportId: number;
    leagueId: number;
    matchName: string;
    matchNameEn: string;
    homeTeamId: number;
    awayTeamId: number;
    beginTime: string;
    beginTimeLong: number;
    isSale?: any;
    category: number;
    periodType: number;
    leagueNameCn: string;
    leagueNameEn: string;
    homeTeamNameCn: string;
    homeTeamNameEn: string;
    awayTeamNameCn: string;
    awayTeamNameEn: string;
    dateTime: string;
    status?: any;
    level: number;
    riskLevel: number;
    score: number;
    betItemsResultDto: BetItemsResultDto;
    renderList: renderListType[];
    HandicapTeam: string;
    operateStatus: string | number;
  }

  type renderListType = {
    listType: string;
    val: string;
    list: MainListType[];
    isSale?: number | null;
    betItemsIdList: number[];
  }

  type getAlarmMatchListData = {
    total: number;
    list: getAlarmMatchListType[];
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
    navigatepageNums?: any;
    navigateFirstPage: number;
    navigateLastPage: number;
  }

  type getAlarmMatchListRes = COMMON.BASE_RES_TYPE<getAlarmMatchListData>

  //- 告警设置
  type getOperateHandicapConfigData = {
    alarmValue: number;
    alarmPercent: number;
  }

  type getOperateHandicapConfigRes = COMMON.BASE_RES_TYPE<getOperateHandicapConfigData>

  type updateOperateHandicapConfigRes = COMMON.BASE_RES_TYPE<null>
  type resetHandicapOddsRes = COMMON.BASE_RES_TYPE<null>

  type loopAlarmMatchListParams = {
    sportId: number | string;
    pageNum: number;
    pageSize: number;
    total: number;
    pages: number;
    size: number;
    matchIdList: number[]
  }

  type resetHandicapOddsParams = {
    betItemsIds: string[];
    matchId: number;
    operateMenu: string;
  }
}
