import { ESPORT_ID_MAP, SPORT_ID_MAP } from '@/utils/maps/sports_map';
import dayjs from 'dayjs';
import { t } from '@/plugins/i18n';
import { matchMethod, matchSource } from '../utils/map';
import { ElSwitch } from 'element-plus';
import { matchCombineHook } from '../utils/hook';
import { handleTableWidth } from '@/utils/getTableWidth';

export function tableColumnList() {
  const { getGlobalOddsSwitch, globalOddsSwitch, getOdds } = matchCombineHook();

  const isOn = ref(globalOddsSwitch);

  const updateSwitchValue = (value: boolean) => {
    isOn.value = value;
  };

  const onClickSwitch = () => {
    getOdds({ matchId: '', isDataSourceOdds: isOn.value ? 1 : 0 }, 1);
  };

  onMounted(() => {
    getGlobalOddsSwitch();
  });

  const columns: TableColumnList = [
    {
      label: t('赛种'),
      prop: 'sportId',
      headerRenderer: d => handleTableWidth(d, t('赛种'), 'auto'),
      formatter: ({ sportId, category }): string => {
        const arr = category === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
        return arr.find(_ => _.value === sportId)?.label ?? '-';
      },
      minWidth: 150
    },
    {
      label: t('赛事ID'),
      prop: 'matchId',
      headerRenderer: d => handleTableWidth(d, t('赛事ID'), 'auto'),
      minWidth: 120
    },
    {
      label: t('联赛'),
      showOverflowTooltip: true,
      slot: 'leagueName',
      // headerRenderer: d => handleTableWidth(d, t('联赛'), 'auto'),
      width: 250,
      minWidth: 250
    },
    {
      label: t('主队'),
      showOverflowTooltip: true,
      slot: 'homeTeamName',
      minWidth: 200
    },
    {
      label: t('客队'),
      showOverflowTooltip: true,
      slot: 'awayTeamName',
      align: 'left',
      width: 250
    },
    {
      label: t('开赛时间'),
      prop: 'beginTime',
      minWidth: 200,
      formatter: ({ beginTime }) =>
        dayjs(beginTime).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      label: t('数据源'),
      prop: 'dataSourceCode',
      minWidth: 150,
      headerRenderer: d => handleTableWidth(d, t('数据源'), 'auto'),
      formatter: ({ dataSourceCode }) =>
        matchSource.find(_ => _.value === dataSourceCode)?.label ?? '-'
    },
    {
      label: t('匹配方式'),
      prop: 'pairingType',
      minWidth: 150,
      formatter: ({ pairingType }) =>
        matchMethod.find(_ => _.value === pairingType)?.label ?? '-'
    },
    {
      // label: t('获取赔率数据'),
      slot: 'isDataSourceOdds',
      minWidth: 200,
      headerRenderer: () => {
        return (
          <template class="flex items-center justify-center">
            {t('获取赔率数据')}
            <ElSwitch
              modelValue={isOn.value}
              class="ml-1"
              activeText={t('全部')}
              inactiveText={t('全部')}
              inlinePrompt={true}
              onChange={updateSwitchValue}
              onClick={onClickSwitch}
            />
          </template>
        );
      }
    },
    {
      label: t('操作人'),
      prop: 'pairingUser',
      headerRenderer: d => handleTableWidth(d, t('操作人'), 'auto'),
      minWidth: 100
    },
    {
      label: t('操作时间'),
      headerRenderer: d => handleTableWidth(d, t('操作时间'), 'auto'),
      prop: 'pairingTime',
      minWidth: 100
    },
    {
      label: t('操作'),
      fixed: 'right',
      width: 100,
      slot: 'operation'
    }
  ];

  const matchColumns: TableColumnList = [
    {
      label: t('数据源'),
      prop: 'dataSource',
      formatter: ({ dataSourceCode }) =>
        matchSource.find(_ => _.value === dataSourceCode)?.label ?? '-'
    },
    {
      label: t('赛事ID'),
      prop: 'matchId'
    },
    {
      label: t('联赛'),
      slot: 'leagueName',
      align: 'left'
    },
    {
      label: t('主队'),
      slot: 'homeTeamName',
      align: 'left'
    },
    {
      label: t('客队'),
      slot: 'awayTeamName',
      align: 'left'
    },
    {
      label: t('开赛时间'),
      prop: 'beginTime',
      formatter: ({ beginTime }) =>
        dayjs(beginTime).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      label: t('操作'),
      slot: 'operation',
      minWidth: 120
    }
  ];

  const selectedEventColumns = [
    {
      label: t('赛事ID'),
      keys: ['matchId']
    },
    {
      label: t('联赛名称'),
      keys: ['leagueNameCn', 'leagueNameEn']
    },
    {
      label: t('主队名称'),
      keys: ['homeTeamNameCn', 'homeTeamNameEn']
    },
    {
      label: t('客队名称'),
      keys: ['awayTeamNameCn', 'awayTeamNameEn']
    },
    {
      label: t('比赛开始时间'),
      keys: ['beginTime']
    }
  ];

  return {
    columns,
    matchColumns,
    selectedEventColumns,
    isOn
  };
}
