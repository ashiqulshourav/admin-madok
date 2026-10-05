import dayjs from 'dayjs';

export const columns: TableColumnList = [
  {
    label: t('序号'),
    type: 'index'
  },
  {
    label: t('玩法'),
    prop: 'methods',
    slot: 'methods'
  },
  {
    label: t('注单号'),
    prop: 'id'
  },
  {
    label: t('联赛名称'),
    prop: 'leagueName',
    formatter: ({ combineOrderDetails }) => {
      return combineOrderDetails[0].leagueNameCn;
    }
  },
  {
    label: t('赛事ID'),
    prop: 'matchId',
    formatter: ({ combineOrderDetails }) => {
      return combineOrderDetails[0].matchId;
    }
  },
  {
    label: t('开赛时间'),
    prop: 'beginTime',
    formatter: ({ combineOrderDetails }) => {
      return dayjs(combineOrderDetails[0].beginTime).format('MM-DD HH:mm:ss');
    }
  }
];
