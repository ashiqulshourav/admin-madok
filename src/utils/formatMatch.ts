import dayjs from 'dayjs';
import { PLAY_MATCH2 } from '@/utils/maps/sports_map';
import { addDecimals, truncateDecimals } from './math';
import {
  EHandicapType,
  EOddType,
  ESportType
} from '@/core/constants/enum/sport';
import { TOrder } from '@/core/services/Table';
import { useMatchStore } from '@/store/match';
import { useI18n } from 'vue-i18n';
import { addDialog } from '@/components/ReDialog/index';
import { t } from '@/plugins/i18n';
import { h } from 'vue';
import IpDialog from '@/views/operateManager/com/bettingCenter/component/IpDialog.vue';

//- 解析当前比分
export const parseMatchScore = (s: string) => {
  const match = s.match(/H(\d+)A(\d+)/);
  if (match) {
    const result = {
      H: parseInt(match[1], 10),
      A: parseInt(match[2], 10)
    };
    return result.H + ' : ' + result.A;
  } else {
    return '-';
  }
};

// 国家显示
export const parseCountry = (countryId: number) => {
  const matchStore = useMatchStore();
  const { locale } = useI18n();
  const country = matchStore.countryList.find(_ => _.countryId === countryId);
  if (!country) return '-';
  return locale.value === 'zh'
    ? country?.countryNameCn
    : country?.countryNameEn;
};
// 通过玩法 code 获取玩法名称
export const getPlayNameByKc = ({code, name, ctid, sportId, period, reslutView}: {code: string, name?: string, ctid?: number, sportId?: number, period?: string, reslutView?: boolean;}) => {
  if (ctid !== undefined && name !== undefined && ctid !== 0) return name;
  if (['OT', 'OT1', 'OT2', 'OHT', 'PT'].includes(period?.toUpperCase())) return name;
  if (reslutView && code ==='FT_1X2') {
    // 赛果获取类型,只是用来展示
    return '全场独赢1X2';
  }
  switch (code) {
  case 'FT_OU':
    switch (Number(sportId)) {
    case 5:
      return '总局数';
    case 9:
        return !name ? '总得分' : '总得分:大 / 小';
    case 10:
      return '大 / 小';
    case 18:
        return !name ?'总得分':'总得分:大 / 小';
    default:
      return '全场大小';
    };
  case 'HT_OU':
    return '半场大小';
  case 'FT_OE':
    return '全场单双';
  case 'FT_HF':
    return '半场 / 全场';
  case 'HT_OE':
    return '单双-上半场';
  case 'FT_AH':
    switch (Number(sportId)) {
    case 6:
    case 3:
      return '全场让盘';
    case 23:
      return '让局';
    case 5:
    case 19:
      return '全场让局';
    default:
      return '全场让球';
    };
  case 'HT_AH':
      switch (Number(sportId)) {
        case 9:
          return !name ? '半场让球' : '让球-上半场';
        default:
          return '半场让球';
      };
  case 'FT_1X2':
  case 'FT_ML':
    return '全场独赢';
  case 'HT_1X2':
  case 'HT_ML':
    return '半场独赢';
  case 'FT_CS':
    return '全场波胆';
  case 'HT_CS':
    return '波胆-上半场';
  case 'BothTeamsToScore':
    return '双方进球';
  case 'FTS_AH':
    return '全场让局';
  case 'FTS_OU':
    return '总局数';
  case 'FT_XX':
    return '全场总分';
  case 'Winner_1X2':
    return '独赢1X2';
  case 'Winner':
    return '全场独赢';
  case 'PT_AH':
    return '让分';
  case 'P222':
    return '战斗赛足回合';
  case 'PT_OU':
    switch (Number(sportId)) {
    case 19:
      return '全场总分';
    default:
      return '总分大小';
    }
  default:
    return name;
  }
};

export const markeTypeMap = {
  1: t('欧洲盘'),
  2: t('香港盘'),
  3: t('马来盘'),
  4: t('印尼盘'),
  5: t('美式盘'),
  6: t('英式盘')
};

