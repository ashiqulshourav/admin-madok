import dayjs from 'dayjs';
import { t } from '@/plugins/i18n';
import { handleTableWidth } from '@/utils/getTableWidth';

export const columns: TableColumnList = [
  {
    label: t('操作菜单'),
    prop: 'operateMenu',
    align: 'left',
    minWidth: 230,
    formatter: ({ operateMenu }) => (operateMenu ? operateMenu : '-'),
    headerRenderer: d => handleTableWidth(d, t('操作菜单'), 'auto')
  },
  {
    label: t('操作类别'),
    prop: 'operateLog',
    minWidth: 200,
    headerRenderer: d => handleTableWidth(d, t('操作类别'), 'auto')
  },
  {
    label: t('操作类型'),
    prop: 'operateType',
    minWidth: 100,
    headerRenderer: d => handleTableWidth(d, t('操作类型'), 'auto')
  },
  {
    label: t('操作参数'),
    slot: 'requestLog',
    prop: 'requestLog',
    minWidth: 250,
    headerRenderer: d => handleTableWidth(d, t('操作参数'), 'auto')
  },
  {
    label: t('修改前'),
    formatter: ({ operateBefore }) => {
      return <div style="white-space:pre-wrap">{operateBefore}</div>;
    },
    prop: 'operateBefore',
    slot: 'operateBefore',
    minWidth: 250,
    headerRenderer: d => handleTableWidth(d, t('修改前'), 'auto')
  },
  {
    label: t('修改后'),
    prop: 'operateAfter',
    slot: 'operateAfter',
    minWidth: 250,
    headerRenderer: d => handleTableWidth(d, t('修改后'), 'auto')
  },
  {
    label: t('操作人'),
    formatter: ({ userName }) => userName ?? '-',
    prop: 'userName',
    minWidth: 150,
    headerRenderer: d => handleTableWidth(d, t('操作人'), 'auto')
  },
  {
    label: t('操作IP'),
    formatter: ({ operateIp }) => operateIp ?? '-',
    prop: 'operateIp',
    minWidth: 150,
    headerRenderer: d => handleTableWidth(d, t('操作IP'), 'auto')
  },
  {
    label: t('操作时间'),
    prop: 'updatedAt',
    minWidth: 200,
    headerRenderer: d => handleTableWidth(d, t('操作时间'), 'auto'),
    formatter: ({ updatedAt }) =>
      `${dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss')}`
  }
];
