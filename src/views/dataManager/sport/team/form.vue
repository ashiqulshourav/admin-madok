<template>
  <div>
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

      <el-form-item :label="t('国家地区')" prop="countryId">
        <el-select
          v-model="newFormInline.countryId"
          filterable
          class="!w-[280px]"
          :placeholder="t('请选择国家')"
          clearable
        >
          <el-option
            v-for="item in matchStore.countryList"
            :key="item.countryId"
            :label="item.countryNameCn"
            :value="item.countryId"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="`${t('是否国家队')}:`" prop="isCountryTeam">
        <el-select
          v-model="newFormInline.isCountryTeam"
          :placeholder="t('请选择')"
          class="!w-[150px]"
        >
          <el-option :label="t('是')" :value="0" />
          <el-option :label="t('否')" :value="1" />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('热门排序')" prop="level">
        <el-input
          :formatter="v => inputRestrictions(v)"
          v-model="newFormInline.level"
          :placeholder="t('请输入1-200之间的数字')"
          type="number"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>

      <el-form-item label="赛种" prop="sportId">
        <el-select
          v-model="newFormInline.sportId"
          :placeholder="t('赛种')"
          class="!w-[150px]"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in SPORT_ID_MAP"
            :key="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="`${t('球队中文名称')}:`" prop="teamNameCn">
        <el-input
          v-model="newFormInline.teamNameCn"
          :placeholder="t('球队中文名称')"
        />
      </el-form-item>

      <el-form-item :label="`${t('球队英文名称')}:`" prop="teamNameEn">
        <el-input
          v-model="newFormInline.teamNameEn"
          :placeholder="t('球队英文名称')"
        />
      </el-form-item>

      <el-form-item :label="`${t('主场名称')}:`" prop="stadiumName">
        <el-input
          v-model="newFormInline.stadiumName"
          maxLength="30"
          :placeholder="t('主场名称')"
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
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';
import { inputRestrictions } from '@/utils/formatNumber';
import { useMatchStore } from '@/store/match';
import { message } from '@/utils/message';

const matchStore = useMatchStore();
const uploadFormFile = ref();
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

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const emits = defineEmits(['closeDialog']);
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
        const res = await API.fileUpload(formData);
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
    const res = await API.updateTeam(newFormInline.value);
    loading.value = false;
    message(res.msg, { type: res.code ? 'error' : 'success' });
    emits('closeDialog', !res.code && 'reload');
  } catch (error) {
    loading.value = false;
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