export enum EBetResultType {
  NO_RESULT = 0,
  FLAT = 2,
  LOSE = 3,
  WIN = 4,
  WIN_HALF = 5,
  LOSE_HALF = 6,
  MACHT_CANCLE = 7,
  MACHT_DELAY = 8,
  GAME_DELAY = 11,
  GAME_INTERRUPTED = 12, //比赛中断
  UNKNOWN = 13,
  GAME_ABANDONED = 15, //比赛放弃
  ABNORMAL = 16, //盘口异常
  UNKNOWN_STATUS = 17,
  GAME_CANCEL = 18, //比赛取消
  GAME_POSTPONED = 19, //  比赛延期
  ROLLBACK = 20,
  CANCELL = 21,
  AUTO_CANCEL = 22,
  HANDLE_CANCEL = 23,
  HANDICAPS_CANCEL = 24, //盘口取消
  FLAT_MATCH_ROLLBACK = 51,
  RISK_REJECT = 61
}
export const BET_RESULT_TYPE_MAP: { [key in EBetResultType]: string } = {
  [EBetResultType.NO_RESULT]: t('无结果'),
  [EBetResultType.FLAT]: t('走水'),
  [EBetResultType.HANDICAPS_CANCEL]: t('盘口取消'),
  [EBetResultType.LOSE]: t('输'),
  [EBetResultType.WIN]: t('赢'),
  [EBetResultType.WIN_HALF]: t('赢半'),
  [EBetResultType.LOSE_HALF]: t('输半'),
  [EBetResultType.MACHT_CANCLE]: t('赛事取消'),
  [EBetResultType.MACHT_DELAY]: t('赛事延期'),
  [EBetResultType.GAME_DELAY]: t('比赛延迟'),
  [EBetResultType.GAME_INTERRUPTED]: t('比赛中断'),
  [EBetResultType.UNKNOWN]: t('未知'),
  [EBetResultType.GAME_ABANDONED]: t('比赛放弃'),
  [EBetResultType.ABNORMAL]: t('异常盘口'),
  [EBetResultType.UNKNOWN_STATUS]: t('未知赛事状态'),
  [EBetResultType.GAME_CANCEL]: t('比赛取消'),
  [EBetResultType.GAME_POSTPONED]: t('比赛延期'),
  [EBetResultType.ROLLBACK]: t('回滚'),
  [EBetResultType.CANCELL]: t('预约失败'), //21
  [EBetResultType.HANDLE_CANCEL]: t('注单无效'), //23  // 原来 注单取消
  [EBetResultType.AUTO_CANCEL]: t('预约取消'), //22
  [EBetResultType.FLAT_MATCH_ROLLBACK]: t('走水'), // 比分回滚取消结算返还金额,算走水
  [EBetResultType.RISK_REJECT]: t('投注失败') // 风控拒也算走水
};

export const getViewOddFn = (
  od: number,
  type: EOddType,
  currentOddType: number
) => {
  if(!od) return 0;
  if (type === EOddType.ML) {
    od = Number(truncateDecimals(-(1 / od), 2));
  }
  if (type !== EOddType.EUROPE) {
    return truncateDecimals(
      Number(currentOddType === EOddType.EUROPE ? addDecimals(od, 1) : od),
      2
    );
  }
  return truncateDecimals(od, 2);
};

export const formatSeriesType = (seriesType: number, len: number) => {
  switch (seriesType) {
    case 10001013:
      return '10串1013';
    case 10001:
      return '10串1';
    default:
      return perSeriesStr(seriesType, len);
  }
};

export const perSeriesStr = (type: number, len: number) => {
  const frist = String(type).charAt(0);
  if (Number(frist) === len) {
    return String(type).replace('00', '串');
  }
  return String(type).charAt(0) + '串1';
};
export const isVisiableSecondText = (
  betHandicap: string,
  betN: string,
  kc: string
) => {
  if (betN) return false;
  if (kc && kc.endsWith('_TG')) return false;
  // 只有数字才显示
  const temp = Number(betHandicap?.split('/')?.[0]);
  if (!isNaN(temp) && isFinite(temp)) return true;
  return false;
};

