import dayjs from 'dayjs';

export const columns: TableColumnList = [
  {
    label: t('序号'),
    type: 'index',
    minWidth: 100
  },
  {
    label: t('用户名'),
    prop: 'userName',
    minWidth: 150,
  },
  {
    label: t('用户ID'),
    prop: 'id',
    minWidth: 150
  },
  {
    label: t('所属商户'),
    prop: 'tenantName',
    minWidth: 150
  },
  {
    label: t('商户编码'),
    prop: 'tenantCode',
    minWidth: 150
  },
  {
    label: t('限额等级'),
    prop: 'limitLevel',
    minWidth: 150
  },
  {
    label: t('账号是否冻结'),
    prop: 'isFreeze',
    formatter({ isFreeze }) {
      return isFreeze === 1 ? t("冻结") : t('正常')
    },
    minWidth: 150
  },
  {
    label: t('注册日期'),
    prop: 'createdAt',
    formatter({ createdAt }) {
      return dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')
    },
    minWidth: 250
  },
  {
    label: t('备注'),
    prop: 'remark',
    formatter({ remark }) {
      return remark ?? '-'
    },
    minWidth: 150
  },
  {
    label: t('操作'),
    fixed: 'right',
    minWidth: 150,
    slot: 'operation'
  },
];
