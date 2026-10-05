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
    label: t('用户人数'),
    // prop: 'userCount',
    minWidth: 150,
    slot: 'userCount'
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
