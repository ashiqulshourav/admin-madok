

declare namespace SattleDataAPI {
  type MatchEventsList = {
    canceled?: number | boolean;
    dataSourceCode?: string;
    eventCode?: string | number;
    eventTime?: string | number | Date;
    createdAt?: number;
    extraInfo?: string;
    homeAway?: string | null;
    id?: number;
    _tempDate?: number;
    matchId?: number;
    matchPeriodId?: number | string | null;
    matchType?: number;
    player1Id?: number;
    player1Name?: string;
    player2Name?: string;
    remark?: string;
    player2Id?: number;
    sourceType?: number;
    sportId?: number;
    t1: number | string | null;
    t2: number | string | null;
    isEdit?: boolean;
    t1Y?: number;
    t2Y?: number;
    t1R?: number;
    t2R?: number;
    isSave?: boolean;
    redOrYellow?: number | string;
    isBackEndReturnData: boolean;
    xjFlag: number;
    psFlag: number;
    vsFlag: number;
    settleType: number;
    settleTimes: number;
    t: number;
    isSettleStatus: boolean;
    isShowCount: boolean;
    firstNum?: number | string;
    firstT1?: number;
    firstT2?: number;
  };

  type CommonEventData = {
    id?: number;
    uuid?: string;
    matchId?: number;
    canceled?: number | boolean;
    eventTime?: number | string | Date;
    homeTeamId?: number;
    awayTeamId?: number;
    t1?: number | string;
    t2?: number | string;
    sourceType?: number;
    settleTimes?: number;
    settleType?: number;
    gameRule?: string | number;
    createdBy?: string;
    updatedBy?: string;
    createdAt?: string;
    updatedAt?: string;
  };

  type MatchEventParams = {
    canceled?: number;
    eventCode?: string | number;
    eventTime?: Date | number | string;
    homeAway?: string | null;
    matchId?: number;
    matchPeriodId?: number;
    player1Name?: string;
    sourceType?: number;
    matchPeriod?: string;
    sportId?: number;
    _tempDate?: number,
    dataSourceCode?: string;
    t1?: number | string;
    t2?: number | string;
    id?: number | null;
    gameRule?: string;
    inningNum?: number;
    firstNum?: number;
    firstT1?: number;
    firstT2?: number;
  };

  type HandballEvent = {
    awayTeamId: number | string;
    canceled: number | string;
    createdAt: number | string;
    createdBy: string;
    eventTime: number | string;
    homeTeamId: number | string;
    id: number | string;
    matchId: number | string;
    matchPeriodId: number | string;
    settleTimes: number | string;
    settleType: number | string;
    sourceType: number | string;
    firstT1: number | string;
    firstT2: number | string;
    updatedAt: number | string;
    updatedBy: number | string;
    firstNum: number | string;
    isEdit: boolean;
  };

  type IceHockeyEvent = HandballEvent;
  type CricketEvent = HandballEvent;


  type getSettlementDataList = {
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
    settlementStatus: number | null;
    isSale: number;
    videoUrl: string;
    status: string;
    currentScore: string;
    currentTime: string;
    currentPc: string;
    pandaResult: number;
    pandaVideoId: string;
    pandaMatchId: number;
    pandaLinkId: string;
    pandaOppositeStatus: number;
    halfSettlementStatus: number;
    fullSettlementStatus: number;
    matchCondition?: any;
    startTime?: any;
    endTime?: any;
    pageSize: number;
    pageNum: number;
    cancelOrderTimes?: number;
    unSettlementEvents: number;
    childrenData?: ChildrenDataList[];
    settlementType: number; //1 自动结算 //2 手动结算
    isShowCancelBtn?: boolean;
    periodType: number;
    reSettleStatus?: number; //1 重新结算姐main
  };

  type ChildrenDataList = {
    type: string;
    val: string;
    key: 'matchScoreRecordList' | 'penaltyCardRecordList' | 'cornerRecordList' | 'overTimeScoreRecordList' | 'overTimeCardRecordList' | 'overTimeCornerRecordList' | 'penaltyKickRecordList';
    tableList: MatchEventsList[];
  };

