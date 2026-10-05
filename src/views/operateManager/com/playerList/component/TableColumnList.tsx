import dayjs from 'dayjs';
import { hasAuth } from '@/router/utils';
import { CURRENCY_TYPE } from '../utils/map';

export const columns = (category: number): TableColumnList => {
  return [
    {
      type: 'selection',
      align: 'left'
    },
    {
      label: t('用户账号'),
      prop: 'userName',

      minWidth: 150
    },
    {
      label: t('商户名称'),
      prop: 'tenantName',
      minWidth: 150,
      formatter({ tenantName }) {
        return tenantName ?? '-';
      }
    },
    {
      label: t('商户编码'),
      slot: 'tenantCode',
      minWidth: 150
    },
    {
      label: t('结算币种'),
      prop: 'currency',
      minWidth: 150,
      formatter({ currency }) {
        return CURRENCY_TYPE[currency as keyof typeof CURRENCY_TYPE]
      }
    },
    {
      label: t('风控标签'),
      hide: !hasAuth('viewRiskLabel'.toUpperCase()),
      slot: 'riskControlLabel',
      width: 150
    },
    {
      label: t('属性标签'),
      hide: !hasAuth('viewAttributeLabel'.toUpperCase()),
      slot: 'attributeLabel',
      width: 150
    },
    {
      label: t('赔率分组'),
      prop: 'userOddGroupLevel',
      width: 150
    },
    {
      label: t('限额等级'),
      hide: !hasAuth('viewLimitLevel'.toUpperCase()),
      prop: 'limitLevel',
      minWidth: 150
    },
    {
      label: t('账号是否冻结'),
      prop: 'isFreeze',
      formatter({ isFreeze }) {
        return isFreeze === 1 ? t('冻结') : t('正常');
      },
      minWidth: 150
    },
    {
      label: t('特殊限额'),
      minWidth: 150,
      hide: !hasAuth('viewSpecialLimit'.toUpperCase()),
      formatter: ({
        maxWinAmountLimit,
        productAmountTotalLimit,
        seriesSingleDayCumulativeCompensationLimit,
        singleEventAccumulatedCompensationLimit,
        percentageLimit
      }: {
        maxWinAmountLimit: number;
        productAmountTotalLimit: number;
        seriesSingleDayCumulativeCompensationLimit: number;
        singleEventAccumulatedCompensationLimit: number;
        percentageLimit: string;
      }) => {
        if (
          maxWinAmountLimit ||
          productAmountTotalLimit ||
          seriesSingleDayCumulativeCompensationLimit ||
          singleEventAccumulatedCompensationLimit
        )
          return t('例外限额');
        else if (percentageLimit === null) {
          return t('无');
        } else {
          return '百分比限额: ' + percentageLimit + '%';
        }
      }
    },
    {
      label: t('注册日期'),
      prop: 'createdAt',
      formatter({ createdAt }) {
        return dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss');
      },
      minWidth: 250
    },
    {
      label: t('修改时间'),
      prop: 'updatedAt',
      prop: 'updatedAt',
      formatter({ updatedAt }: { updatedAt: string }) {
        return dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    {
      label: t('投注延时'),
      prop: 'betDelay',
      slot: 'betDelay',
      hide: !hasAuth('viewBetDelay'.toUpperCase()),
      formatter({ betDelay, betDelayDj }) {
        let str = '';
        if (category === 0) {
          str =
            (betDelay ? betDelay + 's' : '-') +
            ' , ' +
            (betDelayDj ? betDelayDj + 's' : '-');
        } else {
          str = betDelayDj ? betDelayDj + 's' : '-';
        }
        return <span class="text-sm">{str}</span>;
      },
      minWidth: 250
    },
    {
      label: t('备注'),
      prop: 'remark',
      formatter({ remark }) {
        return remark ?? '-';
      },
      minWidth: 150
    },
    {
      label: t('操作'),
      fixed: 'right',
      minWidth: 150,
      slot: 'operation'
    }
  ];
};

export const recordColumns: TableColumnList = [
  {
    label: t('标签名称'),
    prop: 'labelName'
  },
  {
    label: t('动作'),
    prop: 'opt'
  },
  {
    label: t('操作人'),
    prop: 'createdBy'
  },
  {
    label: t('修改时间'),
    prop: 'updatedAt',
    formatter({ updatedAt }: { updatedAt: string }) {
      return dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss');
    }
  }

];

export const userColumns: TableColumnList = [
  {
    label: t('用户ID'),
    prop: 'userid'
  },
  {
    label: t('风控标签'),
    prop: 'riskControlLabel'
  },
  {
    label: t('属性标签'),
    prop: 'attributeLabel'
  }
];

export const specialLimitColumns: TableColumnList = [
  {
    label: t('限额等级'),
    prop: 'name'
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
    label: t('单场赛事限额'),
    prop: 'singleEventLimit',
    formatter({ singleEventLimit }) {
      return singleEventLimit ? singleEventLimit : '-';
    }
  },
  {
    label: t('串关限额'),
    prop: 'seriesSingleDayLimit',
    formatter({ seriesSingleDayLimit }) {
      return seriesSingleDayLimit ? seriesSingleDayLimit : '-';
    }
  },
  // {
  //   label: t('百分比限额'),
  //   prop: 'percentageLimit',
  //   formatter({ percentageLimit }) {
  //     return percentageLimit !== '' ? percentageLimit + '%' : '-';
  //   }
  // },
  {
    label: t('动作'),
    prop: 'updateType',
    formatter({ updateType }) {
      if (updateType == 1) return t('禁用');
      else if (updateType == 2) return t('修改');
      else if (updateType == 3) return t('启用');
    }
  },
  {
    label: t('操作人'),
    prop: 'createdBy'
  },
  {
    label: t('修改时间'),
    prop: 'updatedAt',
    minWidth: 180,
    formatter({ updatedAt }: { updatedAt: string }) {
      return dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss');
    }
  }
];
//- 特殊限额
export const specialLimitColumns1: TableColumnList = [
  {
    label: t('特殊限额'),
    prop: 'name'
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
    label: t('单场赛事限额'),
    prop: 'singleEventLimit',
    formatter({ singleEventLimit }) {
      return singleEventLimit ? singleEventLimit : '-';
    }
  },
  {
    label: t('串关限额'),
    prop: 'seriesSingleDayLimit',
    formatter({ seriesSingleDayLimit }) {
      return seriesSingleDayLimit ? seriesSingleDayLimit : '-';
    }
  },
  {
    label: t('百分比限额'),
    prop: 'percentageLimit',
    formatter({ percentageLimit }) {
      return percentageLimit ? percentageLimit + '%' : '-';
    }
  },
  {
    label: t('动作'),
    prop: 'updateType',
    formatter({ updateType }) {
      if (updateType == 1) return t('禁用');
      else if (updateType == 2) return t('修改');
      else if (updateType == 3) return t('启用');
    }
  },
  {
    label: t('操作人'),
    prop: 'createdBy'
  },
  {
    label: t('修改时间'),
    prop: 'updatedAt',
    minWidth: 180,
    formatter({ updatedAt }: { updatedAt: string }) {
      return dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss');
    }
  }
];
export const oddsGroupColumns: TableColumnList = [
  {
    label: t('等级'),
    prop: 'name',
  },
  {
    label: t('操作人'),
    prop: 'createdBy'
  },
  {
    label: t('修改时间'),
    prop: 'updatedAt',
    formatter({ updatedAt }: { updatedAt: string }) {
      return dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss');
    }
  }
];