export const useSportFormatDetail = row => {
  let score: string;
  if (row.kindsCode === 'FT_CS' || row.kindsCode === 'HT_CS') {
    score = parseMatchScore(row.betHandicap);
  } else {
    const type = row.betHomeOrAway ? row.betHomeOrAway : row.betHandicap;
    score =
      PLAY_MATCH2(row.kindsCode, row.homeTeamNameCn, row.awayTeamNameCn)[
        type
      ] ??
      row.betHandicap ??
      '-';
  }
  const firstLine = `${row.sportNameCn} ${dayjs(row.createTime).format(
    'YYYY-MM-DD HH:mm:ss'
  )}`;
  const secondLine = row.leagueNameCn;
  const thirdLine = `${row.homeTeamNameCn} vs ${row.awayTeamNameCn}`;
  const fourthLine = row.betN
    ? `${row.betN}`
    : `${row.betHomeOrAway} ${row.betHandicap}`;
  const fifthLine = `${
    getPlayNameByKc({
      code: row.kindsCode,
      name: row.betItemName,
      ctid: row.betItemCTID,
      sportId: row.sportId
    }) ?? '-'
  }`;
  return [firstLine, secondLine, thirdLine, fourthLine, fifthLine, score];
};
// 盘口类型, OU:欧盘,1; HK:香港盘,2; ML:马来盘,3; ID:印尼盘,4; US:美式盘,5; GB:英式盘,6;

export type Detail = {
  orderId: number;
  marketType: EHandicapType;
  oddFinally: number;
  sportId: ESportType;
  sportNameCn: string;
  sportNameEn: string;
  matchId: number;
  matchName: string;
  scoreBenchmark?: string; // 根据实际情况可能需要调整
  settleScore: string;
  leagueId: number;
  leagueNameEn?: string; // 根据实际情况可能需要调整
  leagueNameCn?: string; // 根据实际情况可能需要调整
  betItemId: number;
  betItemName: string;
  createTime: string;
  homeTeamNameEn: string;
  awayTeamNameEn: string;
  homeTeamNameCn: string;
  awayTeamNameCn: string;
  betResult: EBetResultType;
  kindsCode?: string;
  betHomeOrAway?: string;
  betHandicap?: string;
  isInplay: number;
  beginTime: string;
  settleTime: string;
  betItemCTID: number;
  oddValue: number;
  betN: string;
};
// 获取投注球队或其他玩法---------适用于已投注接口数据返回
export const getBetTeamType = (info: Detail) => {
  const { betHomeOrAway, betHandicap, kindsCode } = info;
  const teams = {
    home: {
      name: info.homeTeamNameCn
    },
    away: {
      name: info.awayTeamNameCn
    }
  };
  return getOrderBetTypeAtBetting({
    betName: info.betN,
    betTeam: betHomeOrAway ? betHomeOrAway : betHandicap,
    orderName: betHandicap,
    teams,
    kc: kindsCode
  } as any);
};

// 转换 投注项名称
export const getNameByhoa = (
  name: string,
  kc?: string,
  TOrder?: TOrder,
  inMainList = false
) => {
  if (kc === 'FT_HF') {
    const map: any = {
      H: TOrder.teams.home.name,
      A: TOrder.teams.away.name,
      D: t('和')
    };
    return name
      .split('')
      .map(item => map[item])
      .join(' / ');
  } else if (kc && kc.endsWith('_TG')) {
    return name.includes('UP')
      ? name.replace('UP', t('及以上'))
      : name.split('').join('~');
  } else if (kc === 'FT_TTS') {
    if (name.toUpperCase() === 'FIRST') return t('无进球');
  }
  if (
    inMainList &&
    (name === TOrder.teams.home.name || name === TOrder.teams.away.name)
  ) {
    if (name === TOrder.teams.home.name) return t('主');
    if (name === TOrder.teams.away.name) return t('客');
  }
  switch (name?.toUpperCase()) {
    case 'HOME':
      return t('主');
    case 'AWAY':
      return t('客');
    case 'DRAW':
      return t('平局');
    case 'ODD':
      return t('单');
    case 'EVEN':
      return t('双');
    case 'OVER':
      return t('大');
    case 'UNDER':
      return t('小');
    case 'FIRST':
      return t('首个进球');
    case 'LAST':
      return t('最后进球');
    default:
      return name;
  }
};

