import { IconifyIconOffline } from '@/components/ReIcon';
import { handleTableWidth } from '@/utils/getTableWidth';
import { MATCH_STATUS } from '@/utils/maps/sports_map';

export const columns: TableColumnList = [
  {
    label: t('序号'),
    type: 'index',
    minWidth: 100
  },
  {
    label: t('联赛名称'),
    prop: 'leagueNameCn',
    headerRenderer: d => handleTableWidth(d, t('联赛名称'), 'auto'),
    minWidth: 200,
    align: 'left'
  },
  {
    label: t('联赛ID'),
    prop: 'leagueId',
    headerRenderer: d => handleTableWidth(d, t('联赛ID'), 'auto'),
    minWidth: 100,
    align: 'left'
  },
  {
    label: t('主队'),
    prop: 'homeTeamNameCn',
    align: 'left',
    headerRenderer: d => handleTableWidth(d, t('主队'), 'auto'),
    minWidth: 150
  },

  {
    label: t('客队'),
    prop: 'awayTeamNameCn',
    headerRenderer: d => handleTableWidth(d, t('客队'), 'auto'),
    minWidth: 150,
    align: 'left'
  },
  {
    label: t('赛事ID'),
    prop: 'matchId',
    headerRenderer: d => handleTableWidth(d, t('赛事ID'), 'auto'),
    minWidth: 150
  },
  {
    label: t('开赛时间'),
    prop: 'beginTime',
    minWidth: 150,
    headerRenderer: d => handleTableWidth(d, t('开赛时间'), 'auto')
  },
  {
    label: t('比赛状态'),
    prop: 'status',
    headerRenderer: d => handleTableWidth(d, t('比赛状态'), 'auto'),
    formatter: ({ status }): string =>
      MATCH_STATUS[status as keyof typeof MATCH_STATUS],
    minWidth: 150
  },
  {
    label: t('数据有效期'),
    prop: 'dataValidityPeriod',
    headerRenderer: () => {
      return (
        <div class="flex justify-center w-full cursor-pointer">
          <el-tooltip effect="dark" content={t('数据有效期')} placement="top">
            <IconifyIconOffline icon="clockIcon" class="text-[16px]" />
          </el-tooltip>
        </div>
      );
    },
    formatter: ({ dataValidityPeriod }): string => dataValidityPeriod + t('天'),
    minWidth: 150
  },
  {
    label: t('操作'),
    fixed: 'right',
    width: 240,
    slot: 'operation'
  }
];
