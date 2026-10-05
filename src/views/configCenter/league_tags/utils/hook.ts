import editForm from '../form.vue';
import { message } from '@/utils/message';
import { FormItemProps } from 'element-plus';
import { addDialog } from '@/components/ReDialog';
import type { PaginationProps } from '@pureadmin/table';
import { reactive, ref, onMounted, h } from 'vue';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { searchFormType } from './types';
import { ElMessage, ElMessageBox } from 'element-plus';
import { t } from '@/plugins/i18n';
import { Delete } from '@element-plus/icons-vue';

export function useLeagueTagsHook() {
  const formRef = ref();
  const dataList = reactive<ConfigCenterDataAPI.LeagueTagType[]>([]);
  const loading = ref(true);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const form = reactive<searchFormType>({
    text: '',
    sportId: 1,
    category: 0
  });

  function handleDelete(row) {
    ElMessageBox.confirm(
      h('p', `是否删除${row.text}标签，一旦被删除将无法恢复`),
      t('标签分类'),
      {
        showCancelButton: true,
        cancelButtonText: t('取消'),
        confirmButtonText: t('确认'),
        type: 'warning',
        icon: markRaw(Delete),
        center: true,
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '删除中...';
            const response = await API.deleteLeagueTag(row);
            const {
              data
            }: { data: ConfigCenterDataAPI.LeagueTagType[] | null } = response;
            if (data && data.length > 0) {
              ElMessageBox.confirm(
                h('div', null, [
                  h('div', null, `目前标签${row.text}相关联赛有：`),
                  ...data.map(item =>
                    h('div', { style: 'color: teal' }, item.leagueNameCn)
                  ),
                  h('div', null, '请取消标签相关联赛')
                ]),
                t('标签分类'),
                {
                  showCancelButton: true,
                  cancelButtonText: t('取消'),
                  confirmButtonText: t('确认'),
                  type: 'warning',
                  icon: markRaw(Delete),
                  center: true,
                  beforeClose: async (action2, instance2, done2) => {
                    if (action2 === 'confirm') {
                      instance2.confirmButtonLoading = true;
                      instance2.confirmButtonText = '删除中...';
                      await API.bulkDeleteLeagueTag(data.map(item => item.id));
                      await API.deleteLeagueTag(row);
                      done2();
                      setTimeout(() => {
                        instance2.confirmButtonLoading = false;
                      }, 300);
                      ElMessage({
                        type: 'success',
                        message: `${row.text}标签成功删除`
                      });
                      onSearch();
                    } else {
                      done2();
                    }
                  }
                }
              );
              done();
              setTimeout(() => {
                instance.confirmButtonLoading = false;
              }, 300);
            } else {
              done();
              ElMessage({
                type: 'success',
                message: `${row.text}标签成功删除`
              });
              onSearch();
            }
          } else {
            done();
          }
        }
      }
    );
  }
  function handleTableWidthChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    console.log('handleSelectionChange', val);
  }

  async function onSearch(type?: string) {
    if (type === 'reload') pagination.currentPage = 1;
    try {
      loading.value = true;
      const res: ConfigCenterDataAPI.ListLeagueTagRes =
        await API.getLeagueTagList({
          ...removeEmptyStringKeys(form),
          pageSize: pagination.pageSize,
          pageNum: pagination.currentPage
        });
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      dataList.length = 0;
      dataList.push(...res.data.list);
      pagination.total = res.data.total;
      pagination.pageSize = res.data.pageSize;
    } catch (error) {
      loading.value = false;
    }
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  function openDialog(title: string, row?: ConfigCenterDataAPI.LeagueTagType) {
    addDialog({
      title,
      props: {
        formInline: {
          category: row?.category ?? undefined,
          sportId: row?.sportId ?? undefined,
          text: row?.text ?? ''
        }
      },
      width: '40%',
      draggable: true,
      fullscreenIcon: true,
      alignCenter: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (
        done,
        { options },
        okButtonLoading = null,
        okButtonText = null
      ) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          // message(`您${title}了角色名称为${curData.name}的这条数据`, {
          //   type: "success"
          // });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            if (row) {
              updateLeagueTag(
                { ...curData, id: row.id },
                () => chores(),
                okButtonLoading,
                okButtonText
              );
            } else {
              // 实际开发先调用编辑接口，再进行下面操作
              // chores();
              createLeagueTag(
                { ...curData },
                () => chores(),
                okButtonLoading,
                okButtonText
              );
            }
          }
        });
      }
    });
  }

  const updateLeagueTag = async (
    curData,
    cb,
    okButtonLoading,
    okButtonText
  ) => {
    if (okButtonLoading) okButtonLoading.value = true;
    if (okButtonText) okButtonText.value = t('编辑中');
    const res = await API.updateLeagueTag(curData);
    setTimeout(() => {
      if (okButtonLoading) okButtonLoading.value = false;
      if (okButtonText) okButtonText.value = t('确定');
      if (!res.code) cb();
    }, 300);
    message(res.msg, { type: res.code ? 'error' : 'success' });
  };

  const createLeagueTag = async (
    curData,
    cb,
    okButtonLoading,
    okButtonText
  ) => {
    if (okButtonLoading) okButtonLoading.value = true;
    if (okButtonText) okButtonText.value = t('创建中');
    const res = await API.createLeagueTag([curData]);
    setTimeout(() => {
      if (okButtonLoading) okButtonLoading.value = false;
      if (okButtonText) okButtonText.value = t('确定');
      if (!res.code) cb();
    }, 300);

    message(res.msg, { type: res.code ? 'error' : 'success' });
  };

  // onMounted(() => {
  //   onSearch();
  // });

  return {
    loading,
    dataList,
    pagination,
    onSearch,
    resetForm,
    openDialog,
    form,
    handleDelete,
    handleTableWidthChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
