declare namespace BetOrderAPI {
  type Detail = {
    "isInplay": number;
    "marketType": number;
    "oddValue": number;
    "marketTypeFinally": number;
    "oddFinally": number;
    "sportId": number;
    "sportNameCn": string;
    "sportNameEn": string;
    "matchId": number;
    "matchNameCn": string;
    "matchNameEn": string;
    "homeTeamNameCn": string;
    "homeTeamNameEn": string;
    "awayTeamNameCn": string;
    "awayTeamNameEn": string;
    "scoreBenchmark": string;
    "settleScore": string;
    "betItemCTID": number;
    "beginTime": string;
    "leagueId": number;
    "leagueNameCn": string;
    "leagueNameEn": null;
    "betItemId": number;
    "betItemName": string;
    "betHandicap": string;
    "betHomeOrAway": string;
    "kindsCode": string;
    "kindsName": string;
    "betResult": number;
    "category": number;
    "betN": string;
    betResultHomeScore?: string;
    betResultAwayScore?: string;
    detailId: string;
    index?: number;
    riskStatus: number;
    riskTimes: number;
    rejectSelected: boolean;
    approveSelected: boolean
  }

  type BetOrderList = {
    id: string;
    userId: string;
    userName: string;
    tenantId: string;
    tenantCode: string;
    orderAmount: number;
    productAmountTotal: string;
    profitAmount: null;
    settleAmount: null;
    createTime: string;
    updateTime: string;
    updateUser: string;
    settleTime: null;
    settleTimes: number;
    status: number;
    billStatus: number;
    seriesType: number;
    combineOrderDetails: Detail[];
    isSettlementAgain: number;
    riskStatusArr?: number[];
    isReserve: number;
    betResultArr: number[];
    orderRemark?: string;
    [key: string]: any;
  };

  type otherDataType = {
    thisPageBetTotalProfitAmount: number;
    thisPageBetUserCount: number;
    thisPageBetTotalAmount: number;
    thisPageBetCount: number;
    thisPageAvgOdds:number;
  };

  type RiskOtherDataType = {
    thisPageBetTotalProfitAmount: number;
    thisPageBetUserCount: number;
    thisPageBetTotalAmount: number;
    thisPageBetCount: number;
    thisPageAvgOdds:number;
  };

  type BetOrderData = {
    pageSize: number;
    pageNum: number;
    count: number;
    groupCount: null;
    pageData: BetOrderList[];
    otherData: otherDataType;
  };

  type BetOrderResType = COMMON.BASE_RES_TYPE<BetOrderData>;
  type betCenterCancelResType = COMMON.BASE_RES_TYPE<null>;



  type getUserByIpResPageData = {
    userName: string;
    tenantCode: string;
    limitLevel: string;
    macNo?: any;
    isFreeze: string;
    riskControlLabelList: any[];
  }

  type getUserByIpResData = {
    count: number;
    groupCount?: any;
    pageNum: number;
    pageSize: number;
    pageData: getUserByIpResPageData[];
    otherData?: any;
  }
  type getUserByIpResType = COMMON.BASE_RES_TYPE<getUserByIpResData>
}