  type getSettlementDataListRes = {
    total: number;
    list: getSettlementDataList[];
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
  };

  type InningEvent = {
    id: number;
    uuid: string;
    matchId: number;
    canceled: number;
    eventTime: number | string;
    homeTeamId: number;
    awayTeamId: number;
    inningNum: number;
    setNum: number;
    firstT1: number | string;
    firstT2: number | string;
    sourceType: number;
    settleTimes: number;
    settleType: number;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
    isEdit?: boolean;
    gameRule: string;
    inningEvents?: any[];
    t1Error: boolean;
    t2Error: boolean;
    matchPeriodId?: number;
    eventTimeError: boolean;
    secondNum?: number;
  };

  type BasketBallEventsData = {
    id: number;
    uuid: string;
    matchId: number;
    canceled: number;
    eventTime: number | string;
    homeTeamId: number;
    awayTeamId: number;
    inningNum: number;
    setNum: number;
    t1: number | string;
    t2: number | string;
    sourceType: number;
    settleTimes: number;
    settleType: number;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
    gameRule: string;
    inningEvents: InningEvent[];
    loading?: boolean;
    matchPeriod?: string;
    isEdit: boolean;
  };

  type SnookerEventsResData = CommonEventData & {
    inningNum: number;
    homeTeamName?: any;
    awayTeamName?: any;
    isEdit?: boolean;
  };


  type ChildEvent = {
    id?: string;
    uuid?: string;
    matchId?: number;
    canceled?: number;
    eventCode?: string;
    eventTime?: number;
    homeAway?: string;
    matchPeriodId?: number | string;
    t1?: number;
    t2?: number;
    firstNum?: number | string;
    firstT1?: number;
    firstT2?: number;
    secondNum?: number;
    secondT1?: number | string;
    secondT2?: number | string;
    sourceType?: number;
    settleTimes?: number;
    settleType?: number;
    xjFlag?: number;
    psFlag?: number;
    vsFlag?: number;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
    oldEventId?: any;
    remark?: any;
    pageSize?: number;
    pageNum?: number;
    eventCodes?: any[];
    matchPeriodIds?: any[];
    childEvents?: any[];
    isEdit?: boolean;
  }

  type TennisEventsData = {
    id?: any;
    uuid?: any;
    matchId: number | string;
    canceled: number;
    eventCode?: any;
    eventTime?: any;
    homeAway: string;
    matchPeriodId: number;
    t1: number;
    t2: number;
    firstNum?: any;
    loading?: boolean;
    firstT1?: any;
    firstT2?: any;
    secondNum?: any;
    secondT1?: any;
    secondT2?: any;
    sourceType?: any;
    settleTimes?: any;
    settleType?: any;
    xjFlag?: any;
    psFlag?: any;
    vsFlag?: any;
    createdAt?: any;
    updatedAt?: any;
    createdBy?: any;
    updatedBy?: any;
    oldEventId?: any;
    remark?: any;
    pageSize: number;
    pageNum: number;
    eventCodes: any[];
    isCanResetSettle?: boolean;
    isEdit?: boolean;
    matchPeriodIds: any[];
    childEvents: ChildEvent[];
  }

  type volleyballData = {
    awayTeamId: number | string;
    canceled: number | string;
    createdAt: number | string;
    createdBy: string;
    eventTime: number | string;
    homeTeamId: number | string;
    id: number | string;
    matchId: number | string;
    matchPeriodId: number | string;
    settleTimes: number | string;
    settleType: number | string;
    sourceType: number | string;
    firstT1: string;
    firstT2: string;
    updatedAt: number | string;
    updatedBy: number | string;
    firstNum: number | string;
    isEdit: boolean;
    secondNum?: number | null | string;
  };

  type HockeyEventData = CommonEventData & { matchPeriod?: string };
  type BoxingEventData = CommonEventData & { matchPeriod?: string };
  type DartsEventData = CommonEventData & { matchPeriod?: string };
  type basketballData = SnookerEventsResData;
  type badmintonData = SnookerEventsResData;
  type pingpongData = SnookerEventsResData;
  type rugbyData = SnookerEventsResData;


