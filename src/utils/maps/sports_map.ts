import { t } from '@/plugins/i18n';

export const SPORT_ID_MAP = [
  { label: t('足球'), value: 1, type: 'FootBall' },
  { label: t('篮球'), value: 2, type: 'BasketBall' },
  { label: t('网球'), value: 3, type: 'Tennis' },
  { label: t('排球'), value: 6, type: 'Volleyball' },
  { label: t('斯诺克/台球'), value: 5, type: 'Billiards' },
  { label: t('手球'), value: 11, type: 'Handball' },
  { label: t('冰球'), value: 12, type: 'IceHockey' },
  { label: t('羽毛球'), value: 19, type: 'Badminton' },
  { label: t('乒乓球'), value: 23, type: 'PingPong' },
  { label: t('英式橄榄球'), value: 9, type: 'Rugby' },
  { label: t('板球'), value: 13, type: 'Cricket' },
  { label: t('曲棍球'), value: 28, type: 'Hockey' },
  { label: t('飞镖'), value: 8, type: 'Darts' },
  { label: t('棒球'), value: 18, type: 'Baseball' },
  { label: t('拳击/格斗'), value: 10, type: 'Boxing' },
  { label: t('美式足球'), value: 16, type: 'AmericanFootball' },
  // { label: t('特别项目'), value: 7, type: 'SpecialProjects' },
  // { label: t('电子竞技'), value: 4, type: 'FootBall' },
];

export const FULL_SPORT_ID_MAP = [
  { label: t('足球'), value: 1, type: 'FootBall' },
  { label: t('篮球'), value: 2, type: 'BasketBall' },
  { label: t('网球'), value: 3, type: 'Tennis' },
  { label: t('斯诺克/台球'), value: 5, type: 'Billiards' },
  { label: t('排球'), value: 6, type: 'Volleyball' },
  { label: t('飞镖'), value: 8, type: 'Darts' },
  { label: t('英式橄榄球'), value: 9, type: 'Rugby' },
  { label: t('拳击/格斗'), value: 10, type: 'Boxing' },
  { label: t('手球'), value: 11, type: 'Handball' },
  { label: t('冰球'), value: 12, type: 'IceHockey' },
  { label: t('板球'), value: 13, type: 'Cricket' },
  { label: t('美式足球'), value: 16, type: 'AmericanFootball' },
  { label: t('羽毛球'), value: 19, type: 'Badminton' },
  { label: t('乒乓球'), value: 23, type: 'PingPong' },
  // { label: t('曲棍球'), value: 28, type: 'Hockey' }
];
export const MATH_RULE = {
  basketBall: [
    { key: 2, val: t('上下半场制') },
    { key: 4, val: t('四节制') },
  ],
  americanFootball: [
    { key: 2, val: t('上下半场制') },
    { key: 3, val: t('三节制') },
    { key: 4, val: t('四节制') },
  ],
  otherMatch: [
    { key: 3, val: t('三盘两胜制') },
    { key: 5, val: t('五盘三胜制') },
  ]
}

export const ESPORT_ID_MAP = [
  { value: 276, label: t('刀塔2') },
  { value: 277, label: t('反恐精英2') },
  { value: 278, label: t('英雄联盟') },
  { value: 279, label: t('王者荣耀') },
  { value: 280, label: t('LOL:激斗峡谷') },
  { value: 281, label: t('永劫无间') },
  { value: 282, label: t('无尽对决') },
  { value: 285, label: t('传说对决') },
  { value: 286, label: t('无畏契约') },
  { value: 287, label: t('MMA综合格斗') },
  { value: 288, label: t('绝地求生') },
  { value: 289, label: t('穿越火线') },
  { value: 290, label: t('守望先锋') },
  { value: 291, label: t('星际争霸2') },
  { value: 292, label: t('火箭联盟') },
  { value: 293, label: t('彩虹六号') },
  { value: 294, label: t('炉石传说') },
  { value: 295, label: t('FIFA足球世界') },
  { value: 296, label: t('使命召唤') },
  { value: 297, label: t('魔兽争霸3') }
];

