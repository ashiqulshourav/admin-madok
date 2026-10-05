<template>
  <div class="pr-6">
    <el-form
      ref="ruleFormRef"
      :model="newFormInline"
      :rules="formRules"
      label-width="150px"
    >
      <el-form-item :label="`${t('球队Logo')}:`" prop="teamLogo">
        <el-upload
          action=""
          :auto-upload="false"
          class="avatar-uploader"
          :show-file-list="false"
          :on-change="onImgChange"
        >
          <img
            v-if="imageUrl"
            :src="imageUrl"
            class="max-h-[100px] max-w=[200px]"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item :label="`${t('队伍中文名称')}:`" prop="teamNameCn">
        <el-input
          v-model="newFormInline.teamNameCn"
          :placeholder="t('队伍中文名称')"
        />
      </el-form-item>

      <el-form-item :label="`${t('队伍英文名称')}:`" prop="teamNameEn">
        <el-input
          v-model="newFormInline.teamNameEn"
          :placeholder="t('队伍英文名称')"
        />
      </el-form-item>

      <el-form-item :label="`${t('联赛ID')}:`">
        <el-input
          disabled
          v-model="newFormInline.leagueId"
          :placeholder="t('联赛ID')"
        />
      </el-form-item>

      <el-form-item :label="`${t('主场名称')}:`">
        <el-input
          v-model="newFormInline.stadiumName"
          :placeholder="t('主场名称')"
        />
      </el-form-item>

      <el-form-item :label="`${t('国家地区')}:`" prop="countryId">
        <el-select
          v-model="newFormInline.countryId"
          filterable
          class="!w-[280px]"
          :placeholder="t('请选择国家')"
        >
          <el-option
            v-for="item in matchStore.countryList"
            :key="item.countryId"
            :label="item.countryNameCn"
            :value="item.countryId"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('热门排序')" prop="level">
        <el-input
          :formatter="v => inputRestrictions(v)"
          v-model="newFormInline.level"
          :placeholder="t('请输入1-200之间的数字')"
          type="number"
          clearable
          class="!w-[280px]"
        />
      </el-form-item>
    </el-form>
    <div class="flex justify-end">
      <el-button @click="cancelDialog">{{ t('取消') }}</el-button>
      <el-button :loading="loading" @click="confirmBtnClick" type="primary">{{
        t('确定')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { formRules } from './utils/rule';
import { TeamFormProps } from './utils/types';
import { Plus } from '@element-plus/icons-vue';
import { t } from '@/plugins/i18n';
import { useMatchStore } from '@/store/match';
import { inputRestrictions } from '@/utils/formatNumber';
import { message } from '@/utils/message';

const matchStore = useMatchStore();
const loading = ref(false);
const props = withDefaults(defineProps<TeamFormProps>(), {
  formInline: () => ({
    teamId: 0,
    countryId: 0,
    sportId: 0,
    leagueId: 0,
    teamNameCn: '',
    teamNameEn: '',
    teamLogo: '',
    isCountryTeam: 0,
    level: 0
  })
});
const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const emits = defineEmits(['closeDialog']);
const uploadFormFile = ref();
const cancelDialog = () => {
  emits('closeDialog');
};

const confirmBtnClick = () => {
  ruleFormRef.value.validate(async valid => {
    if (valid) {
      loading.value = true;
      if (uploadFormFile.value) {
        let formData = new FormData();
        formData.append('file', uploadFormFile.value);
        formData.append('fileUsageCategory', '3');
        const res = await API.esFileUpload(formData);
        if (res.data?.url) {
          newFormInline.value.teamLogo = res.data?.remoteFileName;
        }
      }
      updateTeam();
    }
  });
};

const updateTeam = async () => {
  try {
    const res = await API.updateETeam(newFormInline.value);
    loading.value = false;
    message(res.msg, { type: res.code ? 'error' : 'success' });
    emits('closeDialog', !res.code && 'reload');
  } catch (error) {
    loading.value = false;
  }
};

const imageUrl = ref<string>(props.formInline.teamLogo);
const onImgChange = file => {
  let name = file.name.slice(-3);
  let kb = 15360 * 1024;
  if (['png'].includes(name.toLowerCase())) {
    if (file.size > kb) {
      message(t('文件过大，请重新上传'), { type: 'error' });
    } else {
      uploadFormFile.value = file.raw;
      imageUrl.value = URL.createObjectURL(file.raw);
    }
  } else {
    message(t('上传文件格式不匹配,请上传png格式文件'), {
      type: 'error'
    });
  }
};
</script>

<style lang="scss">
.avatar-uploader {
  .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }
  .el-upload:hover {
    border-color: var(--el-color-primary);
  }
  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    text-align: center;
  }
}
</style>
