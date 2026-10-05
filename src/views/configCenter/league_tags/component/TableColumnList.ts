import {
  ESPORT_ID_MAP,
  SPORT_ID_MAP,
  SPORT_CATEGORY
} from '@/utils/maps/sports_map';

export const columns: TableColumnList = [
  {
    label: t('联赛标签ID'),
    prop: 'id',
    minWidth: 100
  },
  {
    label: t('赛事类型'),
    prop: 'category',
    minWidth: 150,
    formatter: ({ category }) =>
      SPORT_CATEGORY.find(item => item.value === category)?.label ?? '-'
  },
  {
    label: t('赛种'),
    prop: 'sportId',
    formatter: ({ sportId, category }): string => {
      const arr = category === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
      return arr.find(_ => _.value === sportId)?.label ?? '-';
    },
    minWidth: 150
  },
  {
    label: t('标签名称'),
    // sortable: true,
    prop: 'text',
    minWidth: 150
  },
  {
    label: t('操作'),
    fixed: 'right',
    width: 240,
    slot: 'operation'
  }
];
