import { message } from '@/utils/message';
import editForm from '../form.vue';
import { columns } from '../component/TableColumnList';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { addDialog, closeDialog } from '@/components/ReDialog';
import RoleTree from '../component/RoleTree.vue';
import { SearchFormType } from './types';
import { ElMessageBox } from 'element-plus';

export function useRoleHook() {
  const dataList = reactive<RoleAPI.queryRoleList[]>([]);
  const loading = ref(true);
  const whiteFormRef = ref(true);
  const expandRoeList = reactive<string[]>([]);

  const form = reactive<SearchFormType>({
    name: '',
    createdBy: '',
    status: ' ',
    createFrom: '',
    createEnd: ''
  });

  //- 改变状态类型
  const changeStatusType = (list: RoleAPI.queryRoleList[]) => {
    list.forEach(item => {
      if (item.subRoleNodeList?.length) {
        changeStatusType(item.subRoleNodeList);
      }
      item.status = !!item.status;
    });
  };

  //- 初始化
  const onSearch = async () => {
    try {
      loading.value = true;
      const res = await API.querySysAccountList({
        ...removeEmptyStringKeys({
          ...form
        })
      });

      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      changeStatusType(res.data);
      dataList.length = 0;
      dataList.push(...res.data);
      dataList.forEach(item => {
        expandRoeList.push(item.id.toString());
      });
    } catch (error) {
      loading.value = false;
    }
  };

  //- 修改启用状态
  const updateUserStatus = async (row: RoleAPI.queryRoleList) => {
    return new Promise<boolean>((resolve, reject) => {
      ElMessageBox.confirm(
        +row.status === 1
          ? row.userCount
            ? t(
                '该角色下仍有{n}个用户，禁用此角色将导致这些用户无法访问系统。是否继续?',
                { n: row.userCount }
              )
            : t('确定要关闭当前角色么？')
          : t('确定开启当前角色么?'),
        t('警告'),
        {
          center: true,
          type: 'warning'
        }
      )
        .then(async () => {
          const res = await API.updateRoleStatus({
            status: +row.status === 0 ? 1 : 0,
            roleId: +row.id
          });
          if (res.code) {
            reject();
          } else {
            resolve(true);
            onSearch();
          }
          message(res.msg, { type: res.code ? 'error' : 'success' });
        })
        .catch(reject);
    });
  };

  //- 角色弹窗
  function openRoleDialog(title: string, row?: RoleAPI.queryRoleList) {
    addDialog({
      title,
      width: '30%',
      hideFooter: true,
      closeOnClickModal: false,
      alignCenter: true,
      contentRenderer: ({ options, index }) =>
        h(editForm, {
          row: {
            id: row?.id ?? '',
            roleName: row?.name ?? '',
            status: row?.status ?? true,
            comment: row?.comment ?? '',
            roleId: row?.id ?? '',
            dept: row?.dept ?? '',
            parentId: row?.parentId ?? ''
          },
          onCloseDialog: (closeType?: string) => {
            if (closeType) onSearch();
            closeDialog(options, index);
          }
        })
    });
  }

  //- 删除角色
  const handleDelete = (row: RoleAPI.queryRoleList) => {
    ElMessageBox.confirm(
      `<div class="text-center">
       <p>${t('确定要删除角色')}${row.name}</br></p>
      <p>${t('角色删除后不可恢复')}</p>
      </div>`,
      t('警告'),
      {
        confirmButtonText: t('提交'),
        cancelButtonText: t('取消'),
        center: true,
        dangerouslyUseHTMLString: true
      }
    ).then(async () => {
      const res = await API.deleteRole({ roleId: +row.id });
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if (!res.code) onSearch();
    });
  };

  //- 权限设置弹窗
  const openRoleSettingDialog = (roleId: number) => {
    addDialog({
      title: t('功能权限设置'),
      width: '40%',
      alignCenter: true,
      hideFooter: true,
      closeOnClickModal: false,
      contentRenderer: ({ options, index }) => {
        return h(RoleTree, {
          ref: whiteFormRef,
          roleId,
          onCloseDialog: () => closeDialog(options, index)
        });
      }
    });
  };

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    columns,
    dataList,
    form,
    onSearch,
    openRoleDialog,
    openRoleSettingDialog,
    updateUserStatus,
    handleDelete,
    expandRoeList
  };
}
