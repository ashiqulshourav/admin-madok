import editForm from '../form.vue';
import { message } from '@/utils/message';
import { ElMessageBox } from 'element-plus';
import { addDialog, closeDialog } from '@/components/ReDialog';
import type { PaginationProps } from '@pureadmin/table';
import { reactive, ref, onMounted, h } from 'vue';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { searchFormType } from './types';
import ResetPassword from '../component/ResetPassword.vue';
import { NameData } from '../../roleManager/utils/types';
import { useUserStore } from '@/store/user';
import { getMD5 } from '@/utils/caypto';

export function useUserManager() {
  const dataList = reactive<UserMangerAPI.querySysAccountListData[]>([]);
  const loading = ref(true);

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const form = reactive<searchFormType>({
    name: '',
    createdBy: '',
    status: ' ',
    startCreatedAt: '',
    endCreatedAt: ''
  });

  function handleTableWidthChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val: number) {
    console.log('handleSelectionChange', val);
  }

  //- 初始化
  async function onSearch(type?: string) {
    const userStore = useUserStore();
    if (type === 'reload') pagination.currentPage = 1;
    try {
      loading.value = true;
      const res = await API.getUserList({
        ...removeEmptyStringKeys(form),
        pageSize: pagination.pageSize,
        pageNum: pagination.currentPage
      });
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      res.data.list.forEach(item => (item.status = !!item.status));
      dataList.length = 0;
      dataList.push(...res.data.list);
      dataList.forEach(item => {
        if (item.name === NameData.admin) {
          item.disabled = userStore.userInfo.name !== NameData.admin;
        } else {
          item.disabled = false;
        }
      });
      pagination.total = res.data.total;
    } catch (error) {
      loading.value = false;
    }
  }

  const editFormRef = ref();
  //- 新增/修改账号弹窗
  function openDialog(
    title: string,
    row?: UserMangerAPI.querySysAccountListData
  ) {
    if (row?.roleId === 999999999) {
      return message(
        t('禁止编辑临时部门与游客角色，请到部门管理之移入部门操作'),
        { type: 'error' }
      );
    }
    addDialog({
      title,
      width: '30%',
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: ({ options, index }) =>
        h(editForm, {
          ref: editFormRef,
          row: {
            name: row?.name ?? '',
            dept: row?.dept ?? '',
            roleId: row?.roleId ?? '',
            comment: row?.comment ?? '',
            status: row?.status ?? true,
            avatar: row?.avatar ?? '',
            isAdmmin: row?.isAdmin ?? 1,
            pwd: row?.pwd ?? '',
            id: row?.id ?? '',
            ukeyCode: row?.ukeyCode ?? '',
            flag: row?.id ? row?.flag : 1,
            ipAuth: row?.ipAuth ?? '',
          },
          onCloseDialog: (
            closeType?: string,
            isShowSuccessDialog?: boolean
          ) => {
            closeType ? onSearch('reload') : onSearch();
            closeDialog(options, index);
            if (isShowSuccessDialog) {
              ElMessageBox.confirm(
                <div class="flex items-center flex-col font-bold">
                  <span>{t('新增账号成功')}</span>
                  <span>
                    {t('账号')}: {editFormRef.value?.newFormInline.name}
                  </span>
                </div>,
                '',
                {
                  center: true,
                  showCancelButton: false
                }
              );
            }
          }
        })
    });
  }

  //- 删除账号
  const handleDelete = async (row: UserMangerAPI.querySysAccountListData) => {
    ElMessageBox.confirm(
      `<div class="text-center">
       <p>${t('确定要删除用户账号')}${row.name}</br></p>
      <p>${t('账号删除后不可恢复')}</p>
      </div>`,
      t('警告'),
      {
        confirmButtonText: t('提交'),
        cancelButtonText: t('取消'),
        type: 'warning',
        center: true,
        dangerouslyUseHTMLString: true
      }
    ).then(async () => {
      const res = await API.deleteSysAccount({ id: row.id });
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if (!res.code) onSearch();
    });
  };

  //- 重置密码

  const resetPasswordClick = async (
    row: UserMangerAPI.querySysAccountListData,
    password: string
  ) => {
    ElMessageBox.confirm(
      `${t(`确定要重置${row.name}的密码？`)}</br>${t(
        `重置后的密码为:${password}`
      )}`,
      t('警告'),
      {
        confirmButtonText: t('提交'),
        cancelButtonText: t('取消'),
        type: 'warning',
        center: true,
        dangerouslyUseHTMLString: true
      }
    ).then(async () => {
      const res = await API.updateUserPwd({
        id: row.id,
        newPwd: getMD5(password)
      });
      message(res.msg, { type: res.code ? 'error' : 'success' });
    });
  };

  const openPasswordResetDialog = (
    row: UserMangerAPI.querySysAccountListData
  ) => {
    addDialog({
      title: t('重置密码'),
      class: 'reset_dialog',
      width: '30%',
      center: true,
      hideFooter: true,
      closeOnClickModal: false,
      contentRenderer: ({ options, index }) =>
        h(ResetPassword, {
          name: row.name,
          onCloseDialog: (_: boolean) => {
            closeDialog(options, index);
          },
          onConfirmDialog: (password: string) => {
            resetPasswordClick(row, password);
            closeDialog(options, index);
          }
        })
    });
  };

  //- 修改启用状态
  const updateUserStatus = async (
    row: UserMangerAPI.querySysAccountListData
  ) => {
    return new Promise<boolean>((resolve, reject) => {
      ElMessageBox.confirm(
        +row.status === 0 ? t('确定要开启用户么？') : t('确定关闭用户么?'),
        t('警告'),
        {
          center: true,
          type: 'warning'
        }
      )
        .then(async () => {
          const res = await API.updateStatusById({
            status: +row.status === 0 ? 1 : 0,
            id: row.id
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

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    dataList,
    pagination,
    // buttonClass,
    onSearch,
    openDialog,
    form,
    handleDelete,
    handleTableWidthChange,
    handleCurrentChange,
    handleSelectionChange,
    resetPasswordClick,
    updateUserStatus,
    openPasswordResetDialog
  };
}
