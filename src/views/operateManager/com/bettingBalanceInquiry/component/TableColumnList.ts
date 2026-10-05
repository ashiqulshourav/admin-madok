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
    label: t('用戶ID'),
    prop: 'userid',
    minWidth: 150
  },
  {
    label: t('所属商户'),
    prop: 'tenantName',
    minWidth: 150
  },
  {
    label: t('单场赛事剩余赔付可用额度'),
    prop: 'matchMaxWinLimit',
    minWidth: 150
  },
  // {
  //   label: t('单关单日剩余可投额度'),
  //   prop: 'seriesType1DayMaxLimit',
  //   minWidth: 150
  // },
  {
    label: t('串关当日剩余赔付可用额度'),
    prop: 'seriesType2DayMaxLimit',
    minWidth: 150
  },
  // {
  //   label: t('冠军当日剩余可投额度'),
  //   prop: 'championDayMaxLimit',
  //   minWidth: 150
  // }
];
