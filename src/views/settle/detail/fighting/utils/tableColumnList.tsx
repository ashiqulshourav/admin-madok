import dayjs from 'dayjs';
import { handleTableWidth } from '@/utils/getTableWidth';

export const columns: TableColumnList = [
  {
    label: t('回合'),
    prop: 'inningNum',
    type: 'index',
    minWidth: 100
  },
  {
    headerRenderer: () => history.state.params.homeTeamNameCn ?? '_',
    slot: 't1'
  },
  {
    headerRenderer: () => history.state.params.awayTeamNameCn ?? '_',
    slot: 't2'
  },
  {
    label: t('操作人'),
    formatter: ({ createdBy }) => {
      return createdBy ? createdBy : '_';
    }
  },
  {
    label: t('赛果状态'),
    slot: 'secondNum',
    minWidth: 260
  },
  {
    label: t('结算状态'),
    headerRenderer: d => handleTableWidth(d, t('锁盘'), 'auto'),
    formatter: () => {
      return t('人工结算');
    }
  },
  {
    label: t('确认时间'),
    minWidth: 220,
    formatter: ({ id, updatedAt }) => {
      return id ? dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss') : '_';
    }
  },
  {
    label: t('操作'),
    slot: 'operation',
    minWidth: 200
  }
];
