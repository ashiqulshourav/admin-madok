<template>
  <div
    @mouseleave="showNum = true"
    class="w-1/4 text-center input_wrapper relative h-full input_container"
  >
    <div
      @mouseenter="toggleShowNum('enter')"
      v-show="showNum"
      :class="[
        'text-[--el-color-primary] justify-end h-full flex items-center w-[45px]',
        saleStatus !== 2 && '!text-[#909399]'
      ]"
    >
      {{ s.dpOdds?.toFixed(2) }}
    </div>

    <div
      v-show="!showNum"
      class="text-[--el-color-primary] flex justify-start cursor-pointer h-full items-center relative"
    >
      <div
        @mouseleave="toggleShowNum('leave')"
        class="flex justify-start items-center h-[80%]"
      >
        <div class="bg-red-100" @click.stop @mouseleave.stop>
          <el-input-number
            :step="0.01"
            class="!w-[100px]"
            size="small"
            v-model="inputCom"
            @change="changeDpOdds"
          />
        </div>
      </div>
    </div>
    <!-- - 重置按钮 -->
    <div
      class="absolute right-[70px] top-1/2 translate-y-[-50%] cursor-pointer"
    >
      <IconifyIconOffline icon="refreshRight" @click="refreshIconClick" />
    </div>

    <div
      v-if="s.odds !== s.dpOdds"
      class="absolute right-0 top-1/2 translate-y-[-50%] w-[60px] text-xs text-white"
      :style="{ backgroundColor: `var(${tipData.color})` }"
    >
      {{ tipData.val }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { subtraction, addition } from '@pureadmin/utils';
import { debounce } from '@pureadmin/utils';
import { hasAuth } from '@/router/utils';
import { resetDpodds } from '../util/playMap';
import { ElMessageBox } from 'element-plus';
import { message } from '@/utils/message';

const emits = defineEmits([
  'clearMatchTime',
  'changeSelectNum',
  'showShortcutContainer',
  'hideScrollList'
]);
const props = defineProps<{
  s: sportTradingDataAPI.BetItemsDtoList;
  selectNum: number;
  saleStatus: number;
  selectItem: sportTradingDataAPI.BetItemsDtoList;
  betItemsDtoList: sportTradingDataAPI.BetItemsDtoList[];
}>();

//- 是否显示操盘按钮
const toggleShowNum = (t: 'enter' | 'leave') => {
  if (!hasAuth('CHANGE_ODDS') || props.saleStatus !== 2) return;

  if (props.betItemsDtoList.length === 2) {
    const otherD = props.betItemsDtoList.find(
      item => item.betItemsId !== props.s.betItemsId
    ) as sportTradingDataAPI.BetItemsDtoList;
    if (Math.abs(otherD.oddsVariable) !== Math.abs(props.s.oddsVariable))
      return;
  }

  showNum.value = t === 'leave';
  emits('clearMatchTime', !showNum.value ? 1 : -1);
};

const d = ref();
const inputCom = computed({
  get() {
    return props.s.dpOdds;
  },
  set(v: number) {
    if (props.s.oddsType === 'OU') {
      if (v > 201 || v < 1.01) return;
    }
    if (v === 0) return;

    if (
      Math.abs(subtraction(Math.abs(props.s.dpOdds), Math.abs(v), 2)) >
      Math.abs(d.value?.dpOdds)
    ) {
      return;
    }

    const n = subtraction(v, props.s.dpOdds, 2);
    props.s.dpOdds = v;
    if (Math.abs(props.s.dpOdds) >= 1 && props.s.oddsType === 'ML') {
      props.s.dpOdds = resetDpodds(props.s.dpOdds);
    }
    if (props.betItemsDtoList.length === 2) {
      d.value = props.betItemsDtoList.find(
        item => item.betItemsId !== props.s.betItemsId
      ) as sportTradingDataAPI.BetItemsDtoList;
      if (n > 0) {
        d.value.dpOdds = subtraction(d.value.dpOdds, n, 2);
      } else {
        d.value.dpOdds = addition(d.value.dpOdds, Math.abs(n), 2);
      }
      if (Math.abs(d.value.dpOdds) >= 1)
        d.value.dpOdds = resetDpodds(d.value.dpOdds);
    } else {
      d.value = null;
    }
    if (Math.abs(props.s.dpOdds) === 0.01) {
      props.s.dpOdds = 0.01;
      if (n > 0) {
        d.value.dpOdds = subtraction(d.value.dpOdds, n, 2);
      } else {
        // d.value.dpOdds = addition(d.value.dpOdds, Math.abs(n), 2);
      }
      if (Math.abs(d.value.dpOdds) >= 1) {
        d.value.dpOdds = resetDpodds(d.value.dpOdds);
      }
    } else if (Math.abs(d.value?.dpOdds) === 0) {
      d.value.dpOdds = 0.01;
      props.s.dpOdds = subtraction(props.s.dpOdds, 0.01, 2);
    }
  }
});

//- 赔率改变
const changeDpOdds = debounce(_v => {
  if (
    Math.abs(
      subtraction(Math.abs(props.s.previousDpOdds), Math.abs(props.s.dpOdds), 2)
    ) > 0.3
  ) {
    props.s.dpOdds = props.s.previousDpOdds;
    if (d.value) d.value.dpOdds = d.value.previousDpOdds;
    return;
  }
  //- 重置历史赔率(包含双向盘)
  props.s.previousDpOdds = props.s.dpOdds;
  if (d.value) d.value.previousDpOdds = d.value.dpOdds;
  // if (Number(tipData.value.val) === props.s.oddsVariable) return;
  emits('changeSelectNum', Number(tipData.value.val), props.s);
}, 500);

const showNum = ref(true);

watch(
  () => props.selectNum,
  v => {
    if (props.selectItem.betItemsId === props.s.betItemsId) {
      if (v > 0) {
        props.s.dpOdds = addition(props.s.dpOdds, v, 2);
      } else if (v < 0) {
        props.s.dpOdds = subtraction(props.s.dpOdds, Math.abs(v), 2);
      }
      if (Math.abs(props.s.dpOdds) >= 1) {
        if (Math.abs(props.s.dpOdds) === 1) {
          props.s.dpOdds = -1;
        } else if (props.s.dpOdds > 0) {
          props.s.dpOdds = subtraction(props.s.dpOdds, 2, 2);
        } else {
          props.s.dpOdds = subtraction(2, Math.abs(props.s.dpOdds), 2);
        }
      }
    }
  }
);

//- 重置赔率按钮
const refreshIconClick = () => {
  ElMessageBox.confirm(`${t('点击后赔率将恢复成数据源原始赔率')} `, {
    type: 'warning',
    title: t('警告'),
    center: true
  }).then(reloadOdd);
};

const reloadOdd = async () => {
  const betItemsIds = [props.s.betItemsId];
  let otherD;
  if (props.betItemsDtoList.length === 2) {
    otherD = props.betItemsDtoList.find(
      item => item.betItemsId !== props.s.betItemsId
    ) as sportTradingDataAPI.BetItemsDtoList;
    betItemsIds.push(otherD.betItemsId);
  }
  const res = await API.resetHandicapOdds({
    betItemsIds,
    matchId: props.s.matchId,
    operateMenu: '操盘管理-重置赔率'
  });
  message(res.msg, { type: res.code ? 'error' : 'success' });
  if (res.code) return;
  props.s.dpOdds = props.s.odds;
  otherD && (otherD.dpOdds = otherD?.odds);
};

const tipData = computed(() => {
  let baseN = 0;
  let val = 0;
  if (props.s.odds < 0 && props.s.dpOdds < 0) {
    val = subtraction(Math.abs(props.s.odds), Math.abs(props.s.dpOdds), 2);
  } else if (props.s.odds > 0 && props.s.dpOdds > 0) {
    val = subtraction(Math.abs(props.s.dpOdds), Math.abs(props.s.odds), 2);
  } else if (
    (props.s.odds < 0 && props.s.dpOdds > 0) ||
    (props.s.odds > 0 && props.s.dpOdds < 0)
  ) {
    if (props.s.odds > 0) {
      baseN = subtraction(2, Math.abs(props.s.dpOdds), 2);
      val = subtraction(baseN, props.s.odds, 2);
    } else {
      baseN = subtraction(2, Math.abs(props.s.dpOdds), 2);
      val = subtraction(Math.abs(props.s.odds), baseN, 2);
    }
  }
  return {
    val: val > 0 ? `+${val}` : val,
    color: val > 0 ? '--el-color-success-light-3' : '--el-color-danger-light-3'
  };
});
</script>

<style lang="scss">
.el-input-number.is-controls-right .el-input__wrapper {
  padding-left: 10px !important;
  padding-right: 30px !important;
}
</style>
