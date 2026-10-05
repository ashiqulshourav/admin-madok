import { parseCountry } from '@/utils/formatMatch';
import { handleTableWidth } from '@/utils/getTableWidth';
import { ESPORT_ID_MAP, SPORT_ID_MAP } from '@/utils/maps/sports_map';

export const columns: TableColumnList = [
  {
    label: t('联赛ID'),
    prop: 'leagueId',
    minWidth: 100
  },
  {
    label: t('联赛Logo'),
    slot: 'leagueLogo',
    minWidth: 120
  },
  {
    label: t('国家地区'),
    prop: 'countryId',
    minWidth: 150,
    headerRenderer: d => handleTableWidth(d, t('国家地区'), 'auto'),
    formatter: ({ countryId }) => parseCountry(countryId)
  },
  {
    label: t('188数据源联赛ID'),
    prop: 'leagueId188Bet',
    headerRenderer: d => handleTableWidth(d, t('188数据源联赛ID'), 'auto'),
    minWidth: 150
  },
  {
    label: t('联赛中文名'),
    prop: 'leagueNameCn',
    headerRenderer: d => handleTableWidth(d, t('联赛中文名'), 'auto'),
    minWidth: 150,
    align: 'left'
  },
  {
    label: t('联赛英文名'),
    prop: 'leagueNameEn',
    headerRenderer: d => handleTableWidth(d, t('联赛英文名'), 'auto'),
    minWidth: 150,
    align: 'left'
  },
  {
    label: t('热门排序'),
    prop: 'level',
    headerRenderer: d => handleTableWidth(d, t('热门排序'), 'auto'),
    minWidth: 150
  },
  {
    label: t('联赛等级'),
    prop: 'riskLevel',
    minWidth: 150,
    headerRenderer: d => handleTableWidth(d, t('联赛等级'), 'auto'),
    formatter: ({ riskLevel }): string => {
      return riskLevel < 0 ? t('未评级') : riskLevel;
    }
  },
  {
    label: t('预约'),
    slot: 'reservationSwitch',
    minWidth: 150,
    headerRenderer: d => handleTableWidth(d, t('预约'), 'auto')
  },
  {
    label: t('赛种'),
    prop: 'sportId',
    headerRenderer: d => handleTableWidth(d, t('赛种'), 'auto'),
    formatter: ({ sportId, category }): string => {
      const arr = category === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
      return arr.find(_ => _.value === sportId)?.label ?? '-';
    },
    minWidth: 150
  },
  {
    label: t('操作'),
    fixed: 'right',
    width: 240,
    slot: 'operation'
  }
];
