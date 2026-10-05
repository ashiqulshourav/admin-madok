//- icon图标状态

import { subtraction } from '@pureadmin/utils';

/* 2-开盘 3-封盘 4-锁盘 0-关盘 */
export enum SALE_STATUS {
  close = 3,
  open = 2,
  sealing = 0,
  lock = 4
}

export const icon_msg_tip = {
  [SALE_STATUS.close]: t('确定要关盘么?'),
  [SALE_STATUS.open]: t('确定要开盘么?'),
  [SALE_STATUS.sealing]: t('确定要封盘么?'),
  [SALE_STATUS.lock]: t('确定要锁盘么?')
};

export enum MATCH_STATUS {
  nover = 'nover',
  over = 'over', //结束
  nobegin = 'nobegin',
  canceled = 'canceled' //取消
}

//- 波胆集合
export const BO_DAN_CODE_LIST = ['FT_CS', 'HT_CS'];

//- 进球数
export const goalScoring = (
  kindsCode: string,
  handicap: string,
  n: string,
  homeTeamNameCn: string,
  awayTeamNameCn: string,
  renderName?: string
) => {
  const a = [
    'FT_OU_1p5_And_1stTeamToScore',
    'DoubleChance_And_FT_OU_3p5',
    'FT_1X2_And_BothTeamsToScore',
    'FT_OU_4p5_And_1stTeamToScore',
    'FT_OU_3p5_And_BothTeamsToScore',
    'DoubleChance_And_FT_OU_4p5',
    'FT_TTS',
    'HalfWithMostGoals'
  ];
  const b = ['FT_TG', 'HT_TG'];
  const c = ['Outright'];
  if (n) return n;
  switch (true) {
    case a.includes(kindsCode):
      return handicap.toUpperCase() === 'FIRST' ? t('无进球') : n;
    case b.includes(kindsCode):
      if (handicap.includes('UP')) {
        return handicap.replace('UP', t('及以上'));
      } else {
        return handicap.split('').join('~');
      }
    case c.includes(kindsCode):
      return handicap;
    case BO_DAN_CODE_LIST.includes(kindsCode):
      return `${renderName} ${handicap}`;
    case kindsCode === 'FT_HF':
      const map: any = {
        H: homeTeamNameCn,
        A: awayTeamNameCn,
        D: '和'
      };
      return handicap
        .split('')
        .map(item => map[item])
        .join(' / ');
    default:
      break;
  }
};

// 反波胆内容格式化
const BoDanSort = (a: any, b: any) => {
  const [aFirst, aSecond] = a.handicap.split('-');
  const [bFirst, bSecond] = b.handicap.split('-');
  if (aFirst !== bFirst) {
    return parseInt(aFirst) - parseInt(bFirst);
  }
  return parseInt(aSecond) - parseInt(bSecond);
};

// 波胆数据格式转换
export const transferBoDanCol = (
  d: sportTradingDataAPI.MainBetItemsDtoList,
  homeTeamNameCn: string,
  awayTeamNameCn: string
) => {
  const list1: any[] = [];
  const list2: any[] = [];
  const list3: any[] = [];
  let other: any = null;
  d.kindsCodeDtoList[0].betItemsDtoList.forEach(item => {
    const temp = { ...item };
    if (temp.handicap === 'AOS') {
      temp.handicap = t('其他');
      other = temp;
    } else {
      const h = temp?.handicap?.match(/H(\S*)A/)![1];
      const a = temp.handicap.split('A')[1];
      temp.handicap = `${h}-${a}`;
      if (/[0-9]/.test(h) && /[0-9]/.test(a)) {
        if (h > a) list1.push({ ...temp, renderName: homeTeamNameCn });
        if (h === a) list2.push({ ...temp, renderName: t('平局') });
        if (h < a) list3.push({ ...temp, renderName: awayTeamNameCn });
      }
    }
  });

  list1.sort(BoDanSort);
  list2.sort(BoDanSort);
  list3.sort(BoDanSort);
  if (other) {
    list2.push(other);
  }
  const s = JSON.parse(JSON.stringify(d.kindsCodeDtoList));
  d.kindsCodeDtoList = [
    { ...s[0], betItemsDtoList: list1 },
    { ...s[0], betItemsDtoList: list2 },
    { ...s[0], betItemsDtoList: list3 }
  ];
  return d.kindsCodeDtoList;
};

//- 玩法声明映射
export const PLAY_MATCH_NAME = (
  kindsCode: string,
  handicap: string,
  homeTeamNameCn: string,
  awayTeamNameCn: string
): any => {
  const t1 = [
    'Q1_OU',
    'Q2_OU',
    'Q3_OU',
    'Q4_OU',
    'HT_OU',
    'S1_OU',
    'S2_OU',
    'S3_OU',
    'S4_OU',
    'FTS_OU',
    'FT_OU',
    'PT_OU'
  ];
  const t2 = [
    'HT_AH',
    'FT_AH',
    'FTS_AH',
    'Q4_AH',
    'Q3_AH',
    'Q1_AH',
    'Q2_AH',
    'S1_AH',
    'S2_AH',
    'S3_AH',
    'S4_AH',
    'PT_AH',
    'WinningMargin'
  ];
  const t3 = ['FT_OE', 'HT_OE'];
  const t4 = [
    'FT_1X2',
    'HT_1X2',
    'S1_ML',
    'S2_ML',
    'S3_ML',
    'S4_ML',
    'Q1_ML',
    'Q2_ML',
    'Q3_ML',
    'Q4_ML',
    'FT_ML',
    'HT_ML',
    'Winner_2ndFrame',
    'Winner_1stFrame',
    'Winner',
    'Winner_1X2',
    'win_18280',
    'BothTeamsToScore'
  ];
  switch (true) {
    case t1.includes(kindsCode):
      return {
        Over: `${t('大')} ${handicap}`,
        Under: `${t('小')} ${handicap}`
      };
    case t2.includes(kindsCode):
      return {
        Home: `${homeTeamNameCn} ${handicap}`,
        Away: `${awayTeamNameCn} ${handicap}`
      };
    case t3.includes(kindsCode):
      return {
        Odd: t('单'),
        Even: t('双')
      };
    case t4.includes(kindsCode):
      return {
        Home: t('主'),
        Away: t('客'),
        Draw: t('平局')
      };
    default:
      return {
        Home: null,
        Away: null,
        Draw: null
      };
  }
};

// export const resetDpodds = (dpOdds: number) => {
//   if (Math.abs(dpOdds) === 1) {
//     return -1;
//   } else if (dpOdds > 0) {
//     return subtraction(dpOdds, 2, 2);
//   } else {
//     return subtraction(2, Math.abs(dpOdds), 2);
//   }
// };
export const resetDpodds = (dpOdds: number) => {
  if (Math.abs(dpOdds) === 1) {
    return -1;
  } else if (dpOdds > 0) {
    return subtraction(dpOdds, 2, 2);
  } else {
    return subtraction(2, Math.abs(dpOdds), 2);
  }
};

//- 盘口类型映射

export const ODDS_TYPE_MAP: { [key: string]: string } = {
  OU: 'EU',
  HK: t('香港盘'),
  ML: 'MY',
  ID: t('印尼盘'),
  US: t('美国盘'),
  GB: t('英国盘')
};
