<template>
  <div class="flex">
    <!-- v-if="!parentRow.halfSettlementStatus && hasAuth('FIRSTHALFSETTLE')" -->
    <CustomButton
      type="primary"
      :btn-text="currentSettleType.txt"
      :loading="btnLoading"
      :disabled="currentSettleType.disabled"
      @click="settleClick"
    />
    <CustomButton
      v-if="userStore.userInfo.name === 'admin1'"
      type="danger"
      @click="closeMatch"
      :btn-text="t('结算全场')"
    />
  </div>
</template>

<script setup lang="tsx">
import CustomButton from '@/components/Form/CustomButton.vue';
import { t } from '@/plugins/i18n';
import { SETTLE_BUTTON_TYPE } from './util/type';
import { message } from '@/utils/message';
import { ElMessageBox } from 'element-plus';
import { usePasswordInputHook } from '@/hooks/passwordInputHook';
import { useUserStore } from '@/store/user';
import { QuestionFilled } from '@element-plus/icons-vue';

const props = defineProps<{
  parentRow: SattleDataAPI.getSettlementDataList;
  matchId: number;
  overTimeStatus: boolean;
  penaltyKickStatus: boolean;
}>();

const { openPasswordInput } = usePasswordInputHook();
const btnLoading = ref(false);
const userStore = useUserStore();

//- 结束正常比赛
const closeMatch = async () => {
  ElMessageBox.confirm(t('确定要关闭整场比赛么？'), t('警告'), {
    confirmButtonText: t('确认'),
    cancelButtonText: t('取消'),
    center: true
  }).then(async () => {
    const res = await API.closeSaleStatus({ matchId: props.matchId });
    message(res.msg, { type: res.code ? 'error' : 'success' });
    if (res.code) return;
    router.go(-1);
  });
};

const currentSettleType = computed(() => {
  const o = {
    txt: '',
    reqUrl: '',
    confirmTxt: '',
    disabled: false
  };
  switch (props.parentRow.settlementStatus) {
    case SETTLE_BUTTON_TYPE.normal_half:
    case null:
      o.txt = t('常规赛上半场结算');
      o.confirmTxt = t('确定要常规赛上半场结算么？');
      o.reqUrl = 'firstHalfSettlement';
      break;
    case SETTLE_BUTTON_TYPE.normal_all:
      o.txt = t('常规赛全场结算');
      o.confirmTxt = t('确定要常规赛全场结算么？');
      o.reqUrl = 'allSettlement';
      break;
    case SETTLE_BUTTON_TYPE.over_half:
      o.txt = t('加时赛上半场结算');
      o.confirmTxt = t('确定要加时赛上半场结算么？');
      o.reqUrl = 'overTimeHalfSettlement';
      o.disabled = !props.overTimeStatus;
      break;
    case SETTLE_BUTTON_TYPE.over_all:
      o.txt = t('加时赛全场结算');
      o.confirmTxt = t('确定要加时赛全场结算么？');
      o.reqUrl = 'overTimeFullSettlement';
      o.disabled = !props.overTimeStatus;
      break;
    case SETTLE_BUTTON_TYPE.penalty_kick:
      o.txt = t('点球全场结算');
      o.confirmTxt = t('确定要点球全场结算么？');
      o.reqUrl = 'penaltyKickSettlement';
      o.disabled = !props.penaltyKickStatus;
      break;
    default:
      o.txt = t('点球全场结算');
      o.confirmTxt = t('确定要点球全场结算么？');
      o.reqUrl = 'penaltyKickSettlement';
      o.disabled = true;
      break;
  }
  return o;
});

const emits = defineEmits(['reloadTable']);
const router = useRouter();

const closeMatchClick = async () => {
  const selttArr = [
    'allSettlement',
    'overTimeFullSettlement',
    'penaltyKickSettlement'
  ];
  if (selttArr.includes(currentSettleType.value.reqUrl)) {
    const type = currentSettleType.value.reqUrl;
    if (
      (type === 'allSettlement' && !props.overTimeStatus) ||
      (type === 'overTimeFullSettlement' && !props.penaltyKickStatus) ||
      type === 'penaltyKickSettlement'
    ) {
      btnLoading.value = true;
      const res = await API.closeSaleStatus({ matchId: props.matchId });
      btnLoading.value = false;
      if (res.code) return;
      router.go(-1);
    } else {
      emits('reloadTable', true);
    }
  } else {
    emits('reloadTable', true);
  }
};

//- 判断是否结算祛暗疮

//- 比赛结算
const settleClick = () => {
  if (
    (currentSettleType.value.reqUrl === 'allSettlement' &&
      props.overTimeStatus) ||
    (currentSettleType.value.reqUrl === 'overTimeFullSettlement' &&
      props.penaltyKickStatus)
  ) {
    const strArr =
      currentSettleType.value.reqUrl === 'allSettlement'
        ? [
            t('确认进入加时赛结算阶段？'),
            t(
              '加时赛结算开关已开启，确认结算后进入加时赛结算阶段，此操作不可恢复。'
            )
          ]
        : [
            t('确认进入点球大战结算阶段？'),
            t(
              '点球大战结算开关已开启，确认结算后进入点球结算阶段，此操作不可恢复。'
            )
          ];
    ElMessageBox.confirm(
      `<div class="flex flex-col  pr-4">
          <div class="flex items-center">
          <span class="font-bold text-[16px]">${strArr[0]}</span>
          </div>
        <p>${strArr[1]}</p>
      </div>`,
      t('操作确认'),
      {
        customClass: 'tip_dialog',
        dangerouslyUseHTMLString: true,
        confirmButtonText: t('确定'),
        cancelButtonText: t('取消'),
        type: 'warning',
        icon: markRaw(QuestionFilled)
      }
    ).then(() => {
      sendReq();
    });
  } else {
    ElMessageBox.confirm(currentSettleType.value.confirmTxt, t('警告'), {
      dangerouslyUseHTMLString: true,
      confirmButtonText: t('确认'),
      cancelButtonText: t('取消'),
      center: true
    }).then(() => {
      sendReq();
    });
  }
};

//- 发送结算请求
const sendReq = async () => {
  const selttArr = [
    'allSettlement',
    'overTimeFullSettlement',
    'penaltyKickSettlement'
  ];

  if (selttArr.includes(currentSettleType.value.reqUrl)) {
    const r = await openPasswordInput();
    if (!r) return;
  }
  const res = await API[currentSettleType.value.reqUrl as keyof typeof API]({
    matchId: props.matchId
  });
  message(res.msg, { type: res.code ? 'error' : 'success' });
  if (res.code) return;
  closeMatchClick();
};
</script>

<style lang="scss">
.tip_dialog {
  .el-message-box__container {
    align-items: flex-start;
  }
  .el-message-box__btns {
    flex-direction: row;
  }
}
</style>
