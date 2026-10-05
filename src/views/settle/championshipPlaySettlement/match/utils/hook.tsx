import { message } from '@/utils/message';
import type { PaginationProps } from '@pureadmin/table';
import { ElMessageBox } from 'element-plus';
import { SearchFormType } from './types';
import { usePublicHooks } from '@/hooks';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { DialogOptions, addDialog, closeDialog } from '@/components/ReDialog';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';
import { usePasswordInputHook } from '@/hooks/passwordInputHook';

export function useChampionshipPlaySettlementHook() {
  const dataList = reactive<EsportsSettlementAPI.ESportMatchList[]>([]);
  const loading = ref(true);
  const matchCondition = ref(1);
  const { switchStyle } = usePublicHooks();
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const searchForm = reactive<SearchFormType>({
    matchId: '',
    matchName: '',
    isSale: '',
    sportId: '',
    startTime: '',
    endTime: '',
    leagueNameCn: '',
    leagueId: '',
    handicapStatus: '',
    status: '',
    category: ''
  });

  const { openPasswordInput } = usePasswordInputHook();

  //- 取消比赛
  const cancelClick = async (row: EsportsSettlementAPI.ESportMatchList) => {
    const remark = ref('');
    const r = await openPasswordInput();
    if (!r) return;
    addDialog({
      title: t('取消比赛'),
      width: '20%',
      footerButtons: [
        {
          label: t('取消'),
          btnClick: ({ dialog: { options, index } }) => {
            closeDialog(options as DialogOptions, index as number);
          }
        },
        {
          type: 'primary',
          loading: false,
          label: t('确认'),
          btnClick: async ({ dialog: { options, index } }) => {
            if (!remark.value) {
              return message(t('请输入取消原因'), { type: 'error' });
            }
            const params = {
              remark: remark.value,
              matchId: row.matchId,
              sportName:
                SPORT_ID_MAP.find(item => item.value === row.sportId)?.label ??
                t('电竞')
            };
            options!.footerButtons![1].loading = true;
            const res = await API.cancelBetOrder(params);
            options!.footerButtons![1].loading = false;

            message(res.msg, {
              type: res.code ? 'error' : 'success'
            });
            closeDialog(options as DialogOptions, index as number);
            if (!res.code) onSearch();
          }
        }
      ],
      contentRenderer: () => (
        <el-form>
          <el-form-item label={t('取消原因:')} required>
            <el-input
              type="textarea"
              rows={4}
              v-model={remark.value}
              placeholder={t('请输入取消原因')}
            />
          </el-form-item>
        </el-form>
      )
    });
  };

  function handleTableWidthChange(pageSize: number) {
    pagination.pageSize = pageSize;
    pagination.currentPage = 1;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  const onSearch = async (type?: 'reload') => {
    if (type === 'reload') pagination.currentPage = 1;
    loading.value = true;
    const res = await API.getChampionSettlementList({
      ...removeEmptyStringKeys(searchForm),
      pageSize: pagination.pageSize,
      pageNum: pagination.currentPage
    });
    loading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    dataList.length = 0;
    dataList.push(...res.data.list);
    pagination.total = res.data.total;
  };

  const changeMatchCondition = (n: number) => {
    matchCondition.value = n;
    onSearch('reload');
  };

  //- 锁盘switch点击
  function changeSwitch({ row }: { row: SaleDataAPI.PreSaleList }) {
    ElMessageBox.confirm(
      row.handicapStatus === 0
        ? t(`确定要解锁选中的比赛么?`)
        : t('确定要锁定选中比赛么?'),
      t('系统提示'),
      {
        confirmButtonText: t('确定'),
        cancelButtonText: t('取消'),
        type: 'warning',
        center: true,
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(async () => {
        let res: EsportsSettlementAPI.lockESportHandicapResType;
        const params = { matchIdList: [row.matchId] };
        res =
          row.handicapStatus === 1
            ? await API.saleBetItemsByMatchIds(params)
            : await API.openBetItemsByMatchId(params);
        if (res.code) return message(res.msg, { type: 'error' });
        message(res.msg, { type: 'success' });
        onSearch();
      })
      .catch(() => (row.handicapStatus = row.handicapStatus === 0 ? 1 : 0));
  }

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    dataList,
    pagination,
    onSearch,
    handleTableWidthChange,
    handleCurrentChange,
    searchForm,
    matchCondition,
    changeMatchCondition,
    cancelClick,
    switchStyle,
    changeSwitch
  };
}
