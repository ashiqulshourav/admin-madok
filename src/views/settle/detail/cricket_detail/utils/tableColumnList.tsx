import { handleTableWidth } from '@/utils/getTableWidth';
import { getLan } from '@/utils/utilFn';
import dayjs from 'dayjs';

export const columns: TableColumnList = [
  {
    label: t('局'),
    prop: 'inningNum',
    type: 'index',
    minWidth: 100,
    headerRenderer: d => handleTableWidth(d, t('局'))
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
    label: t('状态'),
    formatter: () => {
      return t('人工结算');
    }
  },
  {
    label: t('确认时间'),
    formatter: ({ id, updatedAt }) => {
      return id ? dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss') : '_';
    }
  },
  {
    label: t('操作'),
    slot: 'operation',
    minWidth: getLan() === 'zh' ? 200 : 300
  }
];
