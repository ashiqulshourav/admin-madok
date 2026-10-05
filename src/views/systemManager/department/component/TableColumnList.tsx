import { handleTableWidth } from '@/utils/getTableWidth';
import dayjs from 'dayjs';

export const columns: TableColumnList = [
  {
    label: t('部门名称'),
    prop: 'name',
    className: 'first_table',
    minWidth: 240
  },
  {
    label: t('创建时间'),
    width: 200,
    prop: 'createdAt',
    formatter: ({ createdAt }) =>
      dayjs(createdAt).format('YYYY-MM-DD hh:mm:ss'),
    headerRenderer: d => handleTableWidth(d, t('创建时间'))
  },
  {
    label: t('创建人'),
    prop: 'createdBy'
  },
  {
    label: t('状态'),
    slot: 'status'
  },
  {
    label: t('备注'),
    minWidth: 200,
    prop: 'comment'
  },
  {
    label: t('操作'),
    minWidth: 200,
    slot: 'operation'
  }
];
