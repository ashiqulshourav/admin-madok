import { t } from '@/plugins/i18n';
import { handleTableWidth } from '@/utils/getTableWidth';
import { TableColumnRenderer } from '@pureadmin/table';

export const columns: TableColumnList = [
  {
    label: t('角色等级'),
    prop: 'level',
    align: 'left'
  },
  {
    label: t('角色名称'),
    prop: 'name',
    headerRenderer: (d: TableColumnRenderer) =>
      handleTableWidth(d, t('角色名称'), 'auto')
  },
  {
    label: t('所属一级部门'),
    prop: 'deptName'
  },
  {
    label: t('创建时间'),
    prop: 'createdAt',
    formatter: ({ createdAt }: { createdAt?: string }) => createdAt ?? '-',
    headerRenderer: (d: TableColumnRenderer) =>
      handleTableWidth(d, t('创建时间'), 'auto')
  },
  {
    label: t('创建人'),
    prop: 'createdBy',
    formatter: ({ createdBy }: { createdBy?: string }) => createdBy ?? '-',
    headerRenderer: (d: TableColumnRenderer) =>
      handleTableWidth(d, t('创建人'), 'auto')
  },
  {
    label: t('使用人数'),
    formatter: ({ userCount }: { userCount?: string }) => userCount ?? '-',
    headerRenderer: (d: TableColumnRenderer) =>
      handleTableWidth(d, t('使用人数'), 'auto')
  },
  {
    label: t('状态'),
    slot: 'status',
    headerRenderer: (d: TableColumnRenderer) =>
      handleTableWidth(d, t('状态'), 'auto')
  },
  {
    label: t('备注'),
    prop: 'comment',
    formatter: ({ comment }: { comment?: string }) => comment ?? '-',
    headerRenderer: (d: TableColumnRenderer) =>
      handleTableWidth(d, t('备注'), 'auto')
  },
  {
    label: t('操作'),
    slot: 'operation',
    headerRenderer: (d: TableColumnRenderer) =>
      handleTableWidth(d, t('操作'), 'auto')
  }
];
