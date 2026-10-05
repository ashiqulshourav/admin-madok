import { usePasswordInputHook } from '@/hooks/passwordInputHook';
import { ElMessageBox } from 'element-plus';
import { message } from '@/utils/message';
import { reactive, ref, onMounted, toRaw } from 'vue';
import {
  autoLabelColumns,
  orderPlacementColumns,
  rejectOrderColumns,
  autoFreezeColumns
} from '../component/TableColumnList';
import { labelListType } from '@/views/operateManager/com/playerList/utils/types';
import { PandaMatch } from '@/views/eventManagement/eventQuery/utils/types';
import { hasAuth } from '@/router/utils';

export function useRiskControlHook({
  venueType,
  category
}: {
  venueType: number;
  category: number;
}) {
  const currentRiskControlLabelId = ref(
    hasAuth('AUTOREJECTLIST') ? 0 : hasAuth('AUTOORDERPLACEMENTLIST') ? 1 : 2
  );
  const loading = ref(false);
  const isEditRiskControls = ref(false);
  const isFormClick = ref(false);
  const { openPasswordInput } = usePasswordInputHook();
  const pandaMatchList = reactive<PandaMatch[]>([]);

  // order reject
  const rejectOrderList = reactive<RiskManagementDataAPI.OrderRejectTypes[]>(
    []
  );
  const sourcerejectOrderList = reactive<
    RiskManagementDataAPI.OrderRejectTypes[]
  >([]);
  const delrejectOrderList = reactive<RiskManagementDataAPI.OrderRejectTypes[]>(
    []
  );

  // order placement
  const orderPlacementList = reactive<
    RiskManagementDataAPI.OrderPlacementTypes[]
  >([]);
  const sourceOrderPlacementList = reactive<
    RiskManagementDataAPI.OrderPlacementTypes[]
  >([]);
  const delOrderPlacementList = reactive<
    RiskManagementDataAPI.OrderPlacementTypes[]
  >([]);
  // auto freeze
  const orderAutoFreezeList = reactive<RiskManagementDataAPI.AutoFreeze[]>([]);
  const sourceOrderAutoFreezeList = reactive<
    RiskManagementDataAPI.AutoFreeze[]
  >([]);
  const delOrderAutoFreezeList = reactive<RiskManagementDataAPI.AutoFreeze[]>(
    []
  );

  // user config list
  const userConfigList = reactive<RiskManagementDataAPI.dangerousUserWarning[]>([])
  const sourceUserConfigList = reactive<RiskManagementDataAPI.dangerousUserWarning[]>([])
  const delUserConfigList = reactive<RiskManagementDataAPI.dangerousUserWarning[]>([])

  // auto label limit
  const labelList = reactive<labelListType>({
    risk: [],
    attr: []
  } as labelListType);

  const riskControlList = reactive<RiskManagementDataAPI.RiskControlTypes[]>(
    []
  );
  const sourceRiskControlList = reactive<
    RiskManagementDataAPI.RiskControlTypes[]
  >([]);
  const delRiskControlList = reactive<RiskManagementDataAPI.RiskControlTypes[]>(
    []
  );

  const dispatchGetLabelList = async () => {
    try {
      const res = await API.getLabelList({
        category: venueType
      });

      labelList.risk.length = 0;
      if (res.data.riskControlLabelList)
        labelList.risk.push(...res.data.riskControlLabelList);
      labelList.attr.length = 0;
      if (res.data.attributeLabelList)
        labelList.attr.push(...res.data.attributeLabelList);
    } catch (error) {
      return message(error as string, { type: 'error' });
    }
  };

  // reject
  async function onSearchFreezeOrder() {
    try {
      loading.value = true;
      const res = await API.getRiskFreezeConfigList();
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });

      orderAutoFreezeList.length = 0;
      sourceOrderAutoFreezeList.length = 0;
      orderAutoFreezeList.push(
        ...res.data.map((item, idx) => ({
          ...item,
          leagueGrades: item?.leagueGrades
            ? (item?.leagueGrades as any).split(',')
            : [],
          idx: idx + 1
        }))
      );
      sourceOrderAutoFreezeList.push(
        ...res.data.map((item, idx) => ({
          ...item,
          leagueGrades: item?.leagueGrades
            ? (item?.leagueGrades as any).split(',')
            : [],
          idx: idx + 1
        }))
      );
    } catch (error) {
      loading.value = false;
    }
  }
  // order placement
  async function onSearchOrderPlacement() {
    try {
      loading.value = true;
      const res = await API.getRiskSettleConfigList();

      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });

      orderPlacementList.length = 0;
      sourceOrderPlacementList.length = 0;
      orderPlacementList.push(
        ...res.data.map((item, idx) => ({
          ...item,
          leagueGrades: item?.leagueGrades
            ? (item?.leagueGrades as any).split(',')
            : [],
          idx: idx + 1
        }))
      );
      sourceOrderPlacementList.push(
        ...res.data.map((item, idx) => ({
          ...item,
          leagueGrades: item?.leagueGrades
            ? (item?.leagueGrades as any).split(',')
            : [],
          idx: idx + 1
        }))
      );
    } catch (error) {
      loading.value = false;
    }
  }
  // auto freeze
  async function onSearchRejectOrder() {
    try {
      loading.value = true;
      const res = await API.getRiskBetConfigList();

      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });

      rejectOrderList.length = 0;
      sourcerejectOrderList.length = 0;

      rejectOrderList.push(
        ...res.data.map((item, idx) => ({
          ...item,
          leagueGrades: item?.leagueGrades
            ? (item?.leagueGrades as any).split(',')
            : [],
          idx: idx + 1
        }))
      );
      sourcerejectOrderList.push(
        ...res.data.map((item, idx) => ({
          ...item,
          leagueGrades: item?.leagueGrades
            ? (item?.leagueGrades as any).split(',')
            : [],
          idx: idx + 1
        }))
      );
    } catch (error) {
      loading.value = false;
    }
  }

  // risk control label limit
  async function onSearchAutoLabelLimit() {
    try {
      loading.value = true;
      const res = await API.getAutoLimitConfigList();

      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      riskControlList.length = 0;
      sourceRiskControlList.length = 0;
      riskControlList.push(...res.data);
      sourceRiskControlList.push(...res.data);
    } catch (error) {
      loading.value = true;
    }
  }

   // user risk config list
  async function onSearchUserConfigList() {
    try {
      loading.value = true;
      const res = await API.getUserConfigList();

      loading.value = false;
      userConfigList.length = 0;
      sourceUserConfigList.length = 0;
      userConfigList.push(...res.data);
      sourceUserConfigList.push(...res.data);
    } catch (error) {
      loading.value = true;
    }
  }

  const cancelRiskControlsEdit = () => {
    isEditRiskControls.value = false;
    isFormClick.value = false;
    switch (currentRiskControlLabelId.value) {
      case 0:
        {
          onSearchRejectOrder();
        }
        break;
      case 1:
        {
          onSearchOrderPlacement();
        }
        break;
      case 2:
        {
          onSearchFreezeOrder();
        }
        break;
      case 3:
        {
          // onSearchAutoLabelLimit();
          onSearchUserConfigList();
        }
        break;
    }
  };

  const changeType = (id: number) => {
    currentRiskControlLabelId.value = id;
    cancelRiskControlsEdit();
    isFormClick.value = false;
  };

  const toggle = async (flag: boolean) => {
    isEditRiskControls.value = flag;
  };

  // rejectOrder
  const confirmRejectOrder = async () => {
    // validation
    isFormClick.value = true;
    let isValid = true;

    rejectOrderList.forEach(item => {
      if (!item.leagueGrades?.length) {
        isValid = false;
      }

      if (!item.sourceCode || !item.eventCode) {
        isValid = false;
      }

      if (!Number(item.betBeforeTime) && !Number(item.betAfterTime)) {
        isValid = false;
      }
    });

    if (isValid) {
      const r = await openPasswordInput();
      if (!r) return;

      loading.value = true;

      const transformPayload = (
        data: RiskManagementDataAPI.OrderRejectTypes[]
      ) => {
        return data.map(item => ({
          id: item?.id,
          sourceCode: item.sourceCode,
          sourceName: item.sourceName,
          eventCode: item.eventCode,
          eventName: item.eventName,
          isDelete: item.isDelete,
          sportId: 1,
          leagueGrades: (item?.leagueGrades as any)?.join(','),
          betBeforeTime: parseInt(item.betBeforeTime || 0),
          betAfterTime: parseInt(item.betAfterTime || 0),
          event_name: item.eventName
        }));
      };

      const res = await API.editRiskBetConfigEdit([
        ...transformPayload(rejectOrderList),
        ...transformPayload(delrejectOrderList)
      ]);
      loading.value = false;

      if (res.code) {
        message(res.msg, { type: 'error' });
      } else {
        isFormClick.value = false;
        message(res.msg, { type: res.code ? 'error' : 'success' });
        isEditRiskControls.value = false;
        rejectOrderList.length = 0;
        delrejectOrderList.length = 0;
        onSearchRejectOrder();
      }
    }
  };
  // auto order placement
  const confirmOrderPlacement = async () => {
    // validation
    isFormClick.value = true;
    let isValid = true;

    orderPlacementList.forEach(item => {
      if (!item.leagueGrades?.length) {
        isValid = false;
      }
      if (!item.sourceCode || !item.eventCode) {
        isValid = false;
      }

      if (!Number(item.betBeforeTime) && !Number(item.betAfterTime)) {
        isValid = false;
      }

      if (Number(item.betAfterTime)) {
        orderAutoFreezeList.forEach(orderFreeze => {
          if (
            orderFreeze.sourceCode == item.sourceCode &&
            orderFreeze.eventCode == item.eventCode
          ) {
            if (Number(item.betAfterTime) >= Number(orderFreeze.betAfterTime)) {
              isValid = false;
            }
          }
        });
      }

      // if (item.betBeforeTime) {
      //   orderAutoFreezeList.forEach(orderFreeze => {
      //     if (
      //       orderFreeze.sourceCode == item.sourceCode &&
      //       orderFreeze.eventCode == item.eventCode
      //     ) {
      //       if (
      //         Number(item.betBeforeTime) > Number(orderFreeze.betBeforeTime)
      //       ) {
      //         isValid = false;
      //       }
      //     }
      //   });
      // }

      if (Number(item.maxLimitAmount) && Number(item.minLimitAmount)) {
        if (Number(item.maxLimitAmount) < Number(item.minLimitAmount)) {
          isValid = false;
        }
      }
    });

    if (isValid) {
      const r = await openPasswordInput();
      if (!r) return;

      loading.value = true;

      const transformPayload = (
        data: RiskManagementDataAPI.OrderPlacementTypes[]
      ) => {
        return data.map(item => ({
          id: item?.id,
          sourceCode: item.sourceCode,
          sourceName: item.sourceName,
          eventCode: item.eventCode,
          eventName: item.eventName,
          isDelete: item.isDelete,
          betBeforeTime: Number(item.betBeforeTime) || 0,
          betAfterTime: Number(item.betAfterTime) || 0,
          minLimitAmount: Number(item.minLimitAmount) || 0,
          maxLimitAmount: Number(item.maxLimitAmount) || 0,
          event_name: item.eventName,
          sportId: 1,
          leagueGrades: (item?.leagueGrades as any)?.join(',')
        }));
      };

      const res = await API.updateOrderPlacement([
        ...transformPayload(orderPlacementList),
        ...transformPayload(delOrderPlacementList)
      ]);
      loading.value = false;

      if (res.code) {
        message(res.msg, { type: 'error' });
      } else {
        isFormClick.value = false;
        message(res.msg, { type: res.code ? 'error' : 'success' });
        isEditRiskControls.value = false;
        orderPlacementList.length = 0;
        delOrderPlacementList.length = 0;
        onSearchOrderPlacement();
      }
    }
  };
  // auto label
  const confirmAutoLabel = async () => {
    const r = await openPasswordInput();
    if (!r) return;

    loading.value = true;
    isFormClick.value = true;

    const res = await API.updateAutoLimitConfig([
      ...riskControlList,
      ...delRiskControlList
    ]);
    loading.value = false;
    if (res.code) {
      message(res.msg, { type: 'error' });
      return;
    } else {
      isFormClick.value = false;
      message(res.msg, { type: res.code ? 'error' : 'success' });
      isEditRiskControls.value = false;
      riskControlList.length = 0;
      delRiskControlList.length = 0;
      onSearchAutoLabelLimit();
    }
  };

  // auto freeze
  const confirmAutoFreeze = async () => {
    // validation
    isFormClick.value = true;
    let isValid = true;
    orderAutoFreezeList.forEach(item => {
      if (!item.leagueGrades?.length) {
        isValid = false;
      }
      if (!item.sourceCode || !item.eventCode) {
        isValid = false;
      }

      if (!Number(item.betBeforeTime) && !Number(item.betAfterTime)) {
        isValid = false;
      }

      if (Number(item.betAfterTime)) {
        orderPlacementList.forEach(orderPlacement => {
          if (
            orderPlacement.sourceCode == item.sourceCode &&
            orderPlacement.eventCode == item.eventCode
          ) {
            if (
              Number(item.betAfterTime) <= Number(orderPlacement.betAfterTime)
            ) {
              isValid = false;
            }
          }
        });
      }

      // if (item.betBeforeTime) {
      //   orderPlacementList.forEach(orderPlacement => {
      //     if (
      //       orderPlacement.sourceCode == item.sourceCode &&
      //       orderPlacement.eventCode == item.eventCode
      //     ) {
      //       if (
      //         Number(item.betBeforeTime) < Number(orderPlacement.betBeforeTime)
      //       ) {
      //         isValid = false;
      //       }
      //     }
      //   });
      // }

      if (Number(item.maxLimitAmount) && Number(item.minLimitAmount)) {
        if (Number(item.maxLimitAmount) < Number(item.minLimitAmount)) {
          isValid = false;
        }
      }
    });

    if (isValid) {
      const r = await openPasswordInput();
      if (!r) return;

      loading.value = true;

      const transformPayload = (data: RiskManagementDataAPI.AutoFreeze[]) => {
        return data.map(item => ({
          id: item?.id,
          isDisable: item.isDisable,
          sourceCode: item.sourceCode,
          sourceName: item.sourceName,
          eventCode: item.eventCode,
          eventName: item.eventName,
          isDelete: item.isDelete,
          betBeforeTime: Number(item.betBeforeTime) || 0,
          betAfterTime: Number(item.betAfterTime) || 0,
          minLimitAmount: Number(item.minLimitAmount) || 0,
          maxLimitAmount: Number(item.maxLimitAmount) || 0,
          event_name: item.eventName,
          userCreateAfter: 0,
          labels: '',
          excepLimitUser: 0,
          sportId: 1,
          leagueGrades: (item?.leagueGrades as any)?.join(',')
        }));
      };

      const res = await API.updateRiskFreezeConfigList([
        ...transformPayload(orderAutoFreezeList),
        ...transformPayload(delOrderAutoFreezeList)
      ]);
      loading.value = false;
      if (res.code) {
        message(res.msg, { type: 'error' });
        return;
      } else {
        isFormClick.value = false;
        message(res.msg, { type: res.code ? 'error' : 'success' });
        isEditRiskControls.value = false;
        orderAutoFreezeList.length = 0;
        delOrderAutoFreezeList.length = 0;
        onSearchFreezeOrder();
      }
    }
  };

  const confirmUserConfig = async () => {
    // validation
    isFormClick.value = true;
    let isValid = true;

     userConfigList.forEach(item => {
      if(
        !item.warningCondition || item.warningCondition == null ||
        !item.dailyBetCount || item.dailyBetCount == null ||
        !item.dailyRefuse || item.dailyRefuse == null ||
        !item.beforeThreeSecCount || item.beforeThreeSecCount == null
      ) {
        isValid = false;
      }
    })

    if (isValid) {
      const r = await openPasswordInput();
      if (!r) return;

      loading.value = true;

      const transformPayload = (data: RiskManagementDataAPI.dangerousUserWarning[]) => {
        return data.map(item => ({
          id: item?.id,
          warningCondition: item.warningCondition,
          dailyProfitAmount: Number(item.dailyProfitAmount),
          dailyRefuse: Number(item.dailyRefuse),
          beforeThreeSecCount: Number(item.beforeThreeSecCount),
          dailyBetAmount: Number(item.dailyBetAmount),
          dailyBetCount: Number(item.dailyBetCount),
          dailyProfitRate: Number(item.dailyProfitRate),
          deleteFlag: item.deleteFlag,
        }));
      };

      const res = await API.updateUserConfigList([
        ...transformPayload(userConfigList),
        ...transformPayload(delUserConfigList)
      ]);
      loading.value = false;
      if (res.code) {
        message(res.msg, { type: 'error' });
        return;
      } else {
        isFormClick.value = false;
        message(res.msg, { type: res.code ? 'error' : 'success' });
        isEditRiskControls.value = false;
        userConfigList.length = 0;
        delUserConfigList.length = 0;
        onSearchUserConfigList();
      }

    }
  }

  const confirmRiskControlsClick = () => {
    switch (currentRiskControlLabelId.value) {
      case 0:
        {
          confirmRejectOrder();
        }
        break;
      case 1:
        {
          confirmOrderPlacement();
        }
        break;
      case 2:
        {
          confirmAutoFreeze();
        }
        break;
      case 3:
        {
          // confirmAutoLabel();
          confirmUserConfig();
        }
        break;
    }
  };

  const addControlLabel = () => {
    console.log('plus', currentRiskControlLabelId.value);
    switch (currentRiskControlLabelId.value) {
      case 0:
        {
          rejectOrderList.push({
            sourceCode: undefined,
            sourceName: undefined,
            eventCode: undefined,
            eventName: undefined,
            betBeforeTime: undefined,
            leagueGrades: [],
            betAfterTime: undefined,
            isDelete: undefined,
            idx: rejectOrderList.length + 1
          });
        }
        break;
      case 1:
        {
          orderPlacementList.push({
            sourceCode: undefined,
            sourceName: undefined,
            eventCode: undefined,
            eventName: undefined,
            betBeforeTime: undefined,
            betAfterTime: undefined,
            minLimitAmount: undefined,
            leagueGrades: [],
            maxLimitAmount: undefined,
            isDelete: undefined
          });
        }
        break;
      case 2:
        {
          orderAutoFreezeList.push({
            sourceCode: undefined,
            sourceName: undefined,
            eventCode: undefined,
            eventName: undefined,
            leagueGrades: [],
            betBeforeTime: undefined,
            betAfterTime: undefined,
            minLimitAmount: undefined,
            maxLimitAmount: undefined,
            isDelete: undefined,
            isDisable: 1
          });
        }
        break;
      case 3:
        {
          userConfigList.push({
            warningCondition: undefined,
            dailyProfitAmount: undefined,
            dailyRefuse: undefined,
            beforeThreeSecCount: undefined,
            dailyBetAmount: undefined,
            dailyBetCount: undefined,
            dailyProfitRate: undefined,
            deleteFlag : undefined,
          });
        }
        break;
    }
  };

  const deleteControlLabel = () => {
    switch (currentRiskControlLabelId.value) {
      case 0:
        {
          const item = rejectOrderList.pop();
          if (item?.id) {
            delrejectOrderList.push({ ...item, isDelete: 1 });
          }
        }
        break;
      case 1:
        {
          const item = orderPlacementList.pop();
          if (item?.id) {
            delOrderPlacementList.push({
              ...item,
              isDelete: 1
            });
          }
        }
        break;
      case 2:
        {
          const item = orderAutoFreezeList.pop();
          if (item?.id) {
            delOrderAutoFreezeList.push({
              ...item,
              isDelete: 1
            });
          }
        }
        break;
      case 3:
        {
          // const item = riskControlList.pop();
          // if (item?.id) {
          //   delRiskControlList.push({ ...item, delFlag: 1 });
          // }
          const item = userConfigList.pop();
          if (item?.id) {
            delUserConfigList.push({ ...item, deleteFlag: 1 });
          }
        }
        break;
    }
  };

  watch(
    () => currentRiskControlLabelId.value,
    async () => {
      switch (currentRiskControlLabelId.value) {
        case 0:
          {
          }
          break;
        case 1:
          {
          }
          break;
        case 2:
          {
          }
          break;
        case 3:
          {
            // await dispatchGetLabelList();
            // onSearchUserConfigList();
          }
          break;
      }
    }
  );

  onMounted(async () => {
    dispatchGetLabelList();

    switch (currentRiskControlLabelId.value) {
      case 0:
        {
          onSearchRejectOrder();
        }
        break;
      case 1:
        {
          onSearchOrderPlacement();
        }
        break;
      case 2:
        {
          onSearchFreezeOrder();
        }
        break;
      case 3: 
      {
          onSearchUserConfigList();
      }
    }
  });

  return {
    currentRiskControlLabelId,
    loading,
    changeType,
    isEditRiskControls,
    toggle,
    cancelRiskControlsEdit,
    confirmRiskControlsClick,
    autoLabelColumns,
    riskControlList,
    deleteControlLabel,
    addControlLabel,
    labelList,
    orderPlacementColumns,
    rejectOrderColumns,
    rejectOrderList,
    orderPlacementList,
    pandaMatchList,
    autoFreezeColumns,
    orderAutoFreezeList,
    userConfigList,
    isFormClick
  };
}
