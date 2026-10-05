import { t } from '@/plugins/i18n';
import { addThousandSeparator } from '@/utils/formatNumber';
import dayjs from 'dayjs';

export const columns: TableColumnList = [
  {
    label: t('序号'),
    prop: 'index',
    align: 'left',
    className: 'mw-50'
  },
  {
    label: t('用户信息'),
    slot: 'userMessage',
    minWidth: 100,
    align: 'left',
    className: 'mw-230'
  },
  {
    label: t('注单信息'),
    slot: 'betMessage',
    minWidth: 100,
    align: 'left',
    className: 'getParent'
  },
  {
    label: t('赛事信息'),
    slot: 'matchMessage',
    minWidth: 200,
    align: 'left',
    className: 'getParent'
  },

  {
    label: t('投注项'),
    slot: 'betItem',
    minWidth: 200,
    align: 'left',
    className: 'betItem getParent'
  },

  {
    label: t('赔率'),
    slot: 'odd',
    minWidth: 100,
    align: 'center',
    className: 'getParent'
  },
  {
    label: t('审核状态'),
    slot: 'riskStatus',
    align: 'center',
    className: 'getParent'
  },
  {
    label: t('投注额 RMB'),
    prop: 'productAmountTotalOfRmb',
    minWidth: 100,
    align: 'center',
    formatter: ({ productAmountTotalOfRmb }) =>
      addThousandSeparator(productAmountTotalOfRmb.toFixed(2)), // (productAmountTotal ? productAmountTotal.toFixed(2) : 0)
    className: 'mw-100'
  },
  {
    label: t('用户输赢 RMB'),
    slot: 'profitAmountOfRmb',
    minWidth: 100,
    align: 'center',
    formatter: ({ profitAmountOfRmb }) =>
      addThousandSeparator(profitAmountOfRmb.toFixed(2)),
    className: 'mw-100'
  },
  {
    label: t('投注额'),
    prop: 'productAmountTotal',
    minWidth: 100,
    align: 'center',
    formatter: ({ productAmountTotal, currency }) =>
      addThousandSeparator(productAmountTotal.toFixed(2)) + ' ' + currency, // (productAmountTotal ? productAmountTotal.toFixed(2) : 0)
    className: 'mw-100'
  },
  {
    label: t('用户输赢'),
    slot: 'profitAmount',
    minWidth: 100,
    align: 'center',
    formatter: ({ profitAmount, currency }) =>
      addThousandSeparator(profitAmount.toFixed(2)) + ' ' + currency,
    className: 'mw-100'
  },
  {
    label: t('通知时间'),
    prop: 'riskTime',
    minWidth: 70,
    align: 'center',
    formatter: ({ riskTime }) =>
      riskTime && dayjs(riskTime).format('YYYY-MM-DD HH:mm:ss')
  },
  {
    label: t('操作时间'),
    prop: 'updateTime',
    minWidth: 100,
    align: 'center',
     formatter: ({ updateTime }) =>
      updateTime && dayjs(updateTime).format('YYYY-MM-DD HH:mm:ss')
  },
  {
    label: t('操作&操作人'),
    slot: 'operation',
    align: 'center',
    minWidth: 100,
    className: 'getParent'
  },
  {
    label: t('备注'),
    slot: 'remark',
    align: 'center',
    minWidth: 100,
    className: 'getParent'
  }
];