  type MatchEventsData = {
    matchId: number;
    matchScoreRecordList: MatchEventsList[];
    penaltyCardRecordList: MatchEventsList[];
    cornerRecordList: MatchEventsList[];
    overTimeScoreRecordList: any[];
    overTimeCardRecordList: any[];
    overTimeCornerRecordList: any[];
    penaltyKickRecordList: any[];
    allOtherList: MatchEventsList[];
    normalTimeScore: string;
    normalTimeCorner: string;
    normalTimeYellowCard: string;
    normalTimeRedCard: string;
    overTimeScore: string;
    overTimeCorner: string;
    overTimeYellowCard: string;
    overTimeRedCard: string;
    penaltyKick: string;
    overTimeStatus: boolean;
    penaltyKickStatus: boolean;
    settlementStatus?: any;
  }


  type getSettlementListRes = COMMON.BASE_RES_TYPE<getSettlementDataListRes>;
  type getTennisEventsResType = COMMON.BASE_RES_TYPE<TennisEventsData[]>;
  type addTennisEventResType = COMMON.BASE_RES_TYPE<any>;
  type addBadmintonEventResType = COMMON.BASE_RES_TYPE<any>;
  type addRugbyEventResType = COMMON.BASE_RES_TYPE<any>;

  type getSnookerEventsResType = COMMON.BASE_RES_TYPE<SnookerEventsResData[]>;
  type getVolleyballEventsResType = COMMON.BASE_RES_TYPE<volleyballData[]>;
  type manualSettlementFullTimeRestType = COMMON.BASE_RES_TYPE<any>;
  type preSaleInfoResType = COMMON.BASE_RES_TYPE<getSettlementDataList>;

  type getHockeyEventRes = COMMON.BASE_RES_TYPE<HockeyEventData>;
  type getBoxingEventRes = COMMON.BASE_RES_TYPE<BoxingEventData>;
  type getDartsEventRes = COMMON.BASE_RES_TYPE<DartsEventData>;

  type getHandballEventRes = COMMON.BASE_RES_TYPE<HandballEvent[]>;
  type addHandballEventResType = COMMON.BASE_RES_TYPE<any>;
  type getIceHockeyEventRes = COMMON.BASE_RES_TYPE<IceHockeyEvent[]>;
  type addIceHockeyEventResType = COMMON.BASE_RES_TYPE<any>;
  type getCricketEventRes = COMMON.BASE_RES_TYPE<CricketEvent[]>;
  type addCricketEventResType = COMMON.BASE_RES_TYPE<any>;
  type getBasketballEventRes = COMMON.BASE_RES_TYPE<basketballData[]>;
  type getBadmintonEventRes = COMMON.BASE_RES_TYPE<badmintonData[]>;
  type getPingPongEventRes = COMMON.BASE_RES_TYPE<pingpongData[]>;
  type getRugbyEventRes = COMMON.BASE_RES_TYPE<rugbyData[]>;
  type getMatchEventsRes = COMMON.BASE_RES_TYPE<MatchEventsData>;
  type cancelBetOrderResType = COMMON.BASE_RES_TYPE<null>;
  type volleyReSettleMatchEventResType = COMMON.BASE_RES_TYPE<null>;
  type settleBaseResType = COMMON.BASE_RES_TYPE<null>

  type MatchIDType = { matchId: number }

  type getSettlementHistoryParams = {
    isSale?: number;
    leagueId?: number;
    pageNum: number;
    pageSize: number;
    sportId?: number;
    status?: number;
    startTime?: number;
    endTime?: number;
  };

  type cancelMatchEventParams = {
    id: number;
    matchId: number;
    remark: string;
  };

