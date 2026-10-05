declare namespace EsportsSettlementAPI {
  type ESportMatchList = {
    matchId: number;
    countryId: number;
    sportId: number;
    leagueId: number;
    leagueNameCn: string;
    matchName: string;
    homeTeamId: number;
    homeTeamNameCn: string;
    awayTeamId: number;
    awayTeamNameCn: string;
    beginTime: string;
    beginTimeLong: number;
    playingField: string;
    isNeutral: number;
    level: number;
    isSale: number;
    videoUrl: string;
    status: string;
    currentScore: string;
    currentTime: string;
    isShowCancelBtn?: boolean;
    cancelOrderTimes?: number;
    currentPc: string;
    pandaResult: number;
    pandaVideoId: string;
    pandaMatchId: number;
    pandaLinkId: string;
    pandaOppositeStatus: number;
    category?: any;
    halfSettlementStatus: number;
    fullSettlementStatus: number;
    settlementType?: any;
    matchCondition?: any;
    videoReverse: number;
    startTime?: any;
    endTime?: any;
    leagueIds?: any;
    saleHandicaps?: any;
    allHandicaps?: any;
    handicapStatus: number;
    unSettlementEvents?: any;
    pageSize: number;
    pageNum: number;
    isEdit?: boolean;
  }

  type ESportMatchListData = {
    total: number;
    list: ESportMatchList[];
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

  type getESportMatchListResType = COMMON.BASE_RES_TYPE<ESportMatchListData>
  type lockESportHandicapResType = COMMON.BASE_RES_TYPE<any>
  type unLockESportHandicapResType = COMMON.BASE_RES_TYPE<any>

  type getESportMatchListReqParams = {
    awayTeamId?: number;
    beginTime?: number;
    beginTimeLong?: number;
    countryId?: number;
    isSale?: number;
    leagueId?: number;
    matchName?: string;
    matchId?: number;
    pageNum?: number;
    pageSize?: number;
    sportId?: number;
    status?: number;
    startTime?: string;
    endTime?: string;
  }

  type BetItemsMapData = {
    betItemsId: number;
    betItemList?: any;
    sportId: number;
    leagueId: number;
    matchId: number;
    matchIdList?: any;
    kindsCode: string;
    betItemsName: string;
    betItemsNameEn: string;
    sourceCode: string;
    sourceBetItemsId: number;
    sourceBetItemsMid: number;
    homeOrAway: string;
    handicap: string;
    odds: number;
    id?: number;
    isSale: number;
    displayIndex: number;
    handicapIndex: number;
    handicapItemIndex: number;
    oddsType: string;
    handicapFilter: string;
    ctid: number;
    win: number;
    pageSize: number;
    pageNum: number;
    betOptions: number;
    oldBetOptions: number;
    multipartBetOptions: [];
    eventTime: number;
    arr: BetItemsMapData[];
    isEdit: boolean;
    n?: string;
  }

  type BetItemsMap = {
    all?: BetItemsMapData[]
    r1?: BetItemsMapData[]
    r2?: BetItemsMapData[]
    map1?: BetItemsMapData[]
    map2?: BetItemsMapData[]
    q1?: BetItemsMapData[]
    q2?: BetItemsMapData[]
    [key: string]: BetItemsMapData[]
  }

  type ESportMatchById = {
    matchId: number;
    sportId: number;
    beginTime: string;
    beginTimeLong: number;
    status: string;
    leagueId: number;
    leagueNameCn?: any;
    isSale: number;
    homeTeamId: number;
    homeTeamNameCn: string;
    awayTeamId: number;
    awayTeamNameCn: string;
    category: number;
    settlementStatus?: any;
    betItemsMap: BetItemsMap;
  }

  type Data = {
    matchId: number;
    sportId: number;
    beginTime: string;
    beginTimeLong: number;
    status: string;
    leagueId: number;
    leagueNameCn?: any;
    isSale: number;
    homeTeamId: number;
    homeTeamNameCn: string;
    awayTeamId: number;
    awayTeamNameCn: string;
    category: number;
    settlementStatus?: any;
    betItemsMap: BetItemsMap;
  }

  export interface HandicapList {
    betItemsId: number;
    sportId: number;
    leagueId: number;
    matchId: number;
    kindsCode: string;
    betItemsName: string;
    betItemsNameEn?: any;
    sourceCode: string;
    sourceBetItemsId: number;
    sourceBetItemsMid: number;
    homeOrAway: string;
    handicap: string;
    n: string;
    handicapEn?: any;
    odds: number;
    isSale: number;
    displayIndex: number;
    handicapIndex: number;
    handicapItemIndex: number;
    oddsType: string;
    handicapFilter?: any;
    ctid: number;
    win?: any;
    id: number;
  }

  type ChampionEventList = {
    betItemsId?: any;
    betItemList?: any;
    sportId?: any;
    leagueId?: any;
    matchId: number;
    matchIdList?: any;
    kindsCode: string;
    betItemsName: string;
    betItemsNameEn?: any;
    sourceCode?: any;
    sourceBetItemsId?: any;
    sourceBetItemsMid?: number;
    homeOrAway?: any;
    handicap?: any;
    handicapEn?: any;
    odds?: any;
    isSale: number;
    displayIndex?: any;
    handicapIndex?: any;
    handicapItemIndex?: any;
    oddsType?: any;
    handicapFilter?: any;
    ctid?: any;
    n?: any;
    win?: any;
    eventTime?: any;
    pageSize: number;
    pageNum: number;
    id?: any;
    settleStatus: number;
    updatedAt?: any;
    betOptions: number;
    multipartBetOptions: number[];
    oldBetOptions: number;
    isEdit: boolean;
    handicapList: HandicapList[];
  }

  type getESportMatchByIdResType = COMMON.BASE_RES_TYPE<ESportMatchById>
  type manualSettleESportHandicapResType = COMMON.BASE_RES_TYPE<any>
  type getChampionEventsResType = COMMON.BASE_RES_TYPE<ChampionEventList[]>
}