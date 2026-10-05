import { handleTableWidth } from '@/utils/getTableWidth';

export const columns: TableColumnList = [
  {
    label: t('序号'),
    type: 'index',
    width: 100,
    headerRenderer: d => handleTableWidth(d, t('序号'))
  },
  {
    label: t('账号'),
    minWidth: 150,
    prop: 'name'
  },
  {
    label: t('所属部门'),
    prop: 'deptName',
    minWidth: 150
  },
  {
    label: t('所属角色'),
    prop: 'roleName',
    minWidth: 150
  },
  {
    label: t('U盾序列号'),
    prop: 'roleName',
    minWidth: 200,
    headerRenderer: d => handleTableWidth(d, t('U盾序列号'), 'auto'),
    formatter: ({ ukeyCode }): string => ukeyCode ?? '-'
  },
  {
    label: t('创建时间'),
    minWidth: 200,
    prop: 'createdAt',
    headerRenderer: d => handleTableWidth(d, t('创建时间'), 'auto')
  },
  {
    label: t('上次登录时间'),
    minWidth: 200,
    prop: 'lastLoginTime'
  },
  {
    label: t('上次登录IP'),
    prop: 'lastLoginIp',
    minWidth: 200,
    formatter: ({ lastLoginIp }): string => lastLoginIp ?? '-',
    headerRenderer: d => handleTableWidth(d, t('上次登录IP'), 'auto')
  },
  {
    label: t('创建人'),
    prop: 'createdBy',
    minWidth: 150
  },
  {
    label: t('备注信息'),
    prop: 'comment',
    minWidth: 150,
    formatter: ({ comment }): string => comment ?? '-'
  },
  {
    label: t('启用状态'),
    slot: 'openStatus',
    headerRenderer: d => handleTableWidth(d, t('启用状态'), 'auto')
  },
  {
    label: t('重置密码'),
    prop: 'resetPassword',
    slot: 'resetPassword',
    minWidth: 150,
    headerRenderer: d => handleTableWidth(d, t('重置密码'), 'auto')
  },
  {
    label: t('操作'),
    minWidth: 200,
    slot: 'operation'
  }
];
