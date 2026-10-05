import { DialogOptions, addDialog, closeDialog } from '@/components/ReDialog';
import type { PaginationProps } from '@pureadmin/table';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';
import { message } from '@/utils/message';
import { useSettingStoreHook } from '@/store/settings';
import { SearchFormType } from '../../main/utils/type';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { columns } from '../../main/utils/tableColumnList';
import { SPORT_LIST_MAP } from '../../main/utils/map';
import { BtnClickDialog } from '@/components/ReDialog/type';

export const useSettileHook = () => {
  const dataList = reactive<SattleDataAPI.getSettlementDataList[]>([]);
  const settingStore = useSettingStoreHook();
  const classifyNavList = reactive(SPORT_ID_MAP.slice(0, 9));
  const currentSportId = ref<number>(
    settingStore.settleHistoryPageInfo.matchType ?? 1
  );
  const loading = ref(false);

  const form = reactive<SearchFormType>({
    leagueId: '',
    matchId: '',
    status: '',
    startTime: '',
    endTime: ''
  });

  //- 跳转到特殊结算页面
  const goOtherSattlePage = (row: SattleDataAPI.getSettlementDataList) => {
    router.push(`/settle/football_other_settle_detail/${row.matchId}`);
  };

  //- 取消注单
  const cancelClick = async (row: SattleDataAPI.getSettlementDataList) => {
    const remark = ref('');

    addDialog({
      title: t('取消比赛'),
      width: '20%',
      footerButtons: [
        {
          label: t('取消'),
          btnClick: ({
            dialog: { options, index }
          }: {
            dialog: BtnClickDialog;
          }) => {
            closeDialog(options, index);
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
            options?.footerButtons && (options.footerButtons[1].loading = true);
            const res = await API.cancelBetOrder(params);
            options?.footerButtons &&
              (options.footerButtons[1].loading = false);

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

  //- 跳转详情页面
  const router = useRouter();
  const goDetailPage = (row: SattleDataAPI.getSettlementDataList) => {
    settingStore.save_selttle_history_page_info({
      page: pagination.currentPage,
      matchType: currentSportId.value
    });

    const params = JSON.parse(JSON.stringify(row));
    router.push({
      name: SPORT_LIST_MAP.find(item => item?.value === currentSportId?.value)!
        .linkName,
      state: { params }
    });
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
        await API.getSettlementHistory({
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
      (
        document.querySelector('.table_container .el-scrollbar__wrap') as ElRef
      )?.scroll(0, 0);
    } catch (error) {
      loading.value = false;
    }
  };

  //- 修改分类切换
  const changeNavType = (v: number) => {
    currentSportId.value = v;
    settingStore.save_selttle_history_page_info({
      page: null,
      matchType: null
    });
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
    goOtherSattlePage,
    loading
  };
};
