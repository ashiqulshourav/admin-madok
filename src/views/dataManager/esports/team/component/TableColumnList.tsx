import { t } from '@/plugins/i18n';
import { ESPORT_ID_MAP } from '@/utils/maps/sports_map';
import { handleTableWidth } from '@/utils/getTableWidth';
import { parseCountry } from '@/utils/formatMatch';

export const columns: TableColumnList = [
  {
    label: t('国家地区'),
    prop: 'countryId',
    headerRenderer: d => handleTableWidth(d, t('国家地区'), 'auto'),
    formatter: ({ countryId }) => parseCountry(countryId)
  },
  {
    label: t('联赛ID'),
    prop: 'leagueId',
    headerRenderer: d => handleTableWidth(d, t('联赛ID'), 'auto')
  },
  {
    label: t('队伍ID'),
    prop: 'teamId',
    headerRenderer: d => handleTableWidth(d, t('队伍ID'), 'auto')
  },
  {
    label: t('队伍等级'),
    prop: 'level',
    headerRenderer: d => handleTableWidth(d, t('队伍等级'), 'auto')
  },
  {
    label: t('赛种'),
    prop: 'sportId',
    formatter: ({ sportId }): string =>
      ESPORT_ID_MAP.find(_ => _.value === sportId)?.label ?? '-',
    headerRenderer: d => handleTableWidth(d, t('赛种'), 'auto')
  },
  {
    label: t('队伍Logo'),
    slot: 'teamLogo',
    minWidth: 200,
    headerRenderer: d => handleTableWidth(d, t('队伍Logo'), 'auto')
  },
  {
    label: t('队伍中文名称'),
    prop: 'teamNameCn',
    align: 'left',
    headerRenderer: d => handleTableWidth(d, t('队伍中文名称'), 'auto')
  },
  {
    label: t('队伍英文名称'),
    prop: 'teamNameEn',
    align: 'left',
    headerRenderer: d => handleTableWidth(d, t('队伍英文名称'), 'auto')
  },
  {
    label: t('是否国家队'),
    prop: 'isCountryTeam',
    headerRenderer: d => handleTableWidth(d, t('是否国家队'), 'auto'),
    formatter: ({ isCountryTeam }) => (isCountryTeam ? t('是') : t('否'))
  },
  {
    slot: 'operation',
    label: t('操作'),
    fixed: 'right',
    minWidth: 150
  }
];
