import { t } from '@/plugins/i18n';
import { parseCountry } from '@/utils/formatMatch';
import { ESPORT_ID_MAP } from '@/utils/maps/sports_map';

export const columns: TableColumnList = [
  {
    label: t('联赛ID'),
    prop: 'leagueId'
  },
  {
    label: t('国家'),
    prop: 'countryId',
    formatter: ({ countryId }) => parseCountry(countryId)
  },
  {
    label: t('188数据源联赛ID'),
    prop: 'leagueId188Bet',
    minWidth: 200
  },
  {
    label: t('联赛LOGO'),
    slot: 'leagueLogo',
    minWidth: 200
  },
  {
    label: t('游戏分类'),
    minWidth: 140,
    formatter: ({ sportId }) =>
      ESPORT_ID_MAP.find(item => item.value === sportId)?.label ?? '-'
  },
  {
    label: t('联赛中文名'),
    prop: 'leagueNameCn',
    align: 'left',
    minWidth: 200
  },
  {
    label: t('联赛英文名'),
    prop: 'leagueNameEn',
    align: 'left',
    minWidth: 200
  },
  {
    label: t('热门排序'),
    prop: 'level'
  },
  {
    label: t('联赛等级'),
    prop: 'riskLevel',
    minWidth: 150,
    formatter: ({ riskLevel }): string => {
      return riskLevel < 0 ? t('未评级') : riskLevel;
    }
  },
  {
    label: t('预约'),
    slot: 'reservationSwitch',
    minWidth: 150
  },
  {
    label: t('操作'),
    slot: 'operation'
  }
];
