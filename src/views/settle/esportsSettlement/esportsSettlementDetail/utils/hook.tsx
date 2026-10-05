import { message } from '@/utils/message';
import { ElMessageBox } from 'element-plus';
import { usePublicHooks } from '@/hooks';
import { SPORT_LEVEL_LIST_TYPE } from './type';
import { NAV_TITLE_NAME, SPORT_LEVEL_LIST } from './map';
import { usePasswordInputHook } from '@/hooks/passwordInputHook';
import { RESULT_MAP } from '@/utils/maps/sports_map';

export function useEsportsSettlement() {
  const route = useRoute();
  const dataList = reactive<SaleDataAPI.PreSaleList[]>([]);
  const loading = ref(true);
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();
  const rList = reactive<SPORT_LEVEL_LIST_TYPE[]>([]);
  const resetLoading = ref(false);
  const renderObj = reactive<EsportsSettlementAPI.ESportMatchById>(
    {} as EsportsSettlementAPI.ESportMatchById
  );

  const { openPasswordInput } = usePasswordInputHook();

  //- 分页点击
  const handleCurrentChange = (val: number, index: number) =>
    (rList[index].currentPage = val);

  //- 每页显示条数改变
  const handleTableWidthChange = (v: number) => {
    rList.forEach(_ => (_.pageSize = v));
  };

  //- 获取详情数据
  const getEsportMatchInfo = async () => {
    loading.value = true;
    const res = await API.getESportMatchById({
      matchId: +route.params.matchId
    });
    loading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    const keyList = Object.keys(res.data.betItemsMap);
    //- 清洗后端返回数据
    if (keyList.length) {
      res.data.betItemsMap.all = Object.values(res.data.betItemsMap).flat();
      keyList.forEach((key: string) => {
        const filterKey = key.replace(/^\["|"\]$/g, '');
        res.data.betItemsMap[filterKey] = res.data.betItemsMap[key];
        key !== 'all' && delete res.data.betItemsMap[key];
      });
    }
    Object.assign(renderObj, res.data);
    formatData();
  };

  //- 格式化数据
  const formatData = () => {
    //- 防止每次进行数据扩充
    const tempList = JSON.parse(JSON.stringify(SPORT_LEVEL_LIST));
    tempList.forEach((item: (typeof SPORT_LEVEL_LIST)[0]) => {
      Object.keys(renderObj.betItemsMap).forEach(key => {
        if (item.key === key)
          (item.list as EsportsSettlementAPI.BetItemsMapData[]) =
            renderObj.betItemsMap[key];
      });
    });
    rList.length = 0;
    rList.push(
      ...tempList.filter((_: (typeof SPORT_LEVEL_LIST)[0]) => _.list.length)
    );

    rList.forEach(item => {
      const l = item.list;
      l.sort((a: any, b: any) => a.displayIndex - b.displayIndex);
      const o: { [key: string]: any } = {};
      l.forEach(d => {
        if (!o[d.sourceBetItemsMid]) o[d.sourceBetItemsMid] = [];
        o[d.sourceBetItemsMid].push(d);
      });
      item.list.length = 0;
      Object.values(o).forEach((arr: any[]) => {
        const selectIndex = arr.findIndex(item => {
          return (
            item.win === RESULT_MAP.new_win || item.win === RESULT_MAP.old_win
          );
        });
        const multipartBetOptions: number[] = [];
        arr.forEach((item, index) => {
          if (
            (item.win === RESULT_MAP.new_win ||
              item.win === RESULT_MAP.old_win) &&
            arr.length > 2
          ) {
            multipartBetOptions.push(index);
          }
        });

        item.list.push({
          betOptions: selectIndex,
          multipartBetOptions,
          ...arr[0],
          arr
        });
      });
    });
  };

  //-
  const multipBetResultCheck = (list: number[], index: number) => {
    return list.includes(index) ? 4 : 3;
  };

  //- 结算提交
  const manualSettleESportHandicapClick = async (
    row: EsportsSettlementAPI.BetItemsMapData,
    type?: 'cancel'
  ) => {
    if (row.betOptions < 0 && !row.multipartBetOptions.length && !type)
      return message(t('请先选择投注项'), { type: 'error' });

    if (type) {
      const r = await openPasswordInput();
      if (!r) return;
    }
    const formatKey = row.handicapFilter.replace(/\["|"\]/g, '');
    ElMessageBox.confirm(
      type ? (
        <div class="">
          <div class="font-bold">{t('确认要取消盘口么?')}</div>
          <div class="my-1">
            <span>{t('盘口名称')}:</span>
            <span class="ml-1 mr-1">{row.betItemsNameEn}</span>
            <span>{row.betItemsName}</span>
          </div>
          <div>
            <span>{t('所属局数')}:</span>
            <span class="ml-1">
              {NAV_TITLE_NAME[formatKey as keyof typeof NAV_TITLE_NAME]}
            </span>
          </div>
        </div>
      ) : (
        t('确认要结算该记录么?')
      ),
      '系统提示',
      {
        confirmButtonText: t('确认'),
        cancelButtonText: t('取消'),
        type: 'warning',
        center: true,
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    ).then(async () => {
      const params = {
        matchId: row.matchId,
        betResultItems: row.arr.map((item, index) => {
          return {
            betItemId: item.betItemsId,
            betResult: type
              ? 24
              : row.multipartBetOptions.length > 0
              ? multipBetResultCheck(row.multipartBetOptions, index)
              : row.betOptions === index
              ? 4
              : 3,
            handicap: item.handicap,
            kindsCode: item.kindsCode,
            n: item.n
          };
        })
      };
      const res = await API.manualSettleESportHandicap(params);
      if (res.code) return message(res.msg, { type: 'error' });
      getEsportMatchInfo();
    });
  };

  //- 开售状态修改
  const closeSettle = async () => {
    ElMessageBox.confirm(t('确认要关闭开售状态吗？'), t('系统提示'), {
      confirmButtonText: t('确定'),
      cancelButtonText: t('取消'),
      type: 'warning',
      center: true
    }).then(async () => {
      const res = await API.updateSaleStatus({
        isSale: 0,
        matchId: renderObj.matchId
      });
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if (!res.code) getEsportMatchInfo();
    });
  };
  //- 确认二次结算
  const resetManualSettleESportHandicapClick = async (
    row: EsportsSettlementAPI.BetItemsMapData
  ) => {
    ElMessageBox.confirm(t('确认要从新结算该记录么?'), '系统提示', {
      confirmButtonText: t('确认'),
      cancelButtonText: t('取消'),
      type: 'warning',
      center: true,
      dangerouslyUseHTMLString: true,
      draggable: true
    }).then(async () => {
      const r = await openPasswordInput();
      if (!r) return;
      const params = {
        matchId: row.matchId,
        betResultItems: row.arr.map((item, index) => {
          return {
            betItemId: item.betItemsId,
            betResult:
              row.multipartBetOptions.length > 0
                ? multipBetResultCheck(row.multipartBetOptions, index)
                : row.betOptions === index
                ? 4
                : 3,
            handicap: item.handicap,
            id: item.id,
            n: item.n,
            kindsCode: item.kindsCode,
            sourceBetItemsMid: item.sourceBetItemsMid
          };
        })
      };
      resetLoading.value = true;
      const res = await API.eSportReSettlement(params);
      resetLoading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      getEsportMatchInfo();
    });
  };

  onMounted(() => {
    getEsportMatchInfo();
  });

  return {
    loading,
    dataList,
    switchLoadMap,
    handleCurrentChange,
    switchStyle,
    renderObj,
    rList,
    manualSettleESportHandicapClick,
    handleTableWidthChange,
    resetManualSettleESportHandicapClick,
    closeSettle,
    resetLoading
  };
}
