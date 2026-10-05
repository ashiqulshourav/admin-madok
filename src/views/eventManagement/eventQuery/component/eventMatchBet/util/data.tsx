import { BET_RESULT_TYPE_MAP } from '@/utils/formatMatch';

export enum betStatus {
  all = 1,
  PendingApprove = 2,
  unsettlementBet = 3,
  settlementBet = 4,
  betInvalid = 6,
  betFail = 7,
  eventAbnormal = 8,
  riskReject = 9,
  reserveFail = 10,
  onReverse = 11,
  reverseCancel = 12
}

export const betStatusMap = {
  [betStatus.all]: t('全部'),
  [betStatus.PendingApprove]: t('待审核'),
  [betStatus.unsettlementBet]: t('未结算'),
  [betStatus.settlementBet]: t('已结算'),
  [betStatus.PendingApprove]: t('待审核'),
  [betStatus.betInvalid]: t('注单无效'),
  [betStatus.betFail]: t('投注失败'),
  [betStatus.eventAbnormal]: t('赛事异常'),
  [betStatus.riskReject]: t('风控拒单'),
  [betStatus.reserveFail]: t('预约失败'),
  [betStatus.onReverse]: t('预约中'),
  [betStatus.reverseCancel]: t('预约取消')
};

export const getOddStatus = (betResult: number, riskSt: number) => {
  if (riskSt === riskStatus.reject || riskSt === riskStatus.autoReject) {
    return '无效注单';
  } else if (betResult === 24 && riskSt == riskStatus.autoApprove) {
    return '盘口取消';
  } else {
    return (
      BET_RESULT_TYPE_MAP[betResult as keyof typeof BET_RESULT_TYPE_MAP] || ''
    );
  }
};

export enum riskStatus {
  rejectBetting = 2,
  autoApprove = 103,
  approve = 104,
  reject = 204,
  autoReject = 203
}

export const getStatus = (
  status: number,
  billStatus: number,
  betResultArr: number[],
  isReserve: number,
  riskStatusArr?: number[],
  isSpecialSettle?: number
) => {
  let obj = { status: -1, bgColor: '' };
  if (isSpecialSettle === 1) {
    // 特殊结算也算已结算
    obj = { status: betStatus.settlementBet, bgColor: '#40A9FF' };
  } else if (betResultArr?.includes(22)) {
    //预约取消
    obj = { status: betStatus.reverseCancel, bgColor: '#F57582' };
  } else if (riskStatusArr?.includes(riskStatus.rejectBetting)) {
    //待审核
    obj = { status: betStatus.PendingApprove, bgColor: '#F57582' };
  } else if (
    betResultArr?.includes(61) &&
    (riskStatusArr?.includes(riskStatus.reject) ||
      riskStatusArr?.includes(riskStatus.autoReject))
  ) {
    // 封控拒单
    obj = { status: betStatus.riskReject, bgColor: '#F88D48' };
  } else if (
    status == 2 &&
    billStatus === 1 &&
    (betResultArr?.includes(22) || betResultArr?.includes(23))
  ) {
    // 注单无效
    obj = { status: betStatus.betInvalid, bgColor: '#E54752' };
  } else if (
    riskStatusArr?.includes(riskStatus.autoApprove) &&
    betResultArr.includes(24)
  ) {
    // 注单无效
    obj = { status: betStatus.betInvalid, bgColor: '#E54752' };
  } else if (status === 2 && billStatus === 1 && betResultArr?.includes(21)) {
    // 预约失败
    obj = { status: betStatus.reserveFail, bgColor: '#F57582' };
  } else if (status === 0 && billStatus === 0) {
    // 未结算
    if (isReserve === 1) {
      // 预约中
      obj = { status: betStatus.onReverse, bgColor: '#F57582' };
    } else {
      obj = { status: betStatus.unsettlementBet, bgColor: '#FFC53D' };
    }
  } else if (status === 1 && billStatus === 1) {
    // 已结算
    obj = { status: betStatus.settlementBet, bgColor: '#40A9FF' };
  } else if (status === 3) {
    // 待确认
    obj = { status: betStatus.PendingApprove, bgColor: '#FFC53D' };
  } else if (status === 4) {
    // 投注失败
    obj = { status: betStatus.betFail, bgColor: '#F57582' };
  } else if (status === 5) {
    // 赛事异常
    obj = { status: betStatus.eventAbnormal, bgColor: '#F88D48' };
  }
  return obj;
};
