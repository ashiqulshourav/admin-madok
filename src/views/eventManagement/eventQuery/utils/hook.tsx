import { searchFormType } from './types';
import type { PaginationProps } from '@pureadmin/table';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { message } from '@/utils/message';
import { addThousandSeparator } from '@/utils/formatNumber';
import { usePublicHooks } from '@/hooks';
const { exportDialog } = usePublicHooks();

export function useEventQueryHook() {
  const matchEventList = reactive<EventAPI.MatchEvent[]>([]);
  const matchInfo = reactive<EventAPI.MatchInfo>({
    aTeamName: '',
    hTeamName: '',
    league: '',
    matchId: '',
    level: '',
    sportName: '',
    riskLevel: '',
    leagueId: '',
    startDateTime: ''
  });
  const loading = ref(false);

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 30,
    currentPage: 1,
    background: true
  });

  const form = reactive<searchFormType>({
    matchId: '',
    dataSourceCode: '',
    eventCode: [],
    operationMethod: ' ',
    endTime: '',
    startTime: '',
    canceled: ' '
  });

  async function onSearch(type?: string) {
    return new Promise((resolve, reject) => {
      if (type === 'reload' || type === 'init') pagination.currentPage = 1;
      if (!form.matchId) {
        matchEventList.length = 0;
        pagination.total = 0;
        matchInfo.aTeamName = '';
        matchInfo.hTeamName = '';
        matchInfo.leagueId = '';
        matchInfo.league = '';
        matchInfo.riskLevel = '';
        matchInfo.level = '';
        matchInfo.matchId = '';
        matchInfo.sportName = '';
        matchInfo.startDateTime = '';
        setTimeout(() => {
          const resizeEvent = new Event('resize');
          window.dispatchEvent(resizeEvent);
        }, 200);
        return;
      }

      try {
        if (type !== 'export') {
          loading.value = true;
        }
        const temp = Array.isArray(form.eventCode) ? [...form.eventCode] : [];

        API.getMatchEventByMatchId({
          ...removeEmptyStringKeys({
            ...form,
            eventCode: temp?.length ? temp.toString() : ''
          }),
          pageSize: pagination.pageSize,
          pageNum: pagination.currentPage
        }).then(res => {
          loading.value = false;
          if (res.code) return message(res.msg, { type: 'error' });
          if (res.data !== null) {
            resolve(res?.data);
            if (type === 'export') {
              return;
            }
            matchEventList.length = 0;
            if (type === 'init') {
              API.getMatchInfoByMatchId({
                matchId: form.matchId
              }).then(matchInfoRes => {
                if (matchInfoRes?.code)
                  return message(res?.msg, { type: 'error' });
                matchInfo.aTeamName = matchInfoRes.data.aTeamName;
                matchInfo.hTeamName = matchInfoRes.data.hTeamName;
                matchInfo.leagueId = matchInfoRes.data.leagueId;
                matchInfo.league = matchInfoRes.data.league;
                matchInfo.level = matchInfoRes.data.level;
                matchInfo.riskLevel = matchInfoRes.data.riskLevel;
                matchInfo.matchId = matchInfoRes.data.matchId;
                matchInfo.sportName = matchInfoRes.data.sportName;
                matchInfo.startDateTime = matchInfoRes.data.startDateTime;
              });
            }

            matchEventList.push(...res.data.list);
            pagination.total = res.data.total;
          } else {
            reject();
            matchEventList.length = 0;
          }
          setTimeout(() => {
            const resizeEvent = new Event('resize');
            window.dispatchEvent(resizeEvent);
          }, 200);
        });
      } catch (error) {
        loading.value = false;
        reject();
      }
    });
  }

  function handleTableWidthChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }
  function handlePageSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }
  const router = useRouter();
  const exportFile = async () => {
    onSearch('export').then((expRes: EventAPI.matchEventList) => {
      if (expRes.list.length > 500000) {
        message(
          `当前条件下数据量为${addThousandSeparator(
            expRes.list.length.toString()
          )}，大于50万条，不支持导出!`,
          { type: 'error' }
        );
      } else if (expRes?.list.length < 1 || expRes === null) {
        message('数据量为零，无法导出', { type: 'error' });
      } else {
        exportDialog({
          firstTitle: t('导出当前事件列表数据?'),
          router,
          callback: async () => {
            const res = await API.matchEventDataExport({
              ...removeEmptyStringKeys({
                ...form,
                eventCode: form.eventCode?.length
                  ? form.eventCode?.toString()
                  : ''
              })
            });
            if (res.code) return message(res.msg, { type: 'error' });
          }
        });
      }
    });
  };

  return {
    loading,
    pagination,
    onSearch,
    form,
    handleTableWidthChange,
    handleCurrentChange,
    matchEventList,
    handlePageSizeChange,
    matchInfo,
    exportFile
  };
}
