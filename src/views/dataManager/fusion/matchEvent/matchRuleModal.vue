<template>
  <div class="mx-6">
    <div class="text-left text-lg font-bold">
      {{ t('如果数据源的主客队位置相反，可以勾选开启主客队调换') }}
    </div>
    <div class="text-left text-m">
      <el-checkbox v-model="props.matchSource.pandaOppositeStatus" :true-value="1" :false-value="0">
        {{ t('主客队对调') }}
      </el-checkbox>
    </div>
  </div>
  <div class="flex justify-end mt-16">
    <el-button @click="closeDialog">{{ t('取消') }}</el-button>
    <el-button type="primary" @click="onMatchingRule">{{ t('确定') }}</el-button>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { matchCombineHook } from './utils/hook';

const props = withDefaults(defineProps<{
  matchSource: MatchCombineAPI.matchSourceDetail,
  matchSourcePair: MatchCombineAPI.matchSourceDetail,
}>(), {});
// const oppositeStatus = ref(props.matchSource.pandaOppositeStatus)
// console.log(1111111111, oppositeStatus.value)

const {
  handleMatchRule,
} = matchCombineHook();

const emits = defineEmits(['closeDialog']);

const onMatchingRule = () => {
  handleMatchRule(props.matchSource.matchId, props.matchSourcePair.matchId, props.matchSource.pandaOppositeStatus)
  emits('closeDialog');
}

const closeDialog = () => {
  emits('closeDialog');
};
</script>
