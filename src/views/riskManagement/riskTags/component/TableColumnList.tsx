export const columns: TableColumnList = [
  {
    label: t('标签ID'),
    prop: 'id',
    minWidth: 100
  },
  {
    label: t('标签级别'),
    slot: 'level',
    minWidth: 150,
  },
  {
    label: t('标签名称'),
    slot: 'name',
    minWidth: 150,
  },
  {
    label: t('体育人数'),
    minWidth: 150,
    slot: 'countTy'
  },
  {
    label: t('电竞人数'),
    minWidth: 150,
    slot: 'countDj'
  },
  {
    label: t('备注'),
    prop: 'remark',
    minWidth: 150
  },

  {
    label: t('操作'),
    fixed: 'right',
    width: 240,
    slot: 'operation'
  }
];
