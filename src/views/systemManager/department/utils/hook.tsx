import editForm from '../form.vue';
import { message } from '@/utils/message';
import { ElMessageBox } from 'element-plus';
import { addDialog, closeDialog } from '@/components/ReDialog';
import { reactive, ref, onMounted, h } from 'vue';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { searchFormType } from './types';
import MemberListCom from '../component/MemberListCom.vue';

export function useDepartmentHook() {
  const dataList = reactive<UserMangerAPI.querySubDeptWithoutSelfData[]>([]);
  const loading = ref(true);

  const form = reactive<searchFormType>({
    name: '',
    createdBy: '',
    status: ' ',
    createFrom: '',
    createEnd: ''
  });

  //- 改变状态类型
  const changeStatusType = (
    list: UserMangerAPI.querySubDeptWithoutSelfData[]
  ) => {
    list.forEach(item => {
      if (item.subNodeList?.length) {
        changeStatusType(item.subNodeList);
      }
      item.status = !!item.status;
    });
  };

  //- 初始化
  async function onSearch() {
    try {
      loading.value = true;
      const res = await API.querySubDept({
        ...removeEmptyStringKeys(form)
      });
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      changeStatusType(res.data);
      dataList.length = 0;
      dataList.push(...res.data);
    } catch (error) {
      loading.value = false;
    }
  }

  const editFormRef = ref();
  //- 新增/修改账号弹窗
  function openDialog(
    title: string,
    row?: UserMangerAPI.querySubDeptWithoutSelfData
  ) {
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
            id: row?.id ?? '',
            comment: row?.comment ?? '',
            parentId: row?.parentId ?? '',
            status: row?.status ?? 1,
            tenantId: row?.tenantId ?? ''
          },
          onCloseDialog: (closeType?: string) => {
            if (closeType) onSearch();
            closeDialog(options, index);
          }
        })
    });
  }

  //- 删除部门
  const handleDelete = async ({
    name,
    id
  }: UserMangerAPI.querySubDeptWithoutSelfData) => {
    ElMessageBox.confirm(
      t('确定要删除部门{department}吗？', {
        department: name
      }),
      t('警告'),
      {
        confirmButtonText: t('确定'),
        cancelButtonText: t('取消'),
        type: 'warning',
        center: true,
        dangerouslyUseHTMLString: true
      }
    ).then(async () => {
      const res = await API.deleteDepartment({ id });
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if (!res.code) onSearch();
    });
  };

  //- 修改启用状态
  const updateUserStatus = async (
    row: UserMangerAPI.querySubDeptWithoutSelfData
  ) => {
    return new Promise<boolean>((resolve, reject) => {
      ElMessageBox.confirm(
        +row.status === 0
          ? t('确定要开启部门使用么？')
          : t('确定关闭部门使用么?'),
        t('警告'),
        {
          center: true,
          type: 'warning'
        }
      )
        .then(async () => {
          const res = await API.udateDepStatus({
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

  //- 打开用户弹窗
  const showDepartmentMember = (
    row: UserMangerAPI.querySubDeptWithoutSelfData,
    type: 'query' | 'setting',
    title: string
  ) => {
    addDialog({
      title,
      width: '80%',
      closeOnClickModal: false,
      hideFooter: true,
      alignCenter: true,
      contentRenderer: ({ options, index }) =>
        h(MemberListCom, {
          id: row.id,
          type,
          onCloseDialog: (closeType?: string) => {
            if (closeType) onSearch();
            closeDialog(options, index);
          }
        })
    });
  };

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    dataList,
    form,
    onSearch,
    showDepartmentMember,
    openDialog,
    handleDelete,
    updateUserStatus
  };
}
