import { message } from '@/utils/message';
import { reactive, ref } from 'vue';

export function useAppointmentHook() {
  const dataList = reactive<RiskManagementDataAPI.getLeagueConfigListType[]>([]);
  const loading = ref(true);
  const currentSportId = ref(1);

  async function onSearch() {
    try {
      loading.value = true;
      const res =
        await API.getLeagueConfigList({
          sportId: currentSportId.value
        });
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      res.data.list.push(res.data.list.shift() as RiskManagementDataAPI.getLeagueConfigListType)
      dataList.length = 0;
      dataList.push(...res.data.list);
    } catch (error) {
      loading.value = false;
    }
  }

  const upateLeagueStatus = async (row: RiskManagementDataAPI.getLeagueConfigListType) => {
    const res = await API.updateLeagueConfig({
      id: row.id,
      reservationSwitch: row.reservationSwitch,
      updatedBy: ''
    })
    message(res.msg, { type: res.code ? 'error' : 'success' })
    if (res.code) row.reservationSwitch = row.reservationSwitch === 0 ? 1 : 0
    if (!res.code) onSearch();

  }

  onMounted(() => {
    onSearch()
  })

  //- 游戏切换
  const changeNavType = (v: number) => {
    currentSportId.value = v;
    onSearch()
  }

  return {
    loading, dataList, onSearch, upateLeagueStatus,
    changeNavType, currentSportId
  };
}