export const MATCH_EVENT_CODE = {
  goal: t('足球进球'),
  yellow_red_card: t('红牌/黄牌'),
  corner: t('角球'),
  yellow_card: t('黄牌'),
  red_card: t('红牌')
  // match_status: t('比赛阶段'),
};

type MatchFormatType = {
  [key: number]: string | { [key: number]: string };
};

export const MATCH_FORMAT: MatchFormatType = {
  2: {
    2: t('两节制（上下半场）'),
    4: t('四节制')
  },
  16: {
    2: t('两节制（上下半场）'),
    3: t('三节制'),
    4: t('四节制')
  },
  1: t('两节制（上下半场）'),
  3: t('其它'),
  6: t('其它'),
  5: t('其它'),
  11: t('两节制（上下半场）'),
  12: t('三节制'),
  19: t('三节制'),
  23: t('其它'),
  9: t('两节制（上下半场）'),
  13: t('其它'),
  28: t('四节制'),
  8: t('其它'),
  18: t('其它'),
  10: t('其它'),
  276: t('其它'),
  277: t('其它'),
  278: t('其它'),
  279: t('其它'),
  280: t('其它:激斗峡谷'),
  281: t('其它'),
  282: t('其它'),
  285: t('其它'),
  286: t('其它'),
  287: t('其它'),
  288: t('其它'),
  289: t('其它'),
  290: t('其它'),
  291: t('其它'),
  292: t('其它'),
  293: t('其它'),
  294: t('其它'),
  295: t('其它'),
  296: t('其它'),
  297: t('其它'),
}


export const MATCH_STATUS = {
  nover: t('滚球'),
  over: t('比赛结束'),
  nobegin: t('未开始')
};
export const ESPORT_MATCH_STATUS = {
  nover: t('比赛中'),
  over: t('比赛结束'),
  nobegin: t('未开赛'),
};

//- 上半场 ｜ 下半场
export const MATCH_LEVEL = {
  6: t('上半场'),
  7: t('下半场')
};

//- 主队 ｜ 客队
export const HOME_AWAY = {
  home: t('主队'),
  away: t('客队')
};

//- 冠军 + 电竞 + 足球特殊结算 赢
export enum RESULT_MAP {
  new_win = 4,
  old_win = 1,
  new_lose = 3,
  old_lose = 0
}

// export const PANDA_MATCH_STATUS = {
//   0: t('未匹配'),
//   1: t('成功匹配'),
//   2: t('匹配失败'),
// }

// 开售状态映射
export const OPENING_STATUS = {
  0: t('未开售'),
  1: t('早盘'),
  2: t('滚球'),
  3: t('进行中')
};
//- 盘口状态
export const HANDICAP_STATUS = {
  0: t('未锁盘'),
  1: t('锁盘')
};

export const YELLOW_OR_RED = {
  yellow_card: 1,
  red_card: 2
};

// 格斗 / 曲棍球 / 飞镖
export const MATCH_PERIOD = {
  Q1: ' 第一节',
  Q2: ' 第二节 ',
  Q3: ' 第三节 ',
  Q4: ' 第四节 ',
  Q5: ' 第五节 ',
  Q6: ' 第六节 ',
  Q7: ' 第七节 ',
  Q8: ' 第八节 ',
  Q9: ' 第九节 ',
  Q10: ' 第十节 ',
  Q11: ' 第十一节 ',
  Q12: ' 第十二节 ',
  OT: ' 加时赛'
};

