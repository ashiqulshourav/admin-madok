<template>
  <div class="pr-6">
    <el-form
      ref="ruleFormRef"
      :model="newFormInline"
      :rules="formRules"
      label-width="180px"
    >
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

      <el-form-item :label="t('联赛ID')" prop="leagueId">
        <el-input
          v-model="newFormInline.leagueId"
          clearable
          :placeholder="t('联赛ID')"
          :disabled="!!newFormInline.leagueId"
        />
      </el-form-item>

      <el-form-item :label="t('国家地区')" prop="countryId">
        <el-select
          v-model="newFormInline.countryId"
          filterable
          clearable
          :placeholder="t('请选择国家')"
        >
          <el-option
            v-for="item in matchStore.countryList"
            :key="item.countryId"
            :label="item.countryNameCn || item.countryNameEn"
            :value="item.countryId"
          />
        </el-select>
      </el-form-item>

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

      <el-form-item :label="t('联赛标签')" prop="leagueTagsId">
        <div v-bind:style="{ width: '100%' }">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
            >{{ t('全选') }}</el-checkbox
          >
        </div>
        <el-checkbox-group
          v-model="(newFormInline.leagueTagsId as any)"
          @change="handleCheckedTagIdsChange"
        >
          <el-checkbox
            v-for="tag in leagueTagsId"
            :key="tag.id"
            :value="tag.id"
            >{{ tag.text }}</el-checkbox
          >
        </el-checkbox-group>
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
import { FormProps } from './utils/types';
import { Plus } from '@element-plus/icons-vue';
import { t } from '@/plugins/i18n';
import { useMatchStore } from '@/store/match';
import { inputRestrictions } from '@/utils/formatNumber';
import { message } from '@/utils/message';
import { UploadFile } from 'element-plus';
const uploadFormFile = ref();
const loading = ref(false);
const matchStore = useMatchStore();
const leagueTagsId = reactive<ConfigCenterDataAPI.LeagueTagListFetchProps[]>(
  []
);

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    leagueNameCn: '',
    level: '',
    countryId: '',
    leagueNameEn: '',
    leagueId: '',
    leagueLogo: '',
    sportId: '',
    category: '',
    riskLevel: '',
    isEsportType: false,
    leagueTagsId: []
  })
});

const emits = defineEmits(['reloadTable', 'closeDialog']);
const updateVal = () => {
  ruleFormRef.value.validate(async (valid: any) => {
    if (valid) {
      const res = await API.updateLeague(
        props.formInline as MetadataAPI.updateLeagueParamsType
      );
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if (!res.code) emits('closeDialog', 'reload');
    }
  });
};

const onImgChange = (file: UploadFile) => {
  let name = file.name.slice(-3);
  let kb = 10000 * 1024;
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

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const imageUrl = ref<string>(newFormInline.value.leagueLogo as string);

const checkAll = ref(false);
const isIndeterminate = ref(true);

const handleCheckAllChange = (val: boolean) => {
  newFormInline.value.leagueTagsId = val
    ? leagueTagsId.map((item: any) => item.id)
    : [];
  isIndeterminate.value = false;
};
const handleCheckedTagIdsChange = (value: number[]) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === leagueTagsId.length;
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < leagueTagsId.length;
};

onMounted(() => {
  initLeaguetags();
});

const renderLevelList = computed(() => {
  const sportidMap = { 1: 0, 2: 1 };
  if (props.formInline.isEsportType) {
    return props.levelList.filter(item => item.game_type === 3);
  } else if (
    sportidMap[props.formInline.sportId as keyof typeof sportidMap] === 0 ||
    sportidMap[props.formInline.sportId as keyof typeof sportidMap] === 1
  ) {
    return props.levelList.filter(
      item =>
        item.game_type ===
        sportidMap[props.formInline.sportId as keyof typeof sportidMap]
    );
  } else {
    return props.levelList.filter(item => item.game_type === 2);
  }
});

//- 获取联赛列表标签
const initLeaguetags = async () => {
  const res = await API.getLeagueTagList({
    category: parseInt(newFormInline.value.category as string),
    sportId: parseInt(newFormInline.value.sportId)
  });
  leagueTagsId.length = 0;
  leagueTagsId.push(...res.data.list);
};

const cancelDialog = () => {
  emits('closeDialog');
};

const confirmBtnClick = () => {
  ruleFormRef.value.validate(async (valid: any) => {
    if (valid) {
      loading.value = true;
      if (uploadFormFile.value) {
        let formData = new FormData();
        formData.append('file', uploadFormFile.value);
        formData.append('fileUsageCategory', '3');
        const res = await API.fileUpload(formData);
        if (res.data?.url) {
          newFormInline.value.leagueLogo = res.data?.remoteFileName;
        }
      }
      updateLeague();
    }
  });
};

const updateLeague = async () => {
  const res = await API.updateLeague(newFormInline.value);
  message(res.msg, { type: res.code ? 'error' : 'success' });
  emits('closeDialog', !res.code && 'reload');
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
