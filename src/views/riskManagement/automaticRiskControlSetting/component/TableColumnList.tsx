import { t } from '@/plugins/i18n';

export const autoLabelColumns: TableColumnList = [
  {
    label: t('条件名称'),
    slot: 'conditionName'
  },
  {
    label: t('观察期限'),
    slot: 'observationPeriod'
  },
  {
    label: t('注单数量'),
    slot: 'numberOfBets'
  },

  {
    label: t('用户输赢金额'),
    slot: 'betAmount'
  },
  {
    label: t('用户输赢率'),
    slot: 'winLossRate'
  },
  {
    label: t('自动用户等级限额'),
    slot: 'userLevelQuota'
  },
  {
    label: t('自动风控标签名称'),
    slot: 'riskControlLabelName'
  }
];

export const orderPlacementColumns: TableColumnList = [
  {
    label: t('联赛等级'),
    slot: 'leagueGrades'
  },
  {
    label: t('事件源'),
    slot: 'eventSource'
  },
  {
    label: t('事件名称'),
    slot: 'eventName'
  },
  {
    label: t('投注前'),
    slot: 'beforeBetting'
  },
  {
    label: t('投注后'),
    slot: 'afterBetting'
  },
  {
    label: t('投注额'),
    slot: 'betAmount'
  }
];

export const rejectOrderColumns: TableColumnList = [
  {
    label: t('联赛等级'),
    slot: 'leagueGrades'
  },
  {
    label: t('事件源'),
    slot: 'eventSource'
  },
  {
    label: t('事件名称'),
    slot: 'eventName'
  },
  {
    label: t('投注前'),
    slot: 'beforeBetting'
  },
  {
    label: t('投注后'),
    slot: 'afterBetting'
  }
];

export const autoFreezeColumns: TableColumnList = [
  {
    label: t('联赛等级'),
    slot: 'leagueGrades'
  },
  {
    label: t('启用禁用状态'),
    slot: 'isDisable'
  },
  {
    label: t('事件源'),
    slot: 'sourceName'
  },
  {
    label: t('事件名称'),
    slot: 'eventName'
  },
  {
    label: t('投注前'),
    slot: 'betBeforeTime'
  },
  {
    label: t('投注后'),
    slot: 'betAfterTime'
  },
  {
    label: t('投注金额区间'),
    slot: 'betAmountRange'
  }
];


export const dangerousUserWarningColumns: TableColumnList = [
  {
    label: t('告警条件'),
    slot: 'warningCondition'
  },
  {
    label: t('单日注单数'),
    slot: 'dailyBetCount'
  },
  {
    label: t('单日拒单数'),
    slot: 'dailyRefuse'
  },
  {
    label: t('危险事件前3秒单日注单数'),
    slot: 'beforeThreeSecCount'
  },
  {
    label: t('单日投注额'),
    slot: 'dailyBetAmount'
  },
  {
    label: t('单日盈利额'),
    slot: 'dailyProfitAmount'
  },
  {
    label: t('单日盈利率'),
    slot: 'dailyProfitRate'
  }
];
