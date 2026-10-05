import { message } from '@/utils/message';
import { reactive, ref, onMounted } from 'vue';
import { columns, columns2 } from '../component/TableColumnList';
import { ElMessageBox } from 'element-plus';
import { usePasswordInputHook } from '@/hooks/passwordInputHook';
const esportKeys = new Set([
  'esportRoundMaxBetMoring',
  'esportRoundMaxBetRolling',
  'esportSingleMaxBetMoring',
  'esportSingleMaxBetRolling',
  'esportSingleMaxWin',
  'singleUserMaxWin',
  'esportWholeMaxBetMoring',
  'esportWholeMaxBetRolling',
]);
const sportKeys = new Set([
  'bigsmallHalfMaxBetMoring',
  'bigsmallHalfMaxBetRolling',
  'bigsmallSingleMaxWin',
  'bigsmallWholeMaxBetMoring',
  'bigsmallWholeMaxBetRolling',
  'handicapHalfMaxBetMoring',
  'handicapHalfMaxBetRolling',
  'handicapSingleMaxWin',
  'handicapWholeMaxBetMorning',
  'handicapWholeMaxBetRolling',
  'otherMaxBetMoring',
  'otherMaxBetRolling',
  'otherSingleMaxWin',
  'singleUserMaxWin',
  'winHalfMaxBetMoring',
  'winHalfMaxBetRolling',
  'winSingleMaxWin',
  'winWholeMaxBetMoring',
  'winWholeMaxBetRolling',
]);
type LimitListType = keyof RiskManagementDataAPI.LimitListType;
export function useOrderLimitHook() {
  const sportList = reactive<RiskManagementDataAPI.LimitListType[]>([]);
  const sourceSportList = reactive<RiskManagementDataAPI.LimitListType[]>([]);
  const delList = reactive<RiskManagementDataAPI.LimitListType[]>([]);
  const isEditSport = ref(false);
  const currentSportId = ref(0);
  const loading = ref(true);
  const currency = ref(1);
  const { openPasswordInput } = usePasswordInputHook();
  // 初始化
  async function onSearch() {
    loading.value = true;
    const res = await API.getGameLimitList(currentSportId.value, currency.value);
    loading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    sportList.length = 0;
    sourceSportList.length = 0;
    sportList.push(...res.data);
    const sourceData = JSON.parse(JSON.stringify(res.data));
    sourceSportList.push(...sourceData);
    loading.value = false;
  }
  const addSportItem = () => {
    sportList.push({
      leagueLevel: (sportList[sportList.length - 1]?.leagueLevel ?? 0) + 1,
      gameType: currentSportId.value,
      singleUserMaxWin: null,
      handicapSingleMaxWin: null,
      handicapWholeMaxBetMorning: null,
      handicapWholeMaxBetRolling: null,
      handicapHalfMaxBetMoring: null,
      handicapHalfMaxBetRolling: null,
      bigsmallSingleMaxWin: null,
      bigsmallWholeMaxBetMoring: null,
      bigsmallWholeMaxBetRolling: null,
      bigsmallHalfMaxBetMoring: null,
      bigsmallHalfMaxBetRolling: null,
      winSingleMaxWin: null,
      winWholeMaxBetMoring: null,
      winWholeMaxBetRolling: null,
      winHalfMaxBetMoring: null,
      winHalfMaxBetRolling: null,
      otherSingleMaxWin: null,
      otherMaxBetMoring: null,
      otherMaxBetRolling: null,
      esportSingleMaxWin: null,
      esportWholeMaxBetRolling: null,
      esportWholeMaxBetMoring: null,
      esportSingleMaxBetRolling: null,
      esportSingleMaxBetMoring: null,
      esportRoundMaxBetRolling: null,
      esportRoundMaxBetMoring: null,
    });
  }
  const verifyValues = () => {
    let flag = false;

    [...sportList].map(item => {
      if (item.gameType === 3) {
        esportKeys.forEach((key: keyof RiskManagementDataAPI.LimitListType) => {
          if (flag) return;
          if (!item[key] || Number(item[key]) === 0) {
            flag = true;
            return;
          }
        })
      } else {
        sportKeys.forEach((key: keyof RiskManagementDataAPI.LimitListType) => {
          if (flag) return;
          if (!item[key] || Number(item[key]) === 0) {
            flag = true;
            return;
          }
        })
      }
    })
    return flag;
  }
  // 等级；修改
  const confirmSportClick = () => {
    const flag = verifyValues();
    if (flag) {
      message('限额字段必须填写及大于0', { type: 'error' });
      return;
    }
    ElMessageBox.confirm(t('确定要修改限额吗？'), t('警告'), {
      center: true
    }).then(async () => {
      loading.value = true;
      const list: any = [];
      let dataType = new Set();
      currentSportId.value === 3 ? (dataType = esportKeys) : (dataType = sportKeys)
      const existKey: { [key: number]: boolean } = {}
      sourceSportList.map((item) => {
        const sport = sportList.find((l) => item.leagueLevel === l.leagueLevel);
        if (sport === null || sport === undefined) return;
        dataType.forEach((key: LimitListType) => {
          const leagueLevel: number = sport.leagueLevel;
          if (existKey[leagueLevel]) return;
          if (item[key] !== sport[key]) {
            list.push({ ...sport, currency: currency.value });
            existKey[leagueLevel] = true;
            return;
          }
        })
      })
      const res = await API.updateLevelLimit(list);
      delList.length = 0;
      loading.value = false;
      isEditSport.value = false;
      message(res.msg, { type: res.code ? 'error' : 'success' });
      onSearch();
    });
  };
  // 编辑取消
  const cancelSportEdit = () => {
    isEditSport.value = false;
    sportList.length = 0;
    sportList.push(...sourceSportList);
  };
  // 删除
  const delSportItem = () => {
    const item = sportList.pop();
    delList.push({ ...item, delFlag: 1 });
  };
  const changeType = (id: number) => {
    currentSportId.value = id;
    cancelSportEdit();
    onSearch();
  };
  const toggle = async (flag: boolean) => {
    const r = await openPasswordInput();
    if (!r) return;
    isEditSport.value = flag;
  }
  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    columns,
    columns2,
    sportList,
    onSearch,
    isEditSport,
    addSportItem,
    confirmSportClick,
    delSportItem,
    cancelSportEdit,
    currentSportId,
    toggle,
    changeType,
    currency,
  };
}