  type addTennisEventReq = {
    childEvents: {
      eventTime?: number | string;
      firstNum?: number | string;
      firstT1?: number | string;
      firstT2?: number | string;
      homeAway?: string;
      matchId?: number | string;
      matchPeriodId?: number | string;
      secondT1?: number | string;
      secondT2?: number | string;
    }[];
    eventTime?: number | string;
    firstNum?: number | string;
    homeAway?: string;
    matchId?: number | string;
    t1?: number;
    t2?: number;
  };
  type addRugbyEventReq = {
    eventTime: number | string | Date;
    matchId: number;
    inningNum: number;
    t1: number | string;
    t2: number | string;
    gameRule: string;
  };
  type SnookerEventReq = {
    eventTime: number | string;
    matchId: number;
    inningNum: number;
    t1: number | string;
    t2: number | string;
    gameRule: string;
  };
  type VolleyballReq = {
    eventTime: number;
    matchId: number;
    matchPeriodId: number | string;
    firstT1: number | string;
    firstT2: number | string;
    firstNum: number | string;
    id?: number | string;
    secondNum?: number | string | null;
    homeAway?: string;
  };
  type BadmintonEventReq = {
    eventTime: number | string | Date;
    matchId: number;
    inningNum: number;
    t1: number | string;
    t2: number | string;
    gameRule: string;
  };

  type getSettlementListPrams = {
    isSale?: number;
    leagueId?: number;
    pageNum?: number;
    pageSize?: number;
    sportId?: number;
    startTime?: number;
    matchId?: number;
    endTime?: number;
  };

  type newBasketballEventsList = {
    id: number;
    uuid: string;
    matchId: number;
    canceled: number;
    eventCode: string;
    _tempDate?: number;
    eventTime: number | string;
    homeAway: string;
    matchPeriodId: number;
    t1: number | string | null;
    t2: number | string | null;
    firstNum: number;
    firstT1: number;
    firstT2: number;
    secondNum: number;
    secondT1: number;
    secondT2: number;
    sourceType: number;
    settleTimes: number;
    settleType: number;
    xjFlag: number;
    psFlag: number;
    vsFlag: number;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
    oldEventId?: any;
    remark?: any;
    pageSize: number;
    isShowReSttleBtn?: boolean;
    pageNum: number;
    periodType?: number;
    isEdit?: boolean;
    isSave?: boolean;
  }

  type newBasketballEventsResType = COMMON.BASE_RES_TYPE<newBasketballEventsList[]>
  type manualSettlementFullTimeResType = COMMON.BASE_RES_TYPE<null>
  type basketballCancelMatchEventResType = COMMON.BASE_RES_TYPE<null>
  type open2ndSettlementStatusResType = COMMON.BASE_RES_TYPE<null>
  type tenantOpen2ndSettlementStatusResType = COMMON.BASE_RES_TYPE<null>
  type basketballOpen2ndSettlementStatusResType = COMMON.BASE_RES_TYPE<null>
  type tenantConfirm2ndSettlementResType = COMMON.BASE_RES_TYPE<null>

  type addBasketballEventV2ReqType = {
    eventTime: string | number | Date;
    matchId: number;
    matchPeriodId: string | number;
    t1: number;
    t2: number;
  }

  type confirm2ndSettlementReqType = {
    matchId: number;
    cancelEventIds: number[];
    deleteEventIds?: number[];
    newEventList: {
      matchId: number;
      _tempDate?: number;
      firstNum?: number | string;
      firstT1?: number | string;
      firstT2?: number | string;
      eventCode?: string | number;
      eventTime?: number | string | Date;
      homeAway?: string | null;
      matchPeriodId?: number | string | null;
      t1?: number | string | null;
      t2?: number | string | null;
    }[]
  }

  type tenantConfirm2ndSettlementReqType = {
    matchId: number;
    cancelFirstNumList: number[];
    newEventList: {
      matchId: number;
      _tempDate?: number;
      firstNum: string | number;
      childEvents: {
        eventTime?: number;
        firstNum?: number | string;
        firstT1?: number;
        firstT2?: number;
        homeAway?: string;
        matchId?: number;
        matchPeriodId?: number | string;
        secondNum?: number;
        secondT1?: number | string;
        secondT2?: number | string;
      }[]
    }[]
  }

  type cancelFootballPenaltyKickOrderReqParams = {
    matchId: number;
    remark: string;
    sportName: string;
  }

  type cancelFootballPenaltyKickOrderRes = COMMON.BASE_RES_TYPE<null>
  type updateMatchPeriodType = COMMON.BASE_RES_TYPE<null>
}
