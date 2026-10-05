import { http } from "@/utils/http";
import { searchFormType } from '@/views/operateManager/com/bettingCenter/util/types'
export const bettingCenter = {
  //-赛程中心列表
  bettingCenterList: (data: searchFormType) => http.request<any>("post", "/bet-center/list", { data }),
  // 赛程总结
  bettingCenterSummarize: (data: searchFormType) => http.request<any>("post", "/bet-center/betCenterStatisticV2", { data }),
  bettingCenterExport: (data: searchFormType) => http.request<any>("post", "/bet-center/listExport", { data }),
  betcenterRisk: (data: searchFormType) => http.request<any>("post", "/bet-center/risk", { data }),
  riskExport: (data: searchFormType) => http.request<any>("post", "/bet-center/riskExport", { data }),
  orderCancel: (data: {
    orderId: number;
  }) => http.request<any>("post", "/bet-center/cancel", { data }),
  //- 特殊结算
  getCurrentBet: (data: {
    orderId: string;
    queryType: number;
    pageSize: number;
    pageNum: number;
    export: boolean;
  }) => http.request<any>("post", "/bet-center/list", { data }),
  betSettle: (data: number[]) => http.request<BetOrderAPI.betCenterCancelResType>("post", "/bet-settle/settle", { data }),

  getTenantList: (data?: {
    category?: number;
  }) => http.request<any>("post", "/bet-center/getTenantList", { data }),

  queryTenantList: (data: {
    category: number;
  }) => http.request<any>("post", "/bet-center/queryTenant", { data }),
  //- 拒绝注单
  riskCancel: (data: { detailId: number; status: number, riskType: string }[]) => http.request<BetOrderAPI.betCenterCancelResType>("post", "/bet-center/risk/cancel", { data }),
  //- 确认注单
  riskConfirm: (data: { detailId: number; status: number }[]) => http.request<BetOrderAPI.betCenterCancelResType>("post", "/bet-center/risk/confirm", { data }),
  // 注单审核列表
  bettingAuditList: (data: searchFormType) => http.request<any>("post", "/bet-center/manualSettlePage", { data }),
  bettingAuditListExport: (data: searchFormType) => http.request<any>("post", "/bet-center/manualSettleExport", { data }),
  // 注单审核通过
  bettingAuditConfirm: (data: any) => http.request<any>("post", "/bet-center/manualConfirm", { data }),
  // 注单审核拒绝
  bettingAuditReject: (data: any) => http.request<any>("post", "/bet-center/manualReject", { data }),

  // 针对赛事编辑备注
  editOrderRemark: (data: { orderId: number, remark: string }) => http.request<any>("post", "/bet-center/betOrder/editRemark", { data }),
  //- 根据IP地址查询用户
  getUserByIp: (data: { ip: string, pageSize: number; pageNum: number }) => http.request<BetOrderAPI.getUserByIpResType>("post", "/bet-center/getUserByIp", { data }),

  getSettleHistory: (data: any) => http.request<any>("post", `/bet-order/record/settle/history/record/${data}`)



};
