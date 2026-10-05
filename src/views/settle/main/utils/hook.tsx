import { DialogOptions, addDialog, closeDialog } from '@/components/ReDialog';
import type { PaginationProps } from '@pureadmin/table';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';
import { message } from '@/utils/message';
import { useSettingStoreHook } from '@/store/settings';
import { SearchFormType } from './type';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { columns } from './tableColumnList';
import { SPORT_LIST_MAP, SPORT_NAME_TYPE } from './map';
import { usePasswordInputHook } from '@/hooks/passwordInputHook';

export const useSettileHook = () => {
  const dataList = reactive<SattleDataAPI.getSettlementDataList[]>([]);
  const settingStore = useSettingStoreHook();
  const classifyNavList = reactive(SPORT_ID_MAP.slice(0, 9));
  const currentSportId = ref<number>(
    settingStore.settlePageInfo.matchType ?? SPORT_NAME_TYPE.football
  );
  const loading = ref(false);

  const form = reactive<SearchFormType>({
    leagueId: '',
    matchId: '',
    status: '',
    periodType: '',
    startTime: '',
    endTime: ''
  });
  const { openPasswordInput } = usePasswordInputHook();

  //- 取消注单
  const cancelClick = async (row: SattleDataAPI.getSettlementDataList) => {
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
            if (!remark.value)
              return message(t('请输入取消原因'), { type: 'error' });
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

            closeDialog(options, index);
            if (!res.code && res.code !== undefined) {
              onSearch();
              message(res.msg, { type: 'success' });
            }
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

  //- 跳转详情页面
  const router = useRouter();
  const goDetailPage = (row: SattleDataAPI.getSettlementDataList) => {
    settingStore.save_selttle_page_info({
      page: pagination.currentPage,
      matchType: currentSportId.value
    });
    const params = JSON.parse(JSON.stringify(row));
    router.push({
      name: SPORT_LIST_MAP.find(item => item.value === currentSportId.value)!
        .linkName,
      state: { params }
    });
  };

  //- 跳转到特殊结算页面
  const goOtherSattlePage = (row: SattleDataAPI.getSettlementDataList) => {
    router.push(`/settle/football_other_settle_detail/${row.matchId}`);
  };

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: settingStore.settlePageInfo.page ?? 1
  });

  const handleTableWidthChange = (pageSize: number) => {
    pagination.pageSize = pageSize;
    onSearch();
  };

  const handleCurrentChange = (val: number) => {
    pagination.currentPage = val;
    onSearch();
  };

  /** 搜索初始化 */
  const onSearch = async (type?: 'reload') => {
    try {
      if (type === 'reload') pagination.currentPage = 1;
      const data = removeEmptyStringKeys(form ?? {});
      loading.value = true;
      const res: SattleDataAPI.getSettlementListRes =
        await API.getSettlementList({
          ...data,
          pageSize: pagination.pageSize,
          pageNum: pagination.currentPage,
          sportId: currentSportId.value
        });
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });

      dataList.length = 0;
      dataList.push(...res.data.list);
      pagination.total = res.data.total;
      document
        .querySelector('.table_container .el-scrollbar__wrap')!
        .scroll(0, 0);
    } catch (error) {
      loading.value = false;
    }
  };

  //- 修改分类切换
  const changeNavType = (v: number) => {
    currentSportId.value = v;
    settingStore.save_selttle_page_info({ page: null, matchType: null });
    form.periodType = '';
    onSearch('reload');
  };

  onMounted(() => onSearch());

  return {
    form,
    onSearch,
    columns,
    dataList,
    pagination,
    handleTableWidthChange,
    handleCurrentChange,
    classifyNavList,
    changeNavType,
    goDetailPage,
    currentSportId,
    cancelClick,
    loading,
    goOtherSattlePage
  };
};
