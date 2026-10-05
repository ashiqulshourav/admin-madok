import { t } from '@/plugins/i18n';
import { handleTableWidth } from '@/utils/getTableWidth';

export const columns: TableColumnList = [
  {
    label: t('操作参数'),
    slot: 'requestLog',
    minWidth: 150,
    headerRenderer: d => handleTableWidth(d, t('操作参数'), 'auto')
  },
  {
    label: t('修改前'),
    slot: 'operateBefore',
    minWidth: 150,
    headerRenderer: d => handleTableWidth(d, t('修改前'), 'auto')
  },
  {
    label: t('修改后'),
    slot: 'operateAfter',
    minWidth: 150,
    headerRenderer: d => handleTableWidth(d, t('修改后'), 'auto')
  },
];
