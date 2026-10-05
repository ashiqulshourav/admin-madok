import { t } from '@/plugins/i18n';
import { handleTableWidth } from '@/utils/getTableWidth';
import { TYPE_NAME } from '../utils/map';

export const columns: TableColumnList = [
  {
    label: t('菜单中文名'),
    prop: 'name',
    className: 'first_table',
    headerRenderer: d => handleTableWidth(d, t('菜单中文名'), 'auto'),
    minWidth: 200,
    formatter({ name }) {
      return <div class="min-w-20 text-left">{name}</div>;
    }
  },
  {
    label: t('菜单英文名'),
    prop: 'enName',
    minWidth: 150,
    headerRenderer: d => handleTableWidth(d, t('菜单英文名'), 'auto'),
    formatter: ({ enName }) => enName
  },
  {
    label: t('菜单类型'),
    prop: 'type',
    minWidth: 220,
    headerRenderer: d => handleTableWidth(d, t('菜单类型'), 'auto'),
    formatter: ({ type }) => {
      return (
        <el-text type={type === 6 ? 'danger' : 'primary'}>
          {TYPE_NAME[type as keyof typeof TYPE_NAME] ?? '-'}
        </el-text>
      );
    }
  },
  {
    label: t('前端路径'),
    prop: 'path',
    minWidth: 200,
    headerRenderer: d => handleTableWidth(d, t('前端路径'), 'auto')
  },
  {
    label: t('后端路径'),
    prop: 'routerPath',
    minWidth: 260,
    headerRenderer: d => handleTableWidth(d, t('后端路径'), 'auto')
  },
  {
    label: t('菜单排序'),
    prop: 'sort',
    minWidth: 220,
    headerRenderer: d => handleTableWidth(d, t('菜单排序'), 'auto')
  },
  {
    label: t('菜单展示'),
    prop: 'type',
    minWidth: 200,
    headerRenderer: d => handleTableWidth(d, t('菜单展示'), 'auto'),
    formatter: ({ type }) => {
      return (
        <el-text type={type === 1 ? 'danger' : 'info'}>
          {type === 0 || type === 6 ? t('是') : t('否')}
        </el-text>
      );
    }
  },
  {
    label: t('建立时间'),
    prop: 'createdAt',
    minWidth: 200,
    headerRenderer: d => handleTableWidth(d, t('建立时间'), 'auto')
  },
  {
    label: t('修改时间'),
    prop: 'updatedAt',
    minWidth: 200,
    headerRenderer: d => handleTableWidth(d, t('修改时间'), 'auto')
  },
  {
    label: t('操作'),
    slot: 'operation',
    width: 180,
    fixed: 'right'
  }
];
