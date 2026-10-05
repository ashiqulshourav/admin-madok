export const IpListColumn: TableColumnList = [
  {
    label: t('登录用户名'),
    prop: 'userName',
    minWidth: 150
  },
  {
    label: t('所属商户'),
    prop: 'tenantCode',
    minWidth: 150
  },
  {
    label: t('限额等级'),
    prop: 'limitLevel',
    minWidth: 150
  },
  {
    label: t('风控标签'),
    slot: 'riskControlLabel',
    width: 350
  },
  {
    label: t('会员状态'),
    prop: 'isFreeze',
    formatter: ({ isFreeze }) => (isFreeze === 1 ? t('冻结') : t('启用')),
    minWidth: 150
  }
];
