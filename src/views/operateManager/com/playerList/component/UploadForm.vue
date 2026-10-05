<template>
  <el-steps
    class="w-full mt-3"
    :active="active"
    finish-status="success"
    v-if="active == 0 || active == 1"
  >
    <el-step title="上传文件" />
    <el-step title="数据预览" />
    <el-step title="导入完成" />
  </el-steps>

  <!-- 0 -->
  <div v-if="active == 0">
    <!-- download excel -->
    <div class="rounded my-5 border border-gray-300 flex">
      <div class="w-[100px] flex justify-center items-center bg-gray-100">
        <el-icon><Files /></el-icon>
      </div>
      <div class="p-5">
        <p class="font-bold mb-3">
          {{ t('填写导入数据信息') }}
        </p>
        <p class="text-gray-500">
          {{
            t(
              '请按照数据模板的格式准备导入数据，模板中的表头名称不可更改，表头行不能删除'
            )
          }}
        </p>
        <p class="text-blue-600 cursor-pointer" @click="downloadTemplate">
          {{ t('下载模板') }}
        </p>
      </div>
    </div>
    <!-- upload excel -->
    <el-upload
      action=""
      :auto-upload="false"
      :show-file-list="false"
      :on-change="onFileChange"
    >
      <div class="rounded my-5 border border-gray-300 flex cursor-pointer">
        <div class="w-[100px] flex justify-center items-center bg-gray-100">
          <el-icon><Files /></el-icon>
        </div>
        <div class="p-5">
          <p class="font-bold mb-3">{{ t('上传填好的信息表') }}</p>
          <p class="text-gray-500">
            {{
              t(
                '文件后缀名必须为xls 或xlsx （即Excel格式），文件大小不得大于10M，最多支持导入30000条数据'
              )
            }}
          </p>
          <p class="text-blue-600" v-if="!uploadFormFile">
            {{ t('上传文件') }}
          </p>
          <div class="flex gap-2" v-else>
            <p class="text-blue-600">
              {{ uploadFormFile.name }}
            </p>
            <p class="text-gray-400">
              ({{ Math.abs(uploadFormFile.size / 1024).toFixed(0) }} KB)
            </p>
          </div>
        </div>
      </div>
    </el-upload>   
  </div>
  <!-- 1 -->
    <!-- excel error -->
    <div class="rounded my-5 border border-gray-300 flex" v-if="active == 1 && errorMsg.length">
      <div class="w-[100px] flex justify-center items-center bg-gray-100">
        <el-icon><Files /></el-icon>
      </div>
      <div class="p-5">
        <p class="font-bold mb-3">
          {{ t('正常数量条数: ') }}
          <span class="text-green-500">{{ t(`${successNum}条`) }}</span>
        </p>
        <p class="font-bold">
          {{ t('异常数量条数: ') }}
          <span class="text-red-500">{{ t(`${errorNum}条`) }}</span>
        </p>
      </div>
    </div>
   <div class="rounded flex-col my-5 border border-gray-300 flex p-5 bg-[#f9f9f9]" v-if="active == 1 && errorMsg.length">
    <div class="font-bold mb-3">
      {{ t('异常提示： ') }}
    </div>
    <div class="text-gray-500">
      <div v-for="(text, idx) in errorMsg" :key="idx" class="mb-3">
        {{ text }}
      </div>
    </div>
  </div>
  <div v-if="active == 1 && !errorMsg.length">
    <!-- Data preview -->
    <pure-table
      class="my-5"
      height="400"
      align-whole="center"
      table-layout="auto"
      border
      stripe
      :data="users"
      :columns="userColumns"
      :header-cell-style="tableHeaderStyle"
    >
     <template #userid="{ row }">
      {{row.userid}}
     </template>
  </pure-table>
  </div>
  <!-- 3 -->
  <div v-if="active == 2">
    <el-result
      icon="success"
      :title="t('数据导入完成')"
      :sub-title="t(`您已成功导入${users.length}条数据`)"
    >
    </el-result>
  </div>

  <!-- Note -->
  <div
    v-if="active == 0"
    class="flex items-center rounded bg-[#fff5e6] mt-5 h-[80px] px-[15px] gap-3"
  >
    <div>
      <el-icon size="30" color="orange"><WarningFilled /></el-icon>
    </div>
    <div>
      <p class="font-bold">{{ t('特别提示') }}</p>
      <p class="text-gray-500">
        {{
          t(
            '导入过程中采用增量更新方式，即导入的标签和现有匹配，没有这个标签就会添加，已经有但是导入的没有就会删除'
          )
        }}
      </p>
    </div>
  </div>

  <div class="flex justify-end mt-10" v-if="active == 0 || active == 1">
    <el-button v-if="active != 0" @click="previous">{{
      errorMsg.length ? t('重新上传') : t('上一步')
    }}</el-button>
    <el-button type="primary" @click="next">{{ t('下一步') }}</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { t } from '@/plugins/i18n';
import { Files } from '@element-plus/icons-vue';
import { WarningFilled } from '@element-plus/icons-vue';
import { UploadFile } from 'element-plus';
import { message } from '@/utils/message';
import { utils, write } from 'xlsx';
import { userColumns } from './TableColumnList';
import { usePublicHooks } from '@/hooks';

const { tableHeaderStyle } = usePublicHooks();

const active = ref(0);
const uploadFormFile = ref(); 
const successNum = ref(0);
const errorNum = ref(0);
const errorMsg = ref<string[]>([]);
const users = reactive<any[]>([]);

const next = async () => {
  if (uploadFormFile.value) {
    if (active.value == 0) {
      users.length = 0;
      let formData = new FormData();
      formData.append('file', uploadFormFile.value);
      const res = await API.operateUpload(formData);

      if (res.code) {
        message(res.msg, { type: 'error' });
      } else {        
        users.push(...res.data);
        console.log({users})
        active.value = 1;
        return;
      }
    }
    if (active.value == 1) {
      const res = await API.operateImportExcel({
        userLabelListExcels: [...users]
      });

      if (!res.data.errorMsg) {
        active.value = 2;
        return;
      } else {

        const sentences = res.data.errorMsg.split('\n');
        errorMsg.value = [...sentences];
        successNum.value = res.data.successNum;
        errorNum.value = res.data.errorNum;
      }
      return;
    }
  }
};

const previous = () => {
  if (active.value != 0) {
    active.value--;
  }
  if (active.value != 1) {
    errorMsg.value = [];
  }
};

const onFileChange = async (file: UploadFile) => {
  let name = file.name;
  let kb = 10000 * 1024;
  if (['xls', 'xlsx'].includes(name.toLowerCase().split('.').pop() as string)) {
    if ((file.size as number) > kb) {
      message(t('文件过大，请重新上传'), { type: 'error' });
    } else {
      uploadFormFile.value = file.raw;
    }
  } else {
    message(t('上传文件格式不匹配,请上传excel格式文件'), {
      type: 'error'
    });
  }
};

const downloadTemplate = async () => {
  const data = [
    ['用户ID', '风控标签', '属性标签'],
    ['1', '套利,水军', '老用户,高活跃']
  ];
  // Create a workbook and worksheet
  const ws = utils.aoa_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Sheet1');
  // Generate a Blob object containing the Excel file
  const wbout = write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  // Create a link element, hide it, direct it towards the blob, and then 'click' it programatically
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = 'example.xlsx';
  a.click();
  window.URL.revokeObjectURL(url);
};
</script>

<style lang="scss"></style>
