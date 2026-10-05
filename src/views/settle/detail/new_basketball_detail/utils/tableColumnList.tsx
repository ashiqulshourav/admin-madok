import dayjs from 'dayjs';
import { BASKETBALL_EVENT_TYPE } from './map';

export const childColumns: TableColumnList = [
  {
    prop: 'matchPeriod',
    formatter: ({ matchPeriodId }) => {
      return BASKETBALL_EVENT_TYPE[matchPeriodId] ?? '-';
    },
    headerRenderer: () => {
      return history.state.params.periodType === 4
        ? t('比赛节数')
        : t('比赛时段');
    }
  },
  {
    label: t('事件编码'),
    prop: 'eventCode',
    formatter: ({ periodType }) => {
      return periodType === 2 ? t('篮球半场比分') : t('篮球小节比分');
    }
  },
  {
    label: t('结算类型'),
    prop: 'settleType',
    formatter: ({ settleType }) =>
      settleType === 0 ? t('自动结算') : t('人工结算')
  },
  {
    label: t('主队比分 : 客队比分'),
    slot: 'score'
  },
  // {
  //   label: t('事件生成时间'),
  //   slot: 'eventTime',
  //   headerRenderer: d => handleTableWidth(d, t('事件生成时间'))
  // },
  {
    label: t('操作'),
    slot: 'operation'
  },
  {
    label: t('结算次数'),
    prop: 'settleTimes',
    formatter: ({ settleTimes }) => settleTimes ?? '-'
  },
  {
    label: t('确认时间'),
    prop: 'updatedAt',
    formatter: ({ updatedAt, settleTimes }) =>
      settleTimes > 0 ? dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss') : '-'
  },
  {
    label: t('数据商'),
    slot: 'dataSourceCode'
  }
];
