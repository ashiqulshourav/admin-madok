import { handleTableWidth } from '@/utils/getTableWidth';
import dayjs from 'dayjs';
import {
  ESPORT_ID_MAP,
  OPENING_STATUS,
  SPORT_ID_MAP
} from '@/utils/maps/sports_map';
import { getLan } from '@/utils/utilFn';
import { MATCH_FORMAT } from '@/utils/maps/sports_map';
const lan = getLan();
export const columns: TableColumnList = [
  {
    type: 'selection',
    align: 'left',
    selectable: row => !(row.saleHandicaps === 0 && row.allHandicaps === 0)
  },
  {
    label: t('锁盘'),
    headerRenderer: d => handleTableWidth(d, t('锁盘'), 'auto'),
    slot: 'lock'
  },
  {
    label: t('联赛名称'),
    prop: 'leagueNameCn',
    formatter: ({ leagueNameCn, leagueNameEn }) => {
      const d = { zh: leagueNameCn, en: leagueNameEn };
      return d[lan] ?? leagueNameCn ?? '-';
    },
    align: 'left',
    minWidth: 200
  },
  {
    label: t('游戏种类'),
    prop: 'sportId',
    headerRenderer: d => handleTableWidth(d, t('游戏种类'), 'auto'),
    formatter: ({ sportId, category }) => {
      const arr = category === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
      return arr.find(_ => _.value === sportId)?.label ?? '-';
    },
    minWidth: 120
  },
  {
    label: t('联赛ID'),
    prop: 'leagueId',
    headerRenderer: d => handleTableWidth(d, t('联赛ID'), 'auto')
  },
  {
    label: t('赛事ID'),
    prop: 'matchId',
    minWidth: 120,
    headerRenderer: d => handleTableWidth(d, t('赛事ID'), 'auto')
  },
  {
    label: t('主队'),
    prop: lan === 'zh' ? 'homeTeamNameCn' : 'homeTeamNameEn',
    minWidth: 150,
    headerRenderer: d => handleTableWidth(d, t('主队'), 'auto'),
    align: 'left'
  },
  {
    label: t('客队'),
    prop: lan === 'zh' ? 'awayTeamNameCn' : 'awayTeamNameEn',
    minWidth: 150,
    headerRenderer: d => handleTableWidth(d, t('客队'), 'auto'),
    align: 'left'
  },
  {
    label: t('开赛时间'),
    prop: 'beginTimeLong',
    formatter: ({ beginTimeLong }) =>
      dayjs(beginTimeLong).format('YYYY-MM-DD HH:mm:ss'),
    headerRenderer: d => handleTableWidth(d, t('开赛时间'), 'auto'),
    width: 200
  },
  {
    label: t('盘口状态'),
    prop: 'handicapStatus',
    headerRenderer: d => handleTableWidth(d, t('盘口状态'), 'auto'),
    formatter: ({ handicapStatus }): string =>
      OPENING_STATUS[handicapStatus as keyof typeof OPENING_STATUS],
    minWidth: 150
  },
  {
    label: t('赛制'),
    prop: 'periodType',
    headerRenderer: d => handleTableWidth(d, t('赛制'), 'auto'),
    formatter: ({ periodType, sportId }): string => {
      if (+sportId === 2 || +sportId === 16) {
        return MATCH_FORMAT[sportId][periodType];
      } else {
        return MATCH_FORMAT[sportId] as string;
      }
    },
    minWidth: 200
  },
  {
    label: t('加时点球开售控制'),
    slot: 'overTimeAndPenaltyKickStatus',
    // headerRenderer: d => handleTableWidth(d, t('加时点球开售控制'), 'auto'),
    minWidth: 240
  },
  {
    label: t('开售盘口/总盘口数'),
    slot: 'saleHandicaps',
    headerRenderer: d => handleTableWidth(d, t('开售盘口/总盘口数'), 'auto'),
    minWidth: 150,
    fixed: 'right'
  },
  {
    label: t('开售控制'),
    slot: 'isSale',
    headerRenderer: d => handleTableWidth(d, t('开售控制'), 'auto'),
    fixed: 'right'
  },
  {
    label: t('操作'),
    fixed: 'right',
    width: 100,
    slot: 'operation'
  }
];
