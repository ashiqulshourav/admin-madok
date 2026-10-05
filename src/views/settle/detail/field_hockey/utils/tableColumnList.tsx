import { getLan } from '@/utils/utilFn';
import dayjs from 'dayjs';
export const MATCH_PERIOD_TYPES = {
  40: t('加时赛'),
  1: t('上半场'),
  2: t('下半场')
};
export const columns: TableColumnList = [
  {
    headerSlot: 'inningNum',
    formatter: ({ matchPeriodId }) => MATCH_PERIOD_TYPES[matchPeriodId] ?? '-'
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
