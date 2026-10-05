

export type searchFormType = {
  pageSize?: number | string;
  pageNum?: number | string;
  sportId: string[] | number[];
  orderStatus:string[] | number[];
  userIdOrName: string;
  timeStart?: number | string;
  timeEnd?: number | string;
  orderId: string;
  leagueId: string;
  matchId: string;
  awayTeamName?: string;
  homeTeamName?: string;
  seriesType: number|string;
  isInplay?: number | string;
  category: string | number;
  [key: string]: any;
  timeType?: number;
  leagueName: string;
  tenantIds: any;
  minBetAmount: number | string;
  maxBetAmount: number | string;
  minProfitAmount: number | string;
  maxProfitAmount: number | string;
  riskControlLabelList: number[],
  venueType: number;
  currency:number|string;
}

export enum betStatus {
  onReverse = 1,
  onConfirm = 2,
  reserveFail = 3,
  reverseCancel = 4,
  betFail = 5,
  unsettlementBet = 6,
  settlementBet = 7,
  waitApprove = 8,
  betInvalid = 9,
}
export const betStatusMap = {
  [betStatus.onReverse]: t('预约中'),
  [betStatus.onConfirm]: t('确认中'),
  [betStatus.reserveFail]: t('预约失败'),
  [betStatus.reverseCancel]: t('预约取消'),
  [betStatus.betFail]: t('投注失败'),
  [betStatus.unsettlementBet]: t('未结算'),
  [betStatus.settlementBet]: t('已结算'),
  [betStatus.waitApprove]: t('待审核'),
  [betStatus.betInvalid]: t('注单无效'),
}

export const seriesTypeList = [
  { label: t('单关'), value: 1 },
  { label: t('单式串关'), value: 2 },
  { label: t('复式串关'), value: 3 }
]

