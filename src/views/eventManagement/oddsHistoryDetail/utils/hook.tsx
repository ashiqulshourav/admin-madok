import { message } from '@/utils/message';
import { columns } from '../component/TableColumnList';
import { VxeTableDefines } from 'vxe-table';

export function useOddsHistoryDetailHook() {
  const list = reactive<EventAPI.getMatchEventWithOddsHistoryResData[]>([]);
  const route = useRoute();
  const loading = ref(false);
  const tableData = ref([]);

  const selectData = reactive<EventAPI.getMatchEventWithOddsHistoryReqType>({
    matchId: route.params.type as string,
    // matchId: '316066',
    dataSourceCode: ['XJ'],
    oddsType: 'OU',
    kindsCode: 'FT_1X2'
  });

  //- 初始化请求
  async function onSearch() {
    loading.value = true;
    const res = await API.getMatchEventWithOddsHistory({
      ...selectData,
      dataSourceCode: (selectData.dataSourceCode as string[]).join('')
    });
    loading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    list.length = 0;
    if (res.data.length > 5000) {
      sliceSaveData(0, res.data);
    } else {
      list.push(...res.data);
    }
  }

  //- 数据量过大进行切片填充数据
  const sliceSaveData = (
    startIdx: number,
    l: EventAPI.getMatchEventWithOddsHistoryResData[]
  ) => {
    const batchSize = 5000;
    const endIndex = Math.min(startIdx + batchSize, l.length);
    list.push(...l.slice(startIdx, endIndex));
    if (endIndex < l.length) {
      setTimeout(() => sliceSaveData(endIndex, l), 0);
    }
  };

  onMounted(() => init());

  const tableColumn = ref<VxeTableDefines.ColumnInfo<any>[]>([]);
  const vxeTableRef = ref();
  const init = async () => {
    await getMatchDetail();
    onSearch();
    nextTick(() => {
      const $table = vxeTableRef.value;
      if ($table) {
        tableColumn.value = $table.getColumns();
        tableColumn.value[3].visible = false;
        tableColumn.value[7].visible = false;
        tableColumn.value[10].visible = false;
        tableColumn.value[11].visible = false;
        vxeTableRef.value.refreshColumn();
      }
    });
  };

  const matchDetail = reactive<EventAPI.oddsHistoryMatchDetailData>(
    {} as EventAPI.oddsHistoryMatchDetailData
  );
  const getMatchDetail = async () => {
    const matchId = +route.params.type;
    const res = await API.oddsHistoryMatchDetail({ matchId });
    if (res.code) return;
    Object.assign(matchDetail, res.data);
  };

  //- 修改赔率 + 玩法
  const changeList = (d: {
    type: 'kindsCode' | 'oddsType';
    val: string;
    c: number;
  }) => {
    if (d.type !== 'oddsType') {
      // 盘口值显示
      tableColumn.value[3].visible = d.c !== 1;
      tableColumn.value[6].visible = d.c === 1 || d.c === 2;
      tableColumn.value[7].visible = d.c === 3;
      tableColumn.value[8].visible = d.c === 1;
      tableColumn.value[9].visible = d.c === 1 || d.c === 2;
      tableColumn.value[10].visible = d.c === 3;
      tableColumn.value[11].visible = d.c === 4;
      tableColumn.value[12].visible = d.c !== 4;
      vxeTableRef.value.refreshColumn();
    }

    selectData[d.type] = d.val;
    onSearch();
  };

  return {
    loading,
    tableData,
    vxeTableRef,
    onSearch,
    matchDetail,
    columns,
    selectData,
    list,
    changeList
  };
}
