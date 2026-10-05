import editForm from '../form.vue';
import { message } from '@/utils/message';
import { addDialog, closeDialog } from '@/components/ReDialog';
import { reactive, ref, onMounted, h } from 'vue';
import { columns } from '../component/TableColumnList';
import { SearchFormType } from './types';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';
import { ElMessageBox } from 'element-plus';

export function useClassifySettingHook() {
  const dataList = reactive<PLayMethodAPI.getKindsCodeList[]>([]);
  const loading = ref(true);

  const searchForm = reactive<SearchFormType>({
    sportId: 1
  });

  function handleTableWidthChange() {
    onSearch();
  }

  function handleSelectionChange() {}

  //- 初始化
  async function onSearch() {
    loading.value = true;
    const res = await API.getKindsCodeList({
      ...searchForm
    });
    loading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    dataList.length = 0;
    dataList.push(...res.data);
    (
      document.querySelector(
        '.table_container .el-scrollbar__wrap'
      ) as HTMLDivElement
    ).scroll(0, 0);
  }

  //- 删除分类
  const deleteTag = (row: PLayMethodAPI.getKindsCodeList) => {
    ElMessageBox.confirm(t('确定要删除当前分类么?'), t('警告'), {
      showCancelButton: true,
      cancelButtonText: t('取消'),
      confirmButtonText: t('确认'),
      type: 'warning',
      center: true
    }).then(async () => {
      const res = await API.deleteKindsCode({
        configValue: row.configValue,
        sportName:
          SPORT_ID_MAP.find(item => item.value === row.sportId)?.label ?? '-',
        id: row.id
      });
      message(res.msg, { type: res.code ? 'error' : 'success' });
      onSearch();
    });
  };

  //- 新增修改弹窗
  function openDialog(title: string, row?: PLayMethodAPI.getKindsCodeList) {
    addDialog({
      title,
      width: '30%',
      closeOnClickModal: false,
      center: true,
      hideFooter: true,
      contentRenderer: ({ options, index }) =>
        h(editForm, {
          form: {
            sportId: searchForm.sportId,
            sportName:
              SPORT_ID_MAP.find(item => item.value === searchForm.sportId)
                ?.label ?? '-',
            id: row?.id ?? '',
            configValue: row?.configValue ?? '',
            tags: row?.tags ?? [],
            sort: row?.sort ?? ''
          },
          onCloseDialog: (type?: string) => {
            closeDialog(options, index);
            type && onSearch();
          }
        })
    });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    columns,
    dataList,
    onSearch,
    openDialog,
    handleTableWidthChange,
    handleSelectionChange,
    searchForm,
    deleteTag
  };
}
