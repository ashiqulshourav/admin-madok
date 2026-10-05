import { t } from '@/plugins/i18n';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';
import { handleTableWidth } from '@/utils/getTableWidth';
import { parseCountry } from '@/utils/formatMatch';

export const columns: TableColumnList = [
  {
    label: t('球队ID'),
    prop: 'teamId',
    headerRenderer: d => handleTableWidth(d, t('球队ID'), 'auto')
  },
  {
    label: t('球队Logo'),
    prop: 'teamLogo',
    slot: 'teamLogo'
  },
  {
    label: t('国家地区'),
    prop: 'countryId',
    headerRenderer: d => handleTableWidth(d, t('国家地区'), 'auto'),
    formatter: ({ countryId }) => parseCountry(countryId)
  },
  {
    label: t('是否国家队'),
    prop: 'isCountryTeam',
    headerRenderer: d => handleTableWidth(d, t('是否国家队'), 'auto'),
    formatter: ({ isCountryTeam }) => (isCountryTeam ? t('否') : t('是'))
  },
  {
    label: t('联赛ID'),
    prop: 'leagueId',
    headerRenderer: d => handleTableWidth(d, t('联赛ID'), 'auto')
  },
  {
    label: t('球队等级'),
    prop: 'level',
    headerRenderer: d => handleTableWidth(d, t('球队等级'), 'auto')
  },
  {
    label: t('赛种'),
    prop: 'sportId',
    formatter: ({ sportId }): string =>
      SPORT_ID_MAP.find(_ => _.value === sportId)?.label ?? '-',
    headerRenderer: d => handleTableWidth(d, t('赛种'), 'auto')
  },
  {
    label: t('主场名称'),
    prop: 'stadiumName',
    headerRenderer: d => handleTableWidth(d, t('主场名称'), 'auto'),
    formatter: ({ stadiumName }) => stadiumName || '-'
  },
  {
    label: t('球队中文名称'),
    prop: 'teamNameCn',
    align: 'left',
    headerRenderer: d => handleTableWidth(d, t('球队中文名称'), 'auto')
  },
  {
    label: t('球队英文名称'),
    prop: 'teamNameEn',
    align: 'left',
    headerRenderer: d => handleTableWidth(d, t('球队英文名称'), 'auto')
  },
  {
    label: t('操作'),
    fixed: 'right',
    width: 240,
    slot: 'operation'
  }
];
