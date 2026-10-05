export type searchFormType = {
  pageSize?: number | string;
  pageNum?: number | string;
  sportId: string;
  userIdOrName: string;
  createTimeStart: number | string;
  createTimeEnd: number | string;
  orderId: string;
  leagueId: string;
  matchId: string;
  seriesType: number | string;
  category: string | number;
  [key: string]: any;
  tenantIds: any;
  minBetAmount: number | string;
  maxBetAmount: number | string;
  riskStatus: number | string;
  currency: number | string;
};

export enum riskStatus {
  rejectBetting = 2,
  approve = 104,
  reject = 204, //
  autoReject = 203, //
  preReject = 206 //提前划单
}
export const riskStatusMap = {
  [riskStatus.rejectBetting]: t('待审核'),
  [riskStatus.approve]: t('手动通过'),
  [riskStatus.reject]: t('手动划单'),
  [riskStatus.autoReject]: t('自动划单'),
  [riskStatus.preReject]: t('提前划单')
};
