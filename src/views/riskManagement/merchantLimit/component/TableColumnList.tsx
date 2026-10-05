import { t } from '@/plugins/i18n';

export const columns: TableColumnList = [
  {
    label: t('商户等级'),
    prop: 'levelLimit'
  },
  {
    label: t('单日累计赔付限额'),
    slot: 'productAmountTotalLimit'
  },
  {
    label: t('单场赛事（早盘）累计赔付限额'),
    slot: 'maxWinAmountLimit'
  },
  {
    label: t('单场赛事（滚球）累计赔付限额'),
    slot: 'userSingleGamePay'
  },
  {
    label: t('冠军单日累计赔付限额'),
    slot: 'singleMatchPay'
  },
  {
    label: t('用户单关单日累计赔付限额'),
    slot: 'bunchMatchPay'
  },
  {
    label: t('用户单场赛事（早盘）累计赔付限额'),
    slot: 'championDailyPay'
  },
  {
    label: t('用户单场赛事（滚球）累计赔付限额'),
    slot: 'championDailyPay1'
  },
  {
    label: t('用户串关单日累计赔付限额'),
    slot: 'championDailyPay2'
  },
  {
    label: t('用户冠军单日累计赔付限额'),
    slot: 'championDailyPay2'
  },
];
