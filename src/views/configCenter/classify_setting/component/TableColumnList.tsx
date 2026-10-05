import { t } from '@/plugins/i18n';

export const columns: TableColumnList = [
  {
    label: t('分类ID'),
    prop: 'id'
  },
  {
    label: t('分类名称'),
    prop: 'configValue'
  },
  {
    label: t('操作'),
    fixed: 'right',
    width: 240,
    slot: 'operation'
  }
];

