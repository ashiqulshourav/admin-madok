import { message } from '@/utils/message';
import { ElMessageBox } from 'element-plus';
import { reactive, ref, onMounted } from 'vue';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { PaginationProps } from '@pureadmin/table';
import { useUserStore } from '@/store/user';

export function useMemberHook(id: number, urlType: 'setting' | 'query') {
  const dataList = reactive<UserMangerAPI.tenantDepartmentQueryList[]>([]);
  const loading = ref(true);
  const departmentList = reactive<UserMangerAPI.querySubDeptWithoutSelfData[]>(
    []
  );
  const roleList = reactive<UserMangerAPI.subRoleListData[]>([]);

  const form = reactive<{ name: string; status: boolean | string }>({
    name: '',
    status: ' '
  });

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  function handleTableWidthChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  //- 初始化
  async function onSearch(type?: string) {
    if (type === 'reload') pagination.currentPage = 1;
    try {
      loading.value = true;
      const requestUrl =
        urlType === 'query' ? 'tenantDepartmentQueryOne' : 'queryGuset';

      const res = await API[requestUrl]({
        ...removeEmptyStringKeys(form),
        id,
        pageSize: pagination.pageSize,
        pageNumber: pagination.currentPage
      });
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      pagination.total = res.data.total;
      dataList.length = 0;
      dataList.push(...res.data.list);
      urlType === 'setting' &&
        dataList.forEach(item => {
          item.roleId = '';
        });
    } catch (error) {
      loading.value = false;
    }
  }

  //- 移出部门
  const removeDepartment = (row: UserMangerAPI.tenantDepartmentQueryList) => {
    ElMessageBox.confirm(
      `<div>
       <p class="font-bold">${t('确定要将用户')}${row.name}${t(
        '移出部门{department}吗?',
        { department: row.deptName }
      )}</p>
      <p>${t('移出部门后该用户将被禁用。')}</p>
      </div>`,
      t('警告'),
      {
        confirmButtonText: t('确定'),
        cancelButtonText: t('取消'),
        type: 'warning',
        center: true,
        dangerouslyUseHTMLString: true
      }
    ).then(async () => {
      const res = await API.removeDeptAndRole({ userId: row.id });
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if (!res.code) onSearch();
    });
  };

  //- 查询部门用户
  const userStore = useUserStore();
  const querySubDeptWithoutSelf = async () => {
    const res = await API.querySubDeptWithoutSelf();
    if (res.code) return;
    if (userStore.userInfo.isAdmin === 1) {
      res.data = res.data[0].subNodeList;
    }
    departmentList.length = 0;
    departmentList.push(...res.data);
  };
  const subRoleList = async () => {
    const userStore = useUserStore();
    const res = await API.subRoleList(
      userStore.userInfo.isAdmin === 1
        ? {
            deptId: id
          }
        : {}
    );
    if (res.code) return;
    roleList.length = 0;
    roleList.push(...res.data);
  };

  //- 修改散户部门 + 修改角色
  const changeId = (
    id: number,
    row: UserMangerAPI.tenantDepartmentQueryList,
    type: 'dep' | 'role'
  ) => {
    if (type === 'dep') {
      row.depID = id;
    } else {
      row.roleID = id;
    }
  };

  //- 获取选定部门
  const depArr = reactive<UserMangerAPI.querySubDeptWithoutSelfData[]>([]);
  const filterDepName = (
    departmentList: UserMangerAPI.querySubDeptWithoutSelfData[]
  ) => {
    departmentList.forEach(item => {
      if (item.subNodeList.length) {
        filterDepName(item.subNodeList);
      }
      depArr.push(item);
    });
  };

  const confirmClick = async (row: UserMangerAPI.tenantDepartmentQueryList) => {
    if (row.deptName === '' || row.roleId === '') {
      return message(t('关联的部门或角色不能为空'), { type: 'error' });
    }
    depArr.length = 0;
    filterDepName(departmentList);
    const depName = depArr.find(item => item.id === row.depID)?.name;

    ElMessageBox.confirm(
      `
       <p class="font-bold">${t('确定要将用户')}${row.name}${t(
        '关联到部门{department}吗?',
        { department: depName }
      )}</p>
      `,
      t('警告'),
      {
        confirmButtonText: t('确定'),
        cancelButtonText: t('取消'),
        type: 'warning',
        center: true,
        dangerouslyUseHTMLString: true
      }
    ).then(async () => {
      const res = await API.updateDeptAndRole({
        userId: row.id,
        id: row.depID ? row.depID : +row.deptName,
        roleId: row.roleID ? row.roleID : +row.roleId
      });
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if (!res.code) onSearch();
    });
  };

  onMounted(async () => {
    await onSearch();
    if (urlType === 'setting') {
      querySubDeptWithoutSelf();
      subRoleList();
    }
  });

  return {
    loading,
    dataList,
    form,
    pagination,
    departmentList,
    roleList,
    confirmClick,
    changeId,
    onSearch,
    handleTableWidthChange,
    handleCurrentChange,
    removeDepartment
  };
}
