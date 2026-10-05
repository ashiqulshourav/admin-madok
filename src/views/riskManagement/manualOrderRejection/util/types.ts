
export type searchFormType = {
  pageSize?: number | string;
  pageNum?: number | string;
  sportId: string;
  userIdOrName: string;
  timeStart: number | string;
  timeEnd: number | string;
  orderId: string;
  leagueId: string;
  matchId: string;
  awayTeamName: string;
  homeTeamName: string;
  seriesType: number | string;
  status: any;
  isInplay: number | string;
  category: string | number;
  [key: string]: any;
  timeType: number;
  leagueName: string;
  tenantIds: any;
  queryType: number | string;
  currency: number | string;
  operator: string | number;
}

export enum betStatus {
  all = 1,
  confirm = 2,
  unsettlementBet = 3,
  settlementBet = 4,
  PendingApprove = 5,
  betInvalid = 6,
  betFail = 7,
  eventAbnormal = 8,
  reserveFail = 9,
}
export const betStatusMap = {
  [betStatus.all]: t('全部'),
  [betStatus.confirm]: t('确认中'),
  [betStatus.unsettlementBet]: '未结算',
  [betStatus.settlementBet]: t('已结算'),
  [betStatus.PendingApprove]: t('待审核'),
  [betStatus.betInvalid]: t('注单无效'),
  [betStatus.betFail]: t('投注失败'),
  [betStatus.eventAbnormal]: t('赛事异常'),
  [betStatus.reserveFail]: t('预约失败'),
}



export const rejectReasonMap = {
 'bet_item_disable': t('盘口封盘'),
 'bet_item_lock': t('盘口锁盘'),
 'bet_item_settle': t('已结算'),
 'bet_item_notfound': t('无此盘口'),
  'bet_item_notshow': t('盘口不显示'),
 // 'bet_item_undefined': t('未定义'),
  // 'bet_item_ensable': t('盘口正常'),
}
