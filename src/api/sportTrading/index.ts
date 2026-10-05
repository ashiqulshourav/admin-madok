import { http } from "@/utils/http";

export const sportTradingData = {
  //- 早盘赛事列表
  getMorningSetMatchList: (data: sportTradingDataAPI.MorningSetMatchListParams) => http.request<sportTradingDataAPI.getMorningSetMatchListRes>("post", '/operateHandicap/v1/getMorningSetMatchList', { data }),
  //- 滚球赛事列表
  getRollingMatchList: (data: sportTradingDataAPI.MorningSetMatchListParams) => http.request<sportTradingDataAPI.getMorningSetMatchListRes>("post", '/operateHandicap/v1/getRollingMatchList', { data }),
  //- 赛事盘口列表获取
  getHandicapItems: (data: { matchId: number }, noNprogress?: boolean) => http.request<sportTradingDataAPI.getHandicapItemsRes>("post", "/operateHandicap/v1/getHandicapItems", { data }, { noNprogress }),
  //- 盘口状态更新
  updateHandicapStatus: (data: sportTradingDataAPI.updateHandicapStatusParams) => http.request<sportTradingDataAPI.updateHandicapStatus>("post", "/operateHandicap/v1/updateHandicapStatus", { data }),
  /* 
  {"betItemsIds":["123123","2123123","3123123"],"matchId":123123,"operateMenu":"操作菜单-记录日志用"}
   */
  //- 重置赔率（赔率清零）
  resetHandicapOdds: (data: sportTradingDataAPI.resetHandicapOddsParams) => http.request<sportTradingDataAPI.resetHandicapOddsRes>("post", "/operateHandicap/v1/resetHandicapOdds", { data }),
  //-玩法分类状态更新
  updateGroupHandicapStatus: (data: sportTradingDataAPI.updateHandicapStatusParams) => http.request<sportTradingDataAPI.updateHandicapStatus>("post", "/operateHandicap/v1/updateGroupHandicapStatus", { data }),

  //-  赛事状态更新
  updateMatchHandicapStatus: (data: sportTradingDataAPI.updateHandicapStatusParams) => http.request<sportTradingDataAPI.updateHandicapOddsParamsRes>("post", "/operateHandicap/v1/updateMatchHandicapStatus", { data }),

  //- 盘口赔率更新
  updateHandicapOdds: (data: sportTradingDataAPI.updateHandicapOddsParams) => http.request<sportTradingDataAPI.updateHandicapOddsParamsRes>("post", "/operateHandicap/v1/updateHandicapOdds", { data }),
  //- 告警赛事列表
  getAlarmMatchList: (data: sportTradingDataAPI.MorningSetMatchListParams) => http.request<sportTradingDataAPI.getAlarmMatchListRes>("post", "/operateHandicap/v1/getAlarmMatchList", { data }),
  //- 查询告警配置
  getOperateHandicapConfig: () => http.request<sportTradingDataAPI.getOperateHandicapConfigRes>("post", "/operateHandicap/v1/getOperateHandicapConfig", {}),
  //- 更新告警配置
  updateOperateHandicapConfig: (data: { alarmValue: number; alarmPercent: number; }) => http.request<sportTradingDataAPI.updateOperateHandicapConfigRes>("post", "/operateHandicap/v1/updateOperateHandicapConfig", { data }),
  //- 告警赛事轮询接口
  loopAlarmMatchList: (data: sportTradingDataAPI.loopAlarmMatchListParams) => http.request<sportTradingDataAPI.getAlarmMatchListRes>("post", "/operateHandicap/v1/loopAlarmMatchList", { data }, {
    noNprogress: true
  }),
};
