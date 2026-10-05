import { parseCountry } from '@/utils/formatMatch';
import { ESPORT_ID_MAP, SPORT_ID_MAP } from '@/utils/maps/sports_map';

export const columns: TableColumnList = [
  {
    label: t('联赛ID'),
    prop: 'leagueId',
    minWidth: 100
  },
  {
    label: t('联赛名称'),
    prop: 'leagueNameCn',
    minWidth: 150,
    align: 'left'
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
    label: t('赛事ID'),
    prop: 'matchId',
    minWidth: 150
  },
  {
    label: t('主队'),
    prop: 'homeTeamNameCn',
    minWidth: 150
  },
  {
    label: t('客队'),
    prop: 'awayTeamNameCn',
    minWidth: 150
  },
  {
    label: t('开赛时间'),
    prop: 'beginTime',
    minWidth: 150
  },

  {
    label: t('操作'),
    fixed: 'right',
    width: 240,
    slot: 'operation'
  }
];
