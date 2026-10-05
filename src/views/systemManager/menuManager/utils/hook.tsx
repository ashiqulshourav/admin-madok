import { message } from '@/utils/message';
import editForm from '../form.vue';
import { columns } from '../component/TableColumnList';
import { addDialog, closeDialog } from '@/components/ReDialog';
import { ElMessageBox } from 'element-plus';
import { TableColumns } from '@pureadmin/table';

export function useMenuManagerHook() {
  const dataList = reactive<RoleAPI.ChildResourceList[]>([]);
  const loading = ref(true);
  const parentList = reactive<Partial<RoleAPI.ChildResourceList>[]>([]);

  //- 初始化
  const onSearch = async () => {
    try {
      loading.value = true;
      const res = await API.getAllResource();
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      dataList.length = 0;
      dataList.push(...res.data);
      filterParentList(dataList, '一级页面');
    } catch (error) {
      loading.value = false;
    }
  };

  const filterParentList = (
    list: RoleAPI.ChildResourceList[],
    parentName: string
  ) => {
    list.forEach((item: RoleAPI.ChildResourceList) => {
      if (item.childResourceList!.length > 0)
        filterParentList(
          item.childResourceList as RoleAPI.ChildResourceList[],
          item.name as string
        );
      if (item.type === 0 || item.type === 2 || item.type === 6) {
        parentList.push({
          id: item.id,
          name: item.name,
          enName: item.enName,
          tableName: parentName + '-' + item.name,
          childResourceList: item.childResourceList
        });
      }
    });
    list.sort(
      (a: RoleAPI.ChildResourceList, b: RoleAPI.ChildResourceList) =>
        +a.sort - +b.sort
    );
  };

  //- 删除菜单
  const delMenu = (id: string) => {
    ElMessageBox.confirm(t('确定要删除菜单么？'), t('警告'), {
      confirmButtonText: t('确认'),
      cancelButtonText: t('取消'),
      center: true
    })
      .then(async () => {
        const res = await API.menuDel({ id });
        message(res.msg, { type: res.code ? 'error' : 'success' });
        !res.code && onSearch();
      })
      .catch(e => {
        console.log(e);
      });
  };

  //- 菜单
  function openRoleDialog(title: string, row?: RoleAPI.ChildResourceList) {
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
            name: row?.name ?? '',
            enName: row?.enName ?? '',
            type: row?.type ?? '',
            parentId: row?.parentId ?? '',
            sort: row?.sort ?? '',
            path: row?.path ?? '',
            routerPath: row?.routerPath ?? ''
          },
          parentList: parentList,
          onCloseDialog: (closeType?: string) => {
            if (closeType) onSearch();
            closeDialog(options, index);
          }
        })
    });
  }

  const cellRowClick = (
    _row: RoleAPI.ChildResourceList,
    _column: TableColumns,
    e: PointerEvent
  ) => {
    const target = e.currentTarget as ElRef;
    const firstChild = target?.firstElementChild;
    if (firstChild) {
      const secondChild = firstChild.firstElementChild as ElRef;
      if (secondChild) {
        const thirdChild = secondChild.firstElementChild as ElRef;
        if (thirdChild) {
          if (thirdChild.tagName === 'DIV') {
            thirdChild.click();
          } else {
            const nextSibling = thirdChild.nextElementSibling as ElRef;
            if (nextSibling) {
              nextSibling.click();
            }
          }
        }
      }
    }
  };

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    columns,
    dataList,
    onSearch,
    openRoleDialog,
    cellRowClick,
    delMenu
  };
}
