import { handleTableWidth } from '@/utils/getTableWidth';
import dayjs from 'dayjs';
import { ESPORT_ID_MAP, SPORT_ID_MAP } from '@/utils/maps/sports_map';
import { getLan } from '@/utils/utilFn';
import { parseCountry } from '@/utils/formatMatch';
import { NEW_MATCH_STATUS } from '@/views/settle/main/utils/map';

export const columns: TableColumnList = [
  {
    label: t('序号'),
    type: 'index',
    headerRenderer: d => handleTableWidth(d, t('序号'), 'auto'),
    minWidth: 100
  },
  {
    label: t('比赛名称'),
    prop: 'matchName',
    headerRenderer: d => handleTableWidth(d, t('比赛名称'), 'auto'),
    formatter: ({ matchName }) => matchName || '-',
    align: 'left',
    minWidth: 300
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
    minWidth: 120,
    headerRenderer: d => handleTableWidth(d, t('联赛ID'), 'auto')
  },
  {
    label: t('赛事ID'),
    prop: 'matchId',
    minWidth: 120,
    headerRenderer: d => handleTableWidth(d, t('赛事ID'), 'auto')
  },
  {
    label: t('国家地区'),
    prop: 'matchTeam',
    minWidth: 260,
    headerRenderer: d => handleTableWidth(d, t('国家地区'), 'auto'),
    formatter: ({ countryId }) => parseCountry(countryId)
  },
  {
    label: t('开赛时间'),
    prop: 'beginTimeLong',
    formatter: ({ beginTimeLong }) =>
      dayjs(beginTimeLong).format('YYYY-MM-DD HH:mm:ss'),
    headerRenderer: d => handleTableWidth(d, t('开赛时间'), 'auto'),
    minWidth: 160
  },
  {
    label: t('赛事状态'),
    headerRenderer: d => handleTableWidth(d, t('赛事状态'), 'auto'),
    minWidth: 180,
    formatter: ({ status }) =>
      NEW_MATCH_STATUS.find(item => item.value === status)?.label ?? '-'
  },
  // {
  //   label: t('开售状态'),
  //   headerRenderer: d => handleTableWidth(d, t('开售状态'), 'auto'),
  //   minWidth: 180,
  //   formatter: ({ isSale }) => (isSale === 0 ? t('关闭') : t('开售'))
  // },
  {
    label: t('锁盘控制'),
    slot: 'handicapStatus',
    headerRenderer: d => handleTableWidth(d, t('锁盘控制'), 'auto')
  },
  {
    label: t('操作'),
    fixed: 'right',
    slot: 'operation',
    minWidth: getLan() === 'zh' ? 200 : 300
  }
];
