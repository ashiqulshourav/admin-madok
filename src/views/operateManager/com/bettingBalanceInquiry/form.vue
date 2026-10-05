<template>
  <div class="pl-10">
    <div
      class="flex flex-start item-center border-t-[1px] border-solid border-[#dcdfe6] dark:border-[#303030] pt-2 mb-5"
    >
      <div class="flex flex-col items-center mr-20">
        <span class="font-bold text-[16px]">{{ t('用户名') }}</span>
        <span>{{ newFormInline.name }}</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="font-bold text-[16px]">{{ t('用户ID') }}</span>
        <span>{{ newFormInline.id }}</span>
      </div>
    </div>

    <el-form
      ref="ruleFormRef"
      :model="newFormInline"
      :rules="formRules"
      class="pr-10"
      label-position="top"
      label-width="100px"
    >
      <el-form-item :label="`${t('风控措施')}:`" prop="isFreeze">
        <span>{{ t('账号启用') }}：</span>
        <el-switch
          v-model="newFormInline.isFreeze"
          inline-prompt
          class="pure-datatheme"
          @change="changeFree"
        />
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item :label="t('限额设置')" prop="type">
            <el-select v-model="newFormInline.limitLevel" clearable>
              <el-option
                v-for="item in limitList"
                :key="item.levelLimit"
                :label="item.levelLimit"
                :value="item.levelLimit"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <pure-table
            maxHeight="500"
            align-whole="center"
            size="small"
            border
            :data="tableData"
            :columns="columns"
            :header-cell-style="tableHeaderStyleBlue"
          >
          </pure-table>
        </el-col>
      </el-row>

      <div class="font-bold text-[18px] mb-5">{{ t('特殊限额') }}</div>

      <div class="flex item-center">
        <el-form-item :label="`${t('单注限额')}:`" prop="isFreeze" class="mr-4">
          <el-input
            v-model="newFormInline.singleBetLimit"
            :formatter="v => formatNumber(v, 13)"
          />
        </el-form-item>
        <el-form-item :label="`${t('单注赔付限额')}:`" prop="isFreeze">
          <el-input
            v-model="newFormInline.singleEventCompensationLimit"
            :formatter="v => formatNumber(v, 13)"
          />
        </el-form-item>
      </div>

      <el-form-item :label="`${t('备注')}:`" prop="remark">
        <el-input
          v-model="newFormInline.remark"
          type="textarea"
          clearable
          :placeholder="t('只能输入255个字符的内容')"
        />
      </el-form-item>

      <div class="flex justify-end">
        <el-button @click="closeDialog">{{ t('取消') }}</el-button>
        <el-button type="primary" @click="confirmClick">{{
          t('提交')
        }}</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { formRules } from './utils/rule';
import { t } from '@/plugins/i18n';
import { FormInstance } from 'element-plus';
import { message } from '@/utils/message';
import { usePublicHooks } from '@/hooks';
import { formatNumber } from '@/utils/formatNumber';
import { ElMessageBox } from 'element-plus';

const { tableHeaderStyleBlue } = usePublicHooks();

const limitList = reactive<UserAPI.UserLevelLimitListRes[]>([]);

const props = defineProps<{
  row: {
    id: number | string;
    name: string;
  };
}>();

const emits = defineEmits(['closeDialog']);

const ruleFormRef = ref<FormInstance>();
const newFormInline = reactive({
  ...props.row
});

const columns: TableColumnList = [
  {
    label: t('单注限额'),
    prop: 'productAmountTotalLimit'
  },
  {
    label: t('单注赔付'),
    prop: 'maxWinAmountLimit'
  },
  {
    label: t('单场赛事赔付'),
    prop: 'userSingleGamePay'
  },
  {
    label: t('单关单日累计赔付'),
    prop: 'singleMatchPay'
  },
  {
    label: t('串关单日累计赔付'),
    prop: 'bunchMatchPay'
  },
  {
    label: t('冠军单日累计赔付'),
    prop: 'championDailyPay'
  }
];

const closeDialog = () => {
  emits('closeDialog');
};

onMounted(() => {
  initLimitList();
});

const tableData = computed(() => {
  return limitList.filter(item => item.levelLimit === newFormInline.limitLevel);
});

const initLimitList = async () => {
  const res = await API.getUserLevelLimitList({ type: 0 });
  limitList.length = 0;
  limitList.push(...res.data);
};

const changeFree = v => {
  newFormInline.isFreeze = v;
};

//- 提交修改内容
const confirmClick = () => {
  ElMessageBox.confirm(t('确定要修改用户限额么？'), t('警告'), {
    type: 'warning',
    center: true
  }).then(async () => {
    !newFormInline.singleBetLimit && (newFormInline.singleBetLimit = null);
    !newFormInline.singleEventCompensationLimit &&
      (newFormInline.singleEventCompensationLimit = null);

    newFormInline.isFreeze = +!newFormInline.isFreeze;

    const res = await API.operateUpdateUser(newFormInline);
    message(res.msg, { type: res.code ? 'error' : 'success' });
    emits('closeDialog', res.code ? '' : 'reloadTable');
  });
};
</script>

<style lang="scss"></style>
