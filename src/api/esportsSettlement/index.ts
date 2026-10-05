import { http } from "@/utils/http";

export const esportsSettlement = {

  getESportMatchList: (data: EsportsSettlementAPI.getESportMatchListReqParams) => http.request<EsportsSettlementAPI.getESportMatchListResType>("post", "/eSport/v1/getESportMatchList", { data }),
  //- 冠军事件列表
  getChampionSettlementList: (data: EsportsSettlementAPI.getESportMatchListReqParams) => http.request<EsportsSettlementAPI.getESportMatchListResType>("post", "/match/v1/getChampionSettlementList", { data }),

  lockESportHandicap: (data: { matchId: number }) => http.request<EsportsSettlementAPI.lockESportHandicapResType>("post", "/eSport/v1/lockESportHandicap", { data }),

  unLockESportHandicap: (data: { matchId: number }) => http.request<EsportsSettlementAPI.unLockESportHandicapResType>("post", "/eSport/v1/unLockESportHandicap", { data }),

  getESportMatchById: (data: { matchId: number }) => http.request<EsportsSettlementAPI.getESportMatchByIdResType>("post", "/eSport/v1/getESportMatchById", { data }),

  //- 获取冠军赛事信息列表
  getChampionEvents: (data: { matchId: number }) => http.request<EsportsSettlementAPI.getChampionEventsResType>("post", "/championSettle/v1/getChampionEvents", { data }),
  //- 获取足球其他玩法事件列表
  getSpecialSettlementEvents: (data: { matchId: number }) => http.request<EsportsSettlementAPI.getChampionEventsResType>("post", "/specialSettle/v1/getSpecialSettlementEvents", { data }),

  manualSettleESportHandicap: (data: {
    matchId: number;
    betResultItems: {
      betItemId: number;
      betResult: number;
      handicap: string;
      kindsCode: string;
    }[]
  }) => http.request<EsportsSettlementAPI.manualSettleESportHandicapResType>("post", "/eSport/v1/manualSettleESportHandicap", { data }),
  //- 冠军玩法结算
  manualSettleChampionHandicap: (data: {
    matchId: number;
    betItemsName: string;
    betResultItems: {
      betItemId: number;
      betResult: number;
      handicap: string;
      kindsCode: string;
      betItemsName: string;
    }[]
  }) => http.request<EsportsSettlementAPI.manualSettleESportHandicapResType>("post", "/championSettle/v1/manualSettleChampionHandicap", { data }),

  //- 足球特殊玩法结算
  manualSettleSpecial: (data: {
    matchId: number;
    betItemsName: string;
    betResultItems: {
      betItemId: number;
      betResult: number;
      handicap: string;
      kindsCode: string;
      betItemsName: string;
    }[]
  }) => http.request<EsportsSettlementAPI.manualSettleESportHandicapResType>("post", "/specialSettle/v1/manualSettleSpecial", { data }),

  //- 重新结算(二次结算)
  eSportReSettlement: (data: {
    matchId: number;
    betResultItems: {
      betItemId: number;
      betResult: number;
      handicap: string;
      kindsCode: string;
      sourceBetItemsMid: number;
    }[]
  }) => http.request<EsportsSettlementAPI.manualSettleESportHandicapResType>("post", "/eSport/v1/reSettlement", { data }),
  //- 冠军重新结算
  reSettleChampionHandicap: (data: {
    matchId: number;
    betResultItems: {
      betItemId: number;
      betResult: number;
      handicap: string;
      kindsCode: string;
      sourceBetItemsMid: number;
    }[]
  }) => http.request<EsportsSettlementAPI.manualSettleESportHandicapResType>("post", "/championSettle/v1/reSettleChampionHandicap", { data }),
  //- 足球重新结算
  reSettleSpecial: (data: {
    matchId: number;
    betResultItems: {
      betItemId: number;
      betResult: number;
      handicap: string;
      kindsCode: string;
      sourceBetItemsMid: number;
    }[]
  }) => http.request<EsportsSettlementAPI.manualSettleESportHandicapResType>("post", "/specialSettle/v1/reSettleSpecial", { data }),
};
