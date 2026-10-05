import { t } from '@/plugins/i18n';
import { h } from 'vue';
import { ElTooltip, ElIcon } from 'element-plus';
import { InfoFilled } from '@element-plus/icons-vue';
import dayjs from 'dayjs'

const addTooltip = (labelText: string, tooltipContent: string) => {
  return h('div', { class: 'flex items-center justify-center' }, [
    h('span', labelText),
    h(ElTooltip,
      {
        content: tooltipContent,
        placement: 'top',
      }, {
      default: () => h(ElIcon, { class: 'ml-1 cursor-pointer' }, [
        h(InfoFilled)
      ])
    })
  ]);
};

export const columns: TableColumnList = [
  {
    label: t('用户限额等级'),
    prop: 'levelLimit',
  },
  {
    label: t('单注投注限额'),
    slot: 'productAmountTotalLimit'
  },
  {
    label: t('单注赔付限额'),
    slot: 'maxWinAmountLimit'
  },
  {
    label: addTooltip(t('赛事限额'), t('单场(早盘+滚球)，累计赔付')),
    slot: 'userSingleGamePay',
    width: 150
  },
  {
    label: addTooltip(t('单关限額'), t('单日（早盘＋滚球），累计赔付')),
    slot: 'singleMatchPay'
  },
  {
    label: addTooltip(t('串关限额'), t('单日（早盘＋滚球），累计赔付')),
    slot: 'bunchMatchPay',
    width: 150
  },
  {
    label: addTooltip(t('冠军限額'), t('单日累计赔付')),
    slot: 'championDailyPay'
  }
]
export const recordColumns: TableColumnList = [
  {
    label: t('用户限额等级'),
    prop: 'levelLimit'
  },
  {
    label: t('单注投注限额'),
    prop: 'productAmountTotalLimit',
    formatter({ productAmountTotalLimit }) {
      return productAmountTotalLimit ? productAmountTotalLimit : '-';
    }
  },
  {
    label: t('单注赔付限额'),
    prop: 'maxWinAmountLimit',
    formatter({ maxWinAmountLimit }) {
      return maxWinAmountLimit ? maxWinAmountLimit : '-';
    }
  },
  {
    label: t('赛事限额'),
    prop: 'userSingleGamePay',
    formatter({ userSingleGamePay }) {
      return userSingleGamePay ? userSingleGamePay : '-';
    }
  },
  {
    label: t('单关限额'),
    prop: 'singleMatchPay',
    formatter({ singleMatchPay }) {
      return singleMatchPay ? singleMatchPay : '-';
    }
  },
  {
    label: t('串关限额'),
    prop: 'bunchMatchPay',
    formatter({ bunchMatchPay }) {
      return bunchMatchPay ? bunchMatchPay : '-';
    }
  },
  {
    label: t('冠军限额'),
    prop: 'championDailyPay',
    formatter({ championDailyPay }) {
      return championDailyPay ? championDailyPay : '-';
    }
  },

  {
    label: t('动作'),
    prop: 'operationType',
    formatter({ operationType }) {
      if (operationType == 1) return t('增加');
      else if (operationType == 2) return t('修改');
      else if (operationType == 3) return t('删除');
    }
  },
  {
    label: t('操作人'),
    prop: 'operator'
  },
  {
    label: t('时间'),
    prop: 'createdAt',
    minWidth: 180,
    formatter({ createdAt }: { createdAt: string }) {
      return dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss');
    }
  }
];