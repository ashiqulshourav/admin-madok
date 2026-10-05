import { message } from '@/utils/message';

import type { PaginationProps } from '@pureadmin/table';
import { reactive, ref, onMounted } from 'vue';
import { searchFormType } from './types';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import {ElMessageBox} from "element-plus";
import { type FormInstance } from 'element-plus';
import {t} from "@/plugins/i18n";
export function useTaskCenter() {
  const dataList = reactive<TaskCenterAPI.ListItem[]>([]);
  const loading = ref(true);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 20,
    currentPage: 1,
    background: true
  });

  const form = reactive<searchFormType>({
    fileName: ''
  });
  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }
  function handlePageSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  //- 初始化
  async function onSearch(type?: string) {
    if (type === 'reload') pagination.currentPage = 1;
    try {
      loading.value = true;
      const res = await API.taskList({
        ...removeEmptyStringKeys(form),
        pageSize: pagination.pageSize,
        pageNum: pagination.currentPage
      });
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      dataList.length = 0;
      dataList.push(...res.data.records);
      pagination.total = res.data.total;
    } catch (error) {
      loading.value = false;
    }
  }

  const resetForm = (formEl:FormInstance) => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };
  const handleDelete = (id:number) => {
    ElMessageBox.confirm(t('确定删除任务？删除后不可复原'), t('警告'), {
      center: true,
      type: 'warning'
    }).then(async () => {
      API.deleteTask({ id: id }).then(res => {
        message(res.msg, { type: res.code === 0 ? 'success' : 'error' });
        if (res.code === 0) {
          onSearch();
        }
      });
    });
  };

  const getDownLoadUrl = (id:number)=>{
    API.getDownLoadUrl({ id: id }).then(res => {
      if(res.code === 0  ){
        if (!res.data) {
          message(t('下载失败'), { type: 'error' });
        }
        const downloadDom = document.createElement('a');
        downloadDom.href = res.data;
        // downloadDom.download=fileName //--不是必须 若需要【前端重命名文件夹】的话这句代码就需要
        document.body.appendChild(downloadDom);
        downloadDom.click();
        document.body.removeChild(downloadDom);
      }else {
        message(res.msg, { type: 'error' });
      }
    });
  }
  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    dataList,
    pagination,
    onSearch,
    resetForm,
    form,
    handleCurrentChange,
    handleDelete,
    getDownLoadUrl,
    handlePageSizeChange
  };
}
