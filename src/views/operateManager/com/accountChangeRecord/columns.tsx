import dayjs from 'dayjs';
import { addThousandSeparator } from '@/utils/formatNumber';

export const accountChangeTypeCodeList = [
  { label: t('系统自动结算'),label2:'', value: 30, icon: '' },
  { label: t('取消注单'), label2:'',value: 21, icon: '' },
  { label: t('投注'),label2:'扣钱', value: 20, icon: 'deduct' },
  { label: t('手动结算'),label2:'扣钱', value: 90, icon: 'deduct' },
  { label: t('二次结算'), label2:'扣钱',value: 40, icon: 'deduct' },
  { label: t('结算返还'), label2:'加钱',value: 31, icon: 'add' },
  { label: t('手动结算'),label2:'加钱', value: 91, icon: 'add' },
  { label: t('二次结算'), label2:'加钱',value: 41, icon: 'add' },
  { label: t('钱包上分'),label2:'转入', value: 11, icon: 'transfer' },
  { label: t('钱包下分'),label2:'转出', value: 10, icon: 'transfer' }
];
 
export const columns: TableColumnList = [
  {
    label: t('序号'),
    type: 'index',
    minWidth: 55
  },
  {
    label: t('注单号'),
    prop: 'identifier',
    minWidth: 200,
    formatter: ({ identifier }) => {
      if (identifier.indexOf('_') > 0 && identifier?.split('_')?.length) {
        return identifier?.split('_')[0];
      }
      return '-';
    }
  },
  {
    label: t('流水ID'),
    prop: 'id',
    minWidth: 100,
    formatter: ({ id }) => {
      return 'zb' + id;
    }
  },
  {
    label: t('帐变类型'),
    slot: 'type',
  },
  {
    label: t('交易类型'),
    minWidth: 180,
    prop: 'type',
    formatter: ({ type }) => accountChangeTypeCodeList.find(item => item.value == type)?.label
  },
  {
    label: t('账变金额'),
    prop: 'transAmount',
    minWidth: 150,
    formatter: ({ transAmount }) =>
      transAmount ? addThousandSeparator(transAmount.toFixed(2)) : '-'
  },
  {
    label: t('账变前金额'),
    prop: 'prevBalance',
    minWidth: 150,
    formatter: ({ prevBalance }) =>
      prevBalance ? addThousandSeparator(prevBalance.toFixed(2)) : '-'
  },
  {
    label: t('账变后金额'),
    prop: 'balance',
    minWidth: 150,
    formatter: ({ balance }) =>
      balance ? addThousandSeparator(balance.toFixed(2)) : '-'
  },
  {
    label: t('账变时间'),
    prop: 'createTime',
    minWidth: 200,
    formatter: ({ updatedAt }) => dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss')
  },
  // {
  //   label: t("操作人"),
  //   prop: "operatorId",
  //   minWidth: 200,
  //   formatter: ({ operatorId }) => operatorId===0?t('系统'):operatorId===1?'SFERSF':operatorId
  // },
  {
    label: t('备注'),
    minWidth: 100,
    prop: 'remark'
  }
];
