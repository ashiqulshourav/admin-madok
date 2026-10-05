import { http } from '@/utils/http';

const { request } = http;;
export const sattleData = {
  getSettlementList: (data: SattleDataAPI.getSettlementListPrams) =>
    request<SattleDataAPI.getSettlementListRes>(
      'post',
      '/match/v1/getSettlementList',
      { data }
    ),

  //- 体育结算历史
  getSettlementHistory: (data: SattleDataAPI.getSettlementHistoryParams) =>
    request<SattleDataAPI.getSettlementListRes>(
      'post',
      '/match/v1/getSettlementHistory',
      { data }
    ),

  getMatchEvents: (data: SattleDataAPI.MatchIDType) =>
    request<SattleDataAPI.getMatchEventsRes>(
      'post',
      '/event/v1/getMatchEvents',
      { data }
    ),

  //- 足球是否开启加时赛
  setOverTimeStatus: (data: {
    matchId: string;
    overTimeStatus: boolean
  }) =>
    request<SattleDataAPI.getMatchEventsRes>(
      'post',
      '/event/v1/setOverTimeStatus',
      { data }
    ),

  //- 足球是否开启点球
  setPenaltyKickStatus: (data: {
    matchId: string;
    penaltyKickStatus: boolean
  }) =>
    request<SattleDataAPI.getMatchEventsRes>(
      'post',
      '/event/v1/setPenaltyKickStatus',
      { data }
    ),

  //- 足球加时赛上半场结算
  overTimeHalfSettlement: (data: { matchId: number; }) =>
    request<SattleDataAPI.settleBaseResType>(
      'post',
      '/event/v1/overTimeHalfSettlement',
      { data }
    ),

  //- 足球加时赛全场结算
  overTimeFullSettlement: (data: { matchId: number }) =>
    request<SattleDataAPI.settleBaseResType>(
      'post',
      '/event/v1/overTimeFullSettlement',
      { data }
    ),
  //- 点球结算
  penaltyKickSettlement: (data: { matchId: number }) =>
    request<SattleDataAPI.settleBaseResType>(
      'post',
      '/event/v1/penaltyKickSettlement',
      { data }
    ),

  //- 关闭结算状态

  closeSaleStatus: (data: { matchId: number }) =>
    request<SattleDataAPI.settleBaseResType>(
      'post',
      '/event/v1/closeSaleStatus',
      { data }
    ),

  getBasketballEvents: (data: SattleDataAPI.MatchIDType) =>
    request<SattleDataAPI.getBasketballEventRes>(
      'post',
      '/basketball/v1/getBasketballEvents',
      { data }
    ),

  getHandballEvents: (data: SattleDataAPI.MatchIDType) =>
    request<SattleDataAPI.getHandballEventRes>(
      'post',
      '/handball/v1/getHandballEvents',
      { data }
    ),
  getIceHockeyEvents: (data: SattleDataAPI.MatchIDType) =>
    request<SattleDataAPI.getHandballEventRes>(
      'post',
      '/iceHockey/v1/getIceHockeyEvents',
      { data }
    ),
  getDartsEvents: (data: SattleDataAPI.MatchIDType) =>
    request<SattleDataAPI.getDartsEventRes>(
      'post',
      '/darts/v1/getDartsEvents',
      { data }
    ),

  addMatchEvent: (data: SattleDataAPI.MatchEventParams) =>
    request<MetadataAPI.TeamListRes>('post', '/event/v1/addMatchEvent', {
      data
    }),

  addBasketballEvent: (data: SattleDataAPI.MatchEventParams) =>
    request<MetadataAPI.AddBasketballEeventRes>(
      'post',
      '/basketball/v1/addBasketballEvent',
      { data }
    ),
  addHandballEvent: (data: SattleDataAPI.MatchEventParams) =>
    request<MetadataAPI.AddSportEventRes>(
      'post',
      '/handball/v1/addHandballEvent',
      { data }
    ),
  //- 新增冰球事件
  addIceHockeyEvent: (data: SattleDataAPI.MatchEventParams) =>
    request<MetadataAPI.AddSportEventRes>(
      'post',
      '/iceHockey/v1/addIceHockeyEvent',
      { data }
    ),
  //- 新增板球事件
  addCricketEvent: (data: SattleDataAPI.MatchEventParams) =>
    request<MetadataAPI.AddSportEventRes>(
      'post',
      '/cricket/v1/addCricketEvent',
      { data }
    ),
  //- 新增曲棍球事件
  addHockeyEvent: (data: SattleDataAPI.MatchEventParams) =>
    request<MetadataAPI.AddSportEventRes>(
      'post',
      '/hockey/v1/addHockeyEvent',
      { data }
    ),
  //- 新增橄榄球事件
  addRugbyEvent: (data: SattleDataAPI.MatchEventParams) =>
    request<MetadataAPI.AddSportEventRes>(
      'post',
      '/rugby/v1/addRugbyEvent',
      { data }
    ),

  allHandballSettlement: (data: SattleDataAPI.MatchIDType) =>
    request<MetadataAPI.AddSportEventRes>(
      'post',
      '/handball/v1/manualSettlementFullTime',
      { data }
    ),
  //- 冰球全场结算
  allIceHockeySettlement: (data: SattleDataAPI.MatchIDType) =>
    request<MetadataAPI.AddSportEventRes>(
      'post',
      '/iceHockey/v1/manualSettlementFullTime',
      { data }
    ),
  allCricketSettlement: (data: SattleDataAPI.MatchIDType) =>
    request<MetadataAPI.AddSportEventRes>(
      'post',
      '/cricket/v1/manualSettlementFullTime',
      { data }
    ),
  addDartsEvent: (data: SattleDataAPI.MatchEventParams) =>
    request<MetadataAPI.AddDartsEventRes>(
      'post',
      '/darts/v1/addDartsEvent',
      { data }
    ),

  allBasketballSettlement: (data: SattleDataAPI.MatchIDType) =>
    request<MetadataAPI.AddBasketballEeventRes>(
      'post',
      '/basketball/v1/manualSettlementFullTime',
      { data }
    ),


  allBoxingSettlement: (data: SattleDataAPI.MatchIDType) =>
    request<MetadataAPI.AddBoxingEventRes>(
      'post',
      '/boxing/v1/manualSettlementFullTime',
      { data }
    ),

  allDartsSettlement: (data: SattleDataAPI.MatchIDType) =>
    request<MetadataAPI.AddDartsEventRes>(
      'post',
      '/darts/v1/manualSettlementFullTime',
      { data }
    ),

  updateMatchEvent: (data: SattleDataAPI.MatchEventParams) =>
    request<SaleDataAPI.PreSaleListRes>(
      'post',
      '/event/v1/updateMatchEvent',
      { data }
    ),

  deleteMatchEvent: (data: { id: number }) =>
    request<SaleDataAPI.deleteMatchEventRes>(
      'post',
      '/event/v1/deleteMatchEvent',
      { data }
    ),

  firstHalfSettlement: (data: SattleDataAPI.MatchIDType) =>
    request<SaleDataAPI.allSettlementRes>(
      'post',
      '/event/v1/firstHalfSettlement',
      { data }
    ),

  allSettlement: (data: SattleDataAPI.MatchIDType) =>
    request<SaleDataAPI.allSettlementRes>(
      'post',
      '/event/v1/allSettlement',
      { data }
    ),

  //- 足球结算自动结算转手动结算
  setManualMatchStatus: (data: SattleDataAPI.MatchIDType) =>
    request<SaleDataAPI.setManualMatchStatusResType>(
      'post',
      '/event/v1/setManualMatchStatus',
      { data }
    ),

  //- 足球结算取消事件
  cancelMatchEvent: (data: SattleDataAPI.cancelMatchEventParams) =>
    request<SaleDataAPI.cancelMatchEventResType>(
      'post',
      '/event/v1/cancelMatchEvent',
      { data }
    ),

  //-网球结算赛事列表
  getTennisEvents: (data: SattleDataAPI.MatchIDType) =>
    request<SattleDataAPI.getTennisEventsResType>(
      'post',
      '/tennis/v2/getTennisEvents',
      { data }
    ),

  //-网球新增事件（按盘）
  addTennisEvent: (data: SattleDataAPI.addTennisEventReq) =>
    request<SattleDataAPI.addTennisEventResType>(
      'post',
      '/tennis/v2/addTennisEvent',
      { data }
    ),

  //-网球重新结算（按盘）
  TennisReSettleMatchEvent: (data: SattleDataAPI.addTennisEventReq) =>
    request<SattleDataAPI.addTennisEventResType>(
      'post',
      '/tennis/v2/reSettleMatchEvent',
      { data }
    ),
  //-斯诺克新增事件（按局）
  addSnookerEvent: (data: SattleDataAPI.VolleyballReq) =>
    request<SattleDataAPI.addTennisEventResType>(
      'post',
      '/snooker/v1/addSnookerEvent',
      { data }
    ),
  //-棒球新增事件（按局）
  addBaseballEvent: (data: SattleDataAPI.VolleyballReq) =>
    request<SattleDataAPI.addTennisEventResType>(
      'post',
      '/baseball/v1/addBaseballEvent',
      { data }
    ),

  //-格斗结算 
  addBoxingEvent: (data: SattleDataAPI.VolleyballReq) =>
    request<SattleDataAPI.addTennisEventResType>(
      'post',
      '/boxing/v1/addBoxingEvent',
      { data }
    ),

  //-羽毛球新增事件（按局）
  addBadmintonballEvent: (data: SattleDataAPI.VolleyballReq) =>
    request<SattleDataAPI.addTennisEventResType>(
      'post',
      '/badminton/v1/addBadmintonEvent',
      { data }
    ),

  //-乒乓球新增事件（按局）
  addPingPongballEvent: (data: SattleDataAPI.VolleyballReq) =>
    request<SattleDataAPI.addTennisEventResType>(
      'post',
      '/pingPong/v1/addPingPongEvent',
      { data }
    ),

  //-排球新增事件（按局）
  addVolleyballEvent: (data: SattleDataAPI.VolleyballReq) =>
    request<SattleDataAPI.addTennisEventResType>(
      'post',
      '/volleyball/v1/addVolleyballEvent',
      { data }
    ),

  //-斯诺克结算事件列表
  getSnookerEvents: (data: SattleDataAPI.MatchIDType) =>
    request<SattleDataAPI.getVolleyballEventsResType>(
      'post',
      '/snooker/v1/getSnookerEvents',
      { data }
    ),
  //-棒球结算事件列表
  getBaseballEvents: (data: SattleDataAPI.MatchIDType) =>
    request<SattleDataAPI.getVolleyballEventsResType>(
      'post',
      '/baseball/v1/getBaseballEvents',
      { data }
    ),
  //-格斗结算事件列表
  getBoxingEvents: (data: SattleDataAPI.MatchIDType) =>
    request<SattleDataAPI.getVolleyballEventsResType>(
      'post',
      '/boxing/v1/getBoxingEvents',
      { data }
    ),
  //-羽毛球结算事件列表
  getBadmintonEvents: (data: SattleDataAPI.MatchIDType) =>
    request<SattleDataAPI.getVolleyballEventsResType>(
      'post',
      '/badminton/v1/getBadmintonEvents',
      { data }
    ),

  //-排球结算事件列表
  getVolleyballEvents: (data: SattleDataAPI.MatchIDType) =>
    request<SattleDataAPI.getVolleyballEventsResType>(
      'post',
      '/volleyball/v1/getVolleyballEvents',
      { data }
    ),
  //-乒乓球结算事件列表
  getPingpongEvents: (data: SattleDataAPI.MatchIDType) =>
    request<SattleDataAPI.getVolleyballEventsResType>(
      'post',
      '/pingPong/v1/getPingPongEvents',
      { data }
    ),
  //- 板球结算事件列表
  getCricketEvents: (data: SattleDataAPI.MatchIDType) =>
    request<SattleDataAPI.getVolleyballEventsResType>(
      'post',
      '/cricket/v1/getCricketEvents',
      { data }
    ),
  //- 曲棍球
  getHockeyEvents: (data: SattleDataAPI.MatchIDType) =>
    request<SattleDataAPI.getVolleyballEventsResType>(
      'post',
      '/hockey/v1/getHockeyEvents',
      { data }
    ),
  //- 英式橄榄球
  getRugbyEvents: (data: SattleDataAPI.MatchIDType) =>
    request<SattleDataAPI.getVolleyballEventsResType>(
      'post',
      '/rugby/v1/getRugbyEvents',
      { data }
    ),
  //- 排球结算管理重新结算
  volleyballReSettleMatchEvent: (data: SattleDataAPI.VolleyballReq) =>
    request<SattleDataAPI.volleyReSettleMatchEventResType>(
      'post',
      '/volleyball/v1/reSettleMatchEvent',
      { data }
    ),
  //- 板球结算管理重新结算
  cricketReSettleMatchEvent: (data: SattleDataAPI.VolleyballReq) =>
    request<SattleDataAPI.volleyReSettleMatchEventResType>(
      'post',
      '/cricket/v1/reSettleMatchEvent',
      { data }
    ),
  //- 曲棍球结算管理重新结算
  hockeyReSettleMatchEvent: (data: SattleDataAPI.VolleyballReq) =>
    request<SattleDataAPI.volleyReSettleMatchEventResType>(
      'post',
      '/hockey/v1/reSettleMatchEvent',
      { data }
    ),
  //- 橄榄球结算管理重新结算
  rugbyReSettleMatchEvent: (data: SattleDataAPI.VolleyballReq) =>
    request<SattleDataAPI.volleyReSettleMatchEventResType>(
      'post',
      '/rugby/v1/reSettleMatchEvent',
      { data }
    ),
  //- 斯诺克结算管理重新结算
  snookerReSettleMatchEvent: (data: SattleDataAPI.VolleyballReq) =>
    request<SattleDataAPI.volleyReSettleMatchEventResType>(
      'post',
      '/snooker/v1/reSettleMatchEvent',
      { data }
    ),
  //- 棒球结算管理重新结算
  baseballReSettleMatchEvent: (data: SattleDataAPI.VolleyballReq) =>
    request<SattleDataAPI.volleyReSettleMatchEventResType>(
      'post',
      '/baseball/v1/reSettleMatchEvent',
      { data }
    ),
  //- 格斗结算管理重新结算
  boxingReSettleMatchEvent: (data: SattleDataAPI.VolleyballReq) =>
    request<SattleDataAPI.volleyReSettleMatchEventResType>(
      'post',
      '/boxing/v1/reSettleMatchEvent',
      { data }
    ),
  //- 羽毛球结算管理重新结算
  badmintonReSettleMatchEvent: (data: SattleDataAPI.VolleyballReq) =>
    request<SattleDataAPI.volleyReSettleMatchEventResType>(
      'post',
      '/badminton/v1/reSettleMatchEvent',
      { data }
    ),
  //- 乒乓球结算管理重新结算
  pingPongReSettleMatchEvent: (data: SattleDataAPI.VolleyballReq) =>
    request<SattleDataAPI.volleyReSettleMatchEventResType>(
      'post',
      '/pingPong/v1/reSettleMatchEvent',
      { data }
    ),


  //- 手球结算管理重新结算
  handballReSettleMatchEvent: (data: SattleDataAPI.VolleyballReq) =>
    request<SattleDataAPI.volleyReSettleMatchEventResType>(
      'post',
      '/handball/v1/reSettleMatchEvent',
      { data }
    ),

  //- 冰球结算管理重新结算
  iceHockeyReSettleMatchEvent: (data: SattleDataAPI.VolleyballReq) =>
    request<SattleDataAPI.volleyReSettleMatchEventResType>(
      'post',
      '/iceHockey/v1/reSettleMatchEvent',
      { data }
    ),

  //-网球全场结算（按盘）
  manualSettlementFullTime: (data: { matchId: number, t1: number; t2: number; }) =>
    request<SattleDataAPI.manualSettlementFullTimeRestType>(
      'post',
      '/tennis/v2/manualSettlementFullTime',
      { data }
    ),

  //-排球全场结算（按局）
  volleyballManualSettlementFullTime: (data: SattleDataAPI.MatchIDType) =>
    request<SattleDataAPI.manualSettlementFullTimeRestType>(
      'post',
      '/volleyball/v1/manualSettlementFullTime',
      { data }
    ),
  //-板球全场结算（按局）
  cricketManualSettlementFullTime: (data: SattleDataAPI.MatchIDType) =>
    request<SattleDataAPI.manualSettlementFullTimeRestType>(
      'post',
      '/cricket/v1/manualSettlementFullTime',
      { data }
    ),
  //-曲棍球全场结算（按局）
  allHockeySettlement: (data: SattleDataAPI.MatchIDType) =>
    request<SattleDataAPI.manualSettlementFullTimeRestType>(
      'post',
      '/hockey/v1/manualSettlementFullTime',
      { data }
    ),
  //-橄榄球全场结算（按局）
  allRugbySettlement: (data: SattleDataAPI.MatchIDType) =>
    request<SattleDataAPI.manualSettlementFullTimeRestType>(
      'post',
      '/rugby/v1/manualSettlementFullTime',
      { data }
    ),
  //-斯诺克全场结算（按局）
  snookerManualSettlementFullTime: (data: SattleDataAPI.MatchIDType) =>
    request<SattleDataAPI.manualSettlementFullTimeRestType>(
      'post',
      '/snooker/v1/manualSettlementFullTime',
      { data }
    ),
  //- 棒球全场结算（按局）
  baseballManualSettlementFullTime: (data: SattleDataAPI.MatchIDType) =>
    request<SattleDataAPI.manualSettlementFullTimeRestType>(
      'post',
      '/baseball/v1/manualSettlementFullTime',
      { data }
    ),
  //-格斗全场结算（按局）
  boxingManualSettlementFullTime: (data: SattleDataAPI.MatchIDType) =>
    request<SattleDataAPI.manualSettlementFullTimeRestType>(
      'post',
      '/boxing/v1/manualSettlementFullTime',
      { data }
    ),
  //-羽毛球全场结算（按局）
  badmintonManualSettlementFullTime: (data: SattleDataAPI.MatchIDType) =>
    request<SattleDataAPI.manualSettlementFullTimeRestType>(
      'post',
      '/badminton/v1/manualSettlementFullTime',
      { data }
    ),
  //-乒乓球全场结算（按局）
  PingPongManualSettlementFullTime: (data: SattleDataAPI.MatchIDType) =>
    request<SattleDataAPI.manualSettlementFullTimeRestType>(
      'post',
      '/pingPong/v1/manualSettlementFullTime',
      { data }
    ),
  //- 获取单个赛事信息
  getPreSaleInfo: (data: SattleDataAPI.MatchIDType) =>
    request<SattleDataAPI.preSaleInfoResType>(
      'post',
      '/match/v1/getPreSaleInfo',
      { data }
    ),

  //- 取消赛事
  cancelBetOrder: (data: {
    matchId: number;
    remark: string;
    sportName: string;
  }) =>
    request<SattleDataAPI.cancelBetOrderResType>(
      'post',
      '/match/v1/cancelMatchOrder',
      { data }
    ),

  /* 
  * 篮球结算新版接口
   */

  getNewBasketballEvents: (data: SattleDataAPI.MatchIDType) => request<SattleDataAPI.newBasketballEventsResType>(
    'post', '/basketball/v2/getBasketballEvents', { data }),

  //- 美式足球事件列表
  getAmericanFootballEvents: (data: SattleDataAPI.MatchIDType) => request<SattleDataAPI.newBasketballEventsResType>(
    'post', '/americanFootball/v1/getAmericanFootballEvents', { data }),


  //- 美式足球手动新增事件
  addAmericanFootballEvent: (data: SattleDataAPI.addBasketballEventV2ReqType) => request<SattleDataAPI.newBasketballEventsResType>(
    'post', '/americanFootball/v1/addAmericanFootballEvent', { data }),

  //- 篮球手动新增事件
  addBasketballEventV2: (data: SattleDataAPI.addBasketballEventV2ReqType) => request<SattleDataAPI.newBasketballEventsResType>(
    'post', '/basketball/v2/addBasketballEventV2', { data }),
  //- 篮球全场结算
  v2ManualSettlementFullTime: (data: SattleDataAPI.MatchIDType) => request<SattleDataAPI.manualSettlementFullTimeResType>(
    'post', '/basketball/v2/manualSettlementFullTime', { data }),

  //- 美式足球全场结算
  americanManualSettlementFullTime: (data: SattleDataAPI.MatchIDType) => request<SattleDataAPI.manualSettlementFullTimeResType>(
    'post', '/americanFootball/v1/manualSettlementFullTime', { data }),

  //- 篮球针对事件重新结算
  reSettleMatchEvent: (data: {
    matchId: number;
    id: number;
    matchPeriodId: number;
    t1: number | string;
    t2: number | string;
  }) => request<SattleDataAPI.basketballCancelMatchEventResType>(
    'post', '/basketball/v1/reSettleMatchEvent', { data }),

  //- 美式足球重新结算
  americanReSettleMatchEvent: (data: {
    matchId: number;
    id: number;
    matchPeriodId: number;
    t1: number | string;
    t2: number | string;
  }) => request<SattleDataAPI.basketballCancelMatchEventResType>(
    'post', '/americanFootball/v1/reSettleMatchEvent', { data }),

  //- 篮球取消结算事件
  basketBallCancelMatchEvent: (data: {
    id: number;
    matchId: number;
  }) => request<SattleDataAPI.basketballCancelMatchEventResType>(
    'post', '/basketball/v1/cancelMatchEvent', { data }),

  //- 足球开启二次结算
  open2ndSettlementStatus: (data: SattleDataAPI.MatchIDType) => request<SattleDataAPI.open2ndSettlementStatusResType>(
    'post', '/event/v1/open2ndSettlementStatus', { data }),

  //- 网球开启二次结算
  tenantOpen2ndSettlementStatus: (data: SattleDataAPI.MatchIDType) => request<SattleDataAPI.tenantOpen2ndSettlementStatusResType>(
    'post', '/event/v1/open2ndSettlementStatus', { data }),

  //- 足球确认二次结算
  confirm2ndSettlement: (data: SattleDataAPI.confirm2ndSettlementReqType) => request<SattleDataAPI.open2ndSettlementStatusResType>(
    'post', '/event/v1/confirm2ndSettlement', { data }),

  //- 网球确认二次结算
  tenantConfirm2ndSettlement: (data: SattleDataAPI.tenantConfirm2ndSettlementReqType) => request<SattleDataAPI.tenantConfirm2ndSettlementResType>(
    'post', '/tennis/v1/confirm2ndSettlement', { data }),

  //- 篮球开启二次结算
  basketballOpen2ndSettlementStatus: (data: SattleDataAPI.MatchIDType) => request<SattleDataAPI.basketballOpen2ndSettlementStatusResType>(
    'post', '/basketball/v1/open2ndSettlementStatus', { data }),
  //- 美式足球开启二次结算
  americanFootballOpen2ndSettlementStatus: (data: SattleDataAPI.MatchIDType) => request<SattleDataAPI.basketballOpen2ndSettlementStatusResType>(
    'post', '/americanFootball/v1/open2ndSettlementStatus', { data }),
  //- 排球开启二次结算
  volleyballOpen2ndSettlementStatus: (data: SattleDataAPI.MatchIDType) => request<SattleDataAPI.basketballOpen2ndSettlementStatusResType>(
    'post', '/volleyball/v1/open2ndSettlementStatus', { data }),
  //- 板球开启二次结算
  cricketOpen2ndSettlementStatus: (data: SattleDataAPI.MatchIDType) => request<SattleDataAPI.basketballOpen2ndSettlementStatusResType>(
    'post', '/cricket/v1/open2ndSettlementStatus', { data }),
  //- 曲棍球开启二次结算
  hockeyOpen2ndSettlementStatus: (data: SattleDataAPI.MatchIDType) => request<SattleDataAPI.basketballOpen2ndSettlementStatusResType>(
    'post', '/hockey/v1/open2ndSettlementStatus', { data }),
  //- 英式橄榄球开启二次结算
  rugbyOpen2ndSettlementStatus: (data: SattleDataAPI.MatchIDType) => request<SattleDataAPI.basketballOpen2ndSettlementStatusResType>(
    'post', '/rugby/v1/open2ndSettlementStatus', { data }),
  //- 斯诺克开启二次结算
  snookerOpen2ndSettlementStatus: (data: SattleDataAPI.MatchIDType) => request<SattleDataAPI.basketballOpen2ndSettlementStatusResType>(
    'post', '/snooker/v1/open2ndSettlementStatus', { data }),
  //-  棒球开启二次结算
  baseballOpen2ndSettlementStatus: (data: SattleDataAPI.MatchIDType) => request<SattleDataAPI.basketballOpen2ndSettlementStatusResType>(
    'post', '/baseball/v1/open2ndSettlementStatus', { data }),
  //- 格斗开启二次结算
  boxingOpen2ndSettlementStatus: (data: SattleDataAPI.MatchIDType) => request<SattleDataAPI.basketballOpen2ndSettlementStatusResType>(
    'post', '/boxing/v1/open2ndSettlementStatus', { data }),
  //- 羽毛球开启二次结算
  badmintonOpen2ndSettlementStatus: (data: SattleDataAPI.MatchIDType) => request<SattleDataAPI.basketballOpen2ndSettlementStatusResType>(
    'post', '/badminton/v1/open2ndSettlementStatus', { data }),

  //- 乒乓球开启二次结算
  pingPongOpen2ndSettlementStatus: (data: SattleDataAPI.MatchIDType) => request<SattleDataAPI.basketballOpen2ndSettlementStatusResType>(
    'post', '/pingPong/v1/open2ndSettlementStatus', { data }),

  //- 手球开启二次结算
  handballOpen2ndSettlementStatus: (data: SattleDataAPI.MatchIDType) => request<SattleDataAPI.basketballOpen2ndSettlementStatusResType>(
    'post', '/handball/v1/open2ndSettlementStatus', { data }),

  //- 冰球开启二次结算
  iceHockeyOpen2ndSettlementStatus: (data: SattleDataAPI.MatchIDType) => request<SattleDataAPI.basketballOpen2ndSettlementStatusResType>(
    'post', '/iceHockey/v1/open2ndSettlementStatus', { data }),

  //- 篮球确认二次结算
  basketballConfirm2ndSettlement: (data: SattleDataAPI.confirm2ndSettlementReqType) => request<SattleDataAPI.open2ndSettlementStatusResType>(
    'post', '/basketball/v1/confirm2ndSettlement', { data }),
  //- 美式足球确认二次结算
  americanFootballConfirm2ndSettlement: (data: SattleDataAPI.confirm2ndSettlementReqType) => request<SattleDataAPI.open2ndSettlementStatusResType>(
    'post', '/americanFootball/v1/confirm2ndSettlement', { data }),
  //- 排球确认二次结算
  volleyballConfirm2ndSettlement: (data: SattleDataAPI.confirm2ndSettlementReqType) => request<SattleDataAPI.open2ndSettlementStatusResType>(
    'post', '/volleyball/v1/confirm2ndSettlement', { data }),
  //- 板球确认二次结算
  cricketConfirm2ndSettlement: (data: SattleDataAPI.confirm2ndSettlementReqType) => request<SattleDataAPI.open2ndSettlementStatusResType>(
    'post', '/cricket/v1/confirm2ndSettlement', { data }),
  //- 曲棍球确认二次结算
  hockeyConfirm2ndSettlement: (data: SattleDataAPI.confirm2ndSettlementReqType) => request<SattleDataAPI.open2ndSettlementStatusResType>(
    'post', '/hockey/v1/confirm2ndSettlement', { data }),
  //- 橄榄球球确认二次结算
  rugbyConfirm2ndSettlement: (data: SattleDataAPI.confirm2ndSettlementReqType) => request<SattleDataAPI.open2ndSettlementStatusResType>(
    'post', '/rugby/v1/confirm2ndSettlement', { data }),
  //- 斯诺克确认二次结算
  snookerConfirm2ndSettlement: (data: SattleDataAPI.confirm2ndSettlementReqType) => request<SattleDataAPI.open2ndSettlementStatusResType>(
    'post', '/snooker/v1/confirm2ndSettlement', { data }),
  //- 棒球认二次结算
  baseballConfirm2ndSettlement: (data: SattleDataAPI.confirm2ndSettlementReqType) => request<SattleDataAPI.open2ndSettlementStatusResType>(
    'post', '/baseball/v1/confirm2ndSettlement', { data }),
  //- 格斗确认二次结算
  boxingConfirm2ndSettlement: (data: SattleDataAPI.confirm2ndSettlementReqType) => request<SattleDataAPI.open2ndSettlementStatusResType>(
    'post', '/boxing/v1/confirm2ndSettlement', { data }),
  //- 羽毛球确认二次结算
  badmintonConfirm2ndSettlement: (data: SattleDataAPI.confirm2ndSettlementReqType) => request<SattleDataAPI.open2ndSettlementStatusResType>(
    'post', '/badminton/v1/confirm2ndSettlement', { data }),

  //- 乒乓球确认二次结算
  pingPongConfirm2ndSettlement: (data: SattleDataAPI.confirm2ndSettlementReqType) => request<SattleDataAPI.open2ndSettlementStatusResType>(
    'post', '/pingPong/v1/confirm2ndSettlement', { data }),

  //- 手球确认重新结算
  handballConfirm2ndSettlement: (data: SattleDataAPI.confirm2ndSettlementReqType) => request<SattleDataAPI.open2ndSettlementStatusResType>(
    'post', '/handball/v1/confirm2ndSettlement', { data }),

  //- 冰球确认重新结算
  iceHockeyConfirm2ndSettlement: (data: SattleDataAPI.confirm2ndSettlementReqType) => request<SattleDataAPI.open2ndSettlementStatusResType>(
    'post', '/iceHockey/v1/confirm2ndSettlement', { data }),

  //- 足球盘口取消加时赛
  cancelFootballOverTimeOrder: (data: SattleDataAPI.cancelFootballPenaltyKickOrderReqParams) => request<SattleDataAPI.cancelFootballPenaltyKickOrderRes>(
    'post', '/event/v1/cancelFootballOverTimeOrder', { data }),
  //- 足球盘口取消点球
  cancelFootballPenaltyKickOrder: (data: SattleDataAPI.cancelFootballPenaltyKickOrderReqParams) => request<SattleDataAPI.cancelFootballPenaltyKickOrderRes>(
    'post', '/event/v1/cancelFootballPenaltyKickOrder', { data }),
  //- 篮球  + 美式足球修改赛制
  updateMatchPeriodType: (data: { matchId: number; periodType: number }) => request<SattleDataAPI.updateMatchPeriodType>(
    'post', '/match/v1/updateMatchPeriodType', { data }),
};