//- 玩法声明映射
export const PLAY_MATCH = (code: string) => {
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
  const t4 = ['FT_1X2', 'HT_1X2'];
  const t5 = [
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
    'FT_TG',
    'Winner_2ndFrame',
    'Winner_1stFrame',
    'Winner',
    'Winner_1X2',
    'ToWinToNil',
    'FT_1X2_And_BothTeamsToScore',
  ];
  switch (true) {
    case t1.includes(code):
      return {
        Over: t('大'),
        Under: t('小')
      };
    case t2.includes(code):
      return {
        Home: t('主'),
        Away: t('客')
      };
    case t3.includes(code):
      return {
        hideMiddle: true,
        Odd: t('单'),
        Even: t('双')
      };
    case t4.includes(code):
      return {
        hideMiddle: true,
        Home: t('主胜'),
        Away: t('客胜'),
        Draw: t('平')
      };
    case t5.includes(code):
      return {
        hideMiddle: true,
        Home: t('主'),
        Away: t('客')
      };
    default:
      return {
        hideMiddle: true,
        Home: t('主'),
        Away: t('客')
      };
  }
};
//- 玩法声明映射
export const PLAY_MATCH2 = (code: string, home: string, away: string) => {
  const t1 = ['Q1_OU', 'Q2_OU', 'Q3_OU', 'Q4_OU', 'HT_OU', 'S1_OU', 'S2_OU', 'S3_OU', 'S4_OU', 'FTS_OU', 'FT_OU', 'PT_OU', 'FT_OU']
  const t2 = ['HT_AH', 'FT_AH', 'FTS_AH', 'Q4_AH', 'Q3_AH', 'Q1_AH', 'Q2_AH', 'S1_AH', 'S2_AH', 'S3_AH', 'S4_AH', 'PT_AH']
  const t3 = ['FT_OE', 'HT_OE']
  const t4 = ['FT_1X2', 'HT_1X2', 'S1_ML', 'S2_ML', 'S3_ML', 'S4_ML', 'Q1_ML', 'Q2_ML', 'Q3_ML', 'Q4_ML', 'FT_ML', 'HT_ML', 'Winner_2ndFrame', 'Winner_1stFrame', 'Winner', 'Winner_1X2', 'win_18280', 'BothTeamsToScore']
  switch (true) {
    case t1.includes(code):
      return {
        Over: t('大'),
        Under: t('小')
      }
    case t2.includes(code):
      return {
        Home: home,
        Away: away
      }
    case t3.includes(code):
      return {
        hideMiddle: true,
        Odd: t('单'),
        Even: t('双')
      }
    case t4.includes(code):
      return {
        hideMiddle: true,
        Home: home,
        Away: away,
        Draw: t('平局')
      }
    default:
      return {
        hideMiddle: true,
        Home: home,
        Away: away,
        Draw: t('平局')
      }
  }
}

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
export const transferBoDan = (list: any[]) => {
  const listData: any[] = [];
  const list1: any[] = [];
  const list2: any[] = [];
  const list3: any[] = [];
  let other: any = null;
  list.forEach(item => {
    const temp = { ...item };
    if (temp.handicap === 'AOS') {
      temp.handicap = t('其他');
      other = temp;
    } else {
      const h = temp.handicap.match(/H(\S*)A/)[1];
      const a = temp.handicap.split('A')[1];
      temp.handicap = `${h}-${a}`;
      if (/[0-9]/.test(h) && /[0-9]/.test(a)) {
        if (h > a) list1.push(temp);
        if (h === a) list2.push(temp);
        if (h < a) list3.push(temp);
      }
    }
  });
  list1.sort(BoDanSort);
  list2.sort(BoDanSort);
  list3.sort(BoDanSort);
  if (other) {
    list2.push(other);
  }
  const len = Math.max(list1.length, list2.length, list3.length);
  for (let i = 0; i < len; i++) {
    listData[0 + i * 3] = list1[i] || null;
    listData[1 + i * 3] = list2[i] || null;
    listData[2 + i * 3] = list3[i] || null;
  }
  return listData;
};

export const SPORT_CATEGORY = [
  { label: t('普通体育'), value: 0 },
  { label: t('电子竞技'), value: 1 },
];

export enum LeagueClassifyType {
  SPORT_CLASSIFY = 0,
  ESPORT_CLASSIFY = 1,
  VIRTUAL_SPORT_CLASSIFY = 2
}