export const enterGoalMap = {
  FIRST: t('首个进球'),
  LAST: t('最后进球')
};

export const assertHomeAwayScore = (scoreString: string) => {
  if (!scoreString) return '';
  const score = scoreString.replace('A', ' ').replace('H', '').split(' ');
  if (!score) return '';
  return score;
};
// 获取注单玩法具体详情-----------适用于下注时本地数据展示
type TeamType = 'home' | 'away' | undefined;
export const getOrderBetTypeAtBetting = (order: TOrder) => {
  const { betTeam, orderName, teams, kc } = order;
  const lname = betTeam?.toLowerCase();
  if (['FT_TTS'].includes(order.kc)) {
    if (betTeam === 'Draw') return t('无进球');
    return orderName === 'Last'
      ? `最后进球/${order.betName}`
      : `首个进球/${order.betName}`;
  }
  if (order.betName) {
    return order.betName;
  }
  if (kc && kc.endsWith('_TG')) {
    return getNameByhoa(betTeam, kc, order);
  }
  if (['FT_CS', 'HT_CS'].includes(order.kc)) {
    if (orderName === 'AOS') return t('其他');
    const [home, away] = assertHomeAwayScore(orderName);
    return home + '-' + away;
  }

  if (kc === 'FT_HF') {
    return getNameByhoa(betTeam, kc, order);
  }
  if (betTeam === orderName && ['home', 'away'].includes(lname)) {
    return teams[lname as TeamType].name;
  }
  if (betTeam === orderName && !['home', 'away'].includes(lname)) {
    return getNameByhoa(betTeam);
  }
  if (betTeam !== orderName && ['over', 'under'].includes(lname)) {
    return getNameByhoa(betTeam);
  }
  if (betTeam !== orderName && ['home', 'away'].includes(lname)) {
    return teams[lname as TeamType].name;
  }
  return orderName;
};

//计算串关的总赔率，非复式
export const calculateSeriesTypeTotal = (list: any) => {
  let oddTotal = 1;
  list.forEach(
    (item: {
      oddFinally: number;
      marketTypeFinally: EOddType;
      marketType: number;
    }) => {
      //先转换为欧洲盘再计算
      oddTotal *= Number(
        getViewOddFn(item.oddFinally, item.marketTypeFinally, EOddType.EUROPE)
      );
    }
  );
  return '@' + truncateDecimals(oddTotal, 2);
};

export const calculateSeriesTypeTotalBets = (seriesType: number) => {
  const str = seriesType && seriesType.toString();
  const arr = str?.split('00') || [];
  return arr.length > 0 ? arr[1] : '';
};

// 获取比分
export const displayHomeAwayScore = (
  scoreString: string,
  sprotId?: ESportType,
  witchTeam?: TeamType
) => {
  const _sprotId = Number(sprotId);
  if (_sprotId > 33) return '';
  if (_sprotId === ESportType.TENNIS || _sprotId === ESportType.VOLLEYBALL)
    return '';
  const [home, away] = assertHomeAwayScore(scoreString);
  if (home === undefined || away === undefined) {
    return '';
  }
  if (witchTeam) {
    if (witchTeam === 'home') {
      return home;
    } else if (witchTeam === 'away') {
      return away;
    }
  }
  return `${home}-${away}`;
};

export const getIsInplay = (type: number) => {
  return type === 1 ? t('滚球') : type === 2 ? t('冠军盘') : t('早盘');
};

export const openIpDialog = (ip: string) => {
  addDialog({
    title: t(''),
    alignCenter: true,
    class: 'reset_dialog',
    width: '75%',
    center: true,
    closeOnClickModal: false,
    hideFooter: true,
    contentRenderer: () => h(IpDialog, { ip })
  });
};
