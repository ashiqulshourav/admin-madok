<template>
  <div>
    <el-form
      ref="ruleFormRef"
      :model="newFormInline"
      :rules="formRules"
      label-width="150px"
    >
      <el-form-item :label="t('联赛ID')" prop="leagueId">
        <el-input
          v-model="newFormInline.leagueId"
          clearable
          :placeholder="t('联赛ID')"
          :disabled="!!newFormInline.leagueId"
        />
      </el-form-item>

      <el-form-item :label="`${t('联赛Logo')}:`">
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
          clearable
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

      <!-- <el-form-item :label="t('188数据源联赛杯赛')" prop="leagueId188Bet">
      <el-input
        v-model="newFormInline.leagueId188Bet"
        :placeholder="t('188数据源联赛杯赛')"
      />
    </el-form-item> -->
      <el-form-item :label="t('联赛杯赛中文名')" prop="leagueNameCn">
        <el-input
          v-model="newFormInline.leagueNameCn"
          maxLength="35"
          :placeholder="t('联赛杯赛中文名')"
        />
      </el-form-item>
      <el-form-item :label="t('联赛杯英文名称')" prop="leagueNameEn">
        <el-input
          v-model="newFormInline.leagueNameEn"
          :placeholder="t('联赛杯英文名称')"
          maxLength="35"
        />
      </el-form-item>
      <el-form-item :label="t('热门排序')" prop="level">
        <el-input
          :formatter="(v:string) => inputRestrictions(v)"
          v-model="newFormInline.level"
          :placeholder="t('请输入1-200之间的数字')"
          type="number"
          clearable
          class="!w-[200px]"
          v-enter="updateVal"
        />
      </el-form-item>

      <el-form-item :label="t('联赛等级')" prop="riskLevel">
        <el-select
          v-model="newFormInline.riskLevel"
          filterable
          clearable
          :placeholder="t('请选择联赛等级')"
        >
          <el-option
            v-for="item in renderLevelList"
            :key="item.league_level"
            :label="item.league_level < 0 ? t('未评级') : item.league_level"
            :value="item.league_level"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="赛种" prop="sportId">
      <el-select v-model="newFormInline.sportId" :placeholder="t('赛种')">
        <el-option
          :label="item.label"
          :value="item.value"
          v-for="item in SPORT_ID_MAP"
          :key="item.value"
        />
      </el-select>
    </el-form-item> -->
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
import { FormProps } from './utils/types';
// import type { UploadProps } from 'element-plus';
// import { Plus } from '@element-plus/icons-vue';
import { t } from '@/plugins/i18n';
// import { SPORT_ID_MAP } from '@/utils/maps/sports_map';
// import { useMatchStore } from '@/store/match';
import { inputRestrictions } from '@/utils/formatNumber';
import { message } from '@/utils/message';
import { Plus } from '@element-plus/icons-vue';
import { UploadFile } from 'element-plus';

const loading = ref(false);
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    leagueNameCn: '',
    level: '',
    countryId: '',
    leagueNameEn: '',
    leagueId: '',
    leagueLogo: '',
    // leagueId188Bet: '',
    sportId: ''
  })
});

const uploadFormFile = ref();
const emits = defineEmits(['closeDialog']);
const updateVal = () => {
  ruleFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const res = await API.updateLeague(
        props.formInline as MetadataAPI.updateLeagueParamsType
      );
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if (!res.code) emits('closeDialog', 'reload');
    }
  });
};

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const imageUrl = ref<string>(newFormInline.value.leagueLogo as string);

const onImgChange = (file: UploadFile) => {
  let name = file.name.slice(-3);
  let kb = 15360 * 1024;
  if (['png'].includes(name.toLowerCase())) {
    if ((file.size as number) > kb) {
      message(t('文件过大，请重新上传'), { type: 'error' });
    } else {
      uploadFormFile.value = file.raw;
      imageUrl.value = URL.createObjectURL(file.raw as Blob | MediaSource);
    }
  } else {
    message(t('上传文件格式不匹配,请上传png格式文件'), {
      type: 'error'
    });
  }
};

const confirmBtnClick = () => {
  ruleFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true;
      if (uploadFormFile.value) {
        let formData = new FormData();
        formData.append('file', uploadFormFile.value);
        formData.append('fileUsageCategory', '3');
        const res = await API.esFileUpload(formData);
        if (res.data?.url) {
          newFormInline.value.leagueLogo = res.data?.remoteFileName;
        }
      }
      updateEMatch();
    }
  });
};

const updateEMatch = async () => {
  const res = await API.updateEMatch(newFormInline.value);
  message(res.msg, { type: res.code ? 'error' : 'success' });
  emits('closeDialog', !res.code && 'reload');
};

const cancelDialog = () => {
  emits('closeDialog');
};

const renderLevelList = computed(() => {
  return props.levelList.filter(item => item.game_type === 3);
});
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
