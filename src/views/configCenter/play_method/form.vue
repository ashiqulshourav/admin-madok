<template>
  <div>
    <div class="mb-4">
      <div class="flex mb-2">
        <span>{{ leagueName }}</span>
        <span class="ml-3">{{ beginTime }}</span>
      </div>
      <div class="flex">
        <span>{{ homeName }}</span>
        <span class="mr-1 ml-1 font-bold">VS</span>
        <span>{{ awayName }}</span>
      </div>
    </div>
    <el-card class="classify_card">
      <el-collapse class="collapse_paly" v-model="activeName">
        <el-collapse-item
          :title="item.configValue"
          :name="(index + 1).toString()"
          v-for="(item, index) in dataList"
          :key="index"
        >
          <div>
            <div class="flex items-center">
              <span class="mr-3">{{ t('玩法分类设定(多选)') }}</span>
              <el-checkbox
                v-model="item.checkAll"
                @change="handleCheckAllChange(item, item.configMap)"
                >{{ t('全选') }}</el-checkbox
              >
            </div>
            <el-checkbox-group
              v-model="item.configCodes"
              @change="value => checkItemClick(item, value)"
            >
              <el-checkbox
                v-for="(d, i) in Object.entries(item.configMap)"
                :key="i"
                :value="d[0]"
                :label="d[0]"
                >{{ d[0].split('|')[1] }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
    <div class="flex justify-end mt-4">
      <el-button @click="closeDialog">{{ t('取消') }}</el-button>
      <el-button
        :loading="btnLoading"
        type="primary"
        @click="addPalyMethodType"
        >{{ t('确认') }}</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { message } from '@/utils/message';
import { t } from '@/plugins/i18n';
import { CheckboxValueType } from 'element-plus/es/components/checkbox/src/checkbox';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';

const props = defineProps<{
  sportId: number;
  matchId: number;
  leagueName: string;
  beginTime: string;
  homeName: string;
  awayName: string;
}>();

const activeName = ref('1');
const dataList = reactive<PLayMethodAPI.getKindsCodebyMatchIdData[]>([]);
const btnLoading = ref(false);

onMounted(() => {
  initMethodList();
});

const handleCheckAllChange = (item, list: string[]) => {
  item.configCodes.length = 0;
  if (item.checkAll) {
    item.configCodes.push(...Object.keys(list));
  }
};

const emits = defineEmits(['closeDialog']);
const closeDialog = () => {
  emits('closeDialog');
};

const checkItemClick = (item, value: CheckboxValueType[]) => {
  item.checkAll = value.length === Object.keys(item.configMap).length;
};

const initMethodList = async () => {
  const res = await API.getKindsCodeByMatchId(props);
  if (res.code) return message(res.msg, { type: 'error' });
  res.data.forEach(item => {
    item.checkAll = Object.values(item.configMap).every(_ => +_ > 0);
    item.configCodes = [];
    item.configCodes.push(
      ...Object.entries(item.configMap)
        .filter(item => +item[1] > 0)
        .map(_ => _[0])
    );
  });
  dataList.length = 0;
  dataList.push(...res.data);
};

//- 修改玩法内容列表
const addPalyMethodType = async () => {
  btnLoading.value = true;
  const params = {
    sportId: props.sportId,
    matchId: props.matchId,
    sportName: SPORT_ID_MAP.find(_ => _.value === props.sportId).label,
    kindsCodeList: dataList.map(item => {
      return {
        configValue: item.configValue,
        configCodes: item.configCodes.map(item => item.split('|')[0])
      };
    })
  };
  const res = await API.configKindsCode(params);
  if (res.code) {
    return message(res.msg, { type: 'error' });
  } else {
    message(res.msg, { type: 'success' });
    closeDialog();
  }
};
</script>

<style lang="scss">
.collapse_paly {
  border: none;
}

.el-card.is-always-shadow {
  box-shadow: none;
}
.classify_card {
  .el-card__body {
    max-height: 600px;
    overflow-y: auto;
  }
}
</style>
