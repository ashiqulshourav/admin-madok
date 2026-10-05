import { message } from '@/utils/message';
import { reactive, ref, onMounted } from 'vue';
import { columns } from '../component/TableColumnList';
import { ElMessageBox } from 'element-plus';

export function useClassifySettingHook() {
  const sportList = reactive<UserAPI.UserLevelLimitListRes[]>([]);
  const sourceSportList = reactive<UserAPI.UserLevelLimitListRes[]>([]);
  const eSportList = reactive<UserAPI.UserLevelLimitListRes[]>([]);
  const eSportSourceList = reactive<UserAPI.UserLevelLimitListRes[]>([]);
  const isEditSport = ref(false);
  const isEditESport = ref(false);
  const loading = ref(true);

  //- 初始化
  async function onSearch() {
    loading.value = true;
    const resList = await Promise.allSettled([
      API.getUserLevelLimitList({ type: 0 }),
      API.getUserLevelLimitList({ type: 1 })
    ]);

    if (resList[0].status === 'fulfilled' && !resList[0].value.code) {
      sportList.length = 0;
      sourceSportList.length = 0;
      sportList.push(...resList[0].value.data);
      sourceSportList.push(...resList[0].value.data);
    }
    if (resList[1].status === 'fulfilled' && !resList[1].value.code) {
      eSportList.length = 0;
      eSportSourceList.length = 0;
      eSportList.push(...resList[1].value.data);
      eSportSourceList.push(...resList[1].value.data);
    }
    loading.value = false;
  }

  //- 新增体育限额
  const addSportItem = () => {
    sportList.push({
      levelLimit: (sportList[sportList.length - 1]?.levelLimit ?? 0) + 1,
      productAmountTotalLimit: 0,
      maxWinAmountLimit: 0,
      userSingleGamePay: 0,
      singleMatchPay: 0,
      championDailyPay: 0,
      bunchMatchPay: 0,
      type: 0
    });
  };
  //- 新增电竞体育限额
  const addESportItem = () => {
    eSportList.push({
      levelLimit: (eSportList[eSportList.length - 1]?.levelLimit ?? 0) + 1,
      productAmountTotalLimit: 0,
      maxWinAmountLimit: 0,
      userSingleGamePay: 0,
      singleMatchPay: 0,
      championDailyPay: 0,
      bunchMatchPay: 0,
      type: 1
    });
  };

  //- 体育用户等级；修改
  const confirmSportClick = () => {
    ElMessageBox.confirm(t('确定要修改体育用户等级限额么？'), t('警告'), {
      center: true
    }).then(async () => {
      loading.value = true;
      const res = await API.updateUserLevelLimit({ list: sportList, type: 0 });
      loading.value = false;
      isEditSport.value = false;
      message(res.msg, { type: res.code ? 'error' : 'success' });
      onSearch();
    });
  };

  //-   电竞用户等级修改
  const confirmESportClick = () => {
    ElMessageBox.confirm(t('确定要修改电竞用户等级限额么？'), t('警告'), {
      center: true
    }).then(async () => {
      loading.value = true;
      const res = await API.updateUserLevelLimit({
        list: eSportList,
        type: 1
      });
      loading.value = false;
      isEditESport.value = false;
      message(res.msg, { type: res.code ? 'error' : 'success' });
      onSearch();
    });
  };

  //- 体育编辑取消
  const cancelSportEdit = () => {
    isEditSport.value = false;
    sportList.length = 0;
    sportList.push(...sourceSportList);
  };
  //- 电竞编辑取消
  const cancelESportEdit = () => {
    isEditESport.value = false;
    eSportList.length = 0;
    eSportList.push(...eSportSourceList);
  };

  //- 删除体育
  const delSportItem = () => {
    sportList.pop();
  };
  //- 删除体育电竞
  const delESportItem = () => {
    eSportList.pop();
  };

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    columns,
    sportList,
    eSportList,
    onSearch,
    isEditSport,
    isEditESport,
    addSportItem,
    confirmSportClick,
    confirmESportClick,
    addESportItem,
    delSportItem,
    delESportItem,
    cancelSportEdit,
    cancelESportEdit
  };
}
