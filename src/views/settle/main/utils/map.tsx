import { sport_list_map_type } from './type';

export enum SPORT_NAME_TYPE {
  football = 1,
  basketball = 2,
  tennis = 3,
  billiards = 5,
  volleyball = 6,
  darts = 8,
  boxing = 10,
  hockey = 28,
  badminton = 19,
  pingpong = 23,
  rugby = 9,
  american_football = 16,
  handball = 11,
  iceHockey = 12,
  cricket = 13,
  baseball = 18
}


export const NEW_MATCH_STATUS = [
  {
    label: t('滚球'),
    value: 'nover'
  },
  {
    label: t('比赛结束'),
    value: 'over'
  },
  {
    label: t('未开始'),
    value: 'nobegin'
  },
  {
    label: t('比赛取消'),
    value: 'canceled'
  },
  {
    label: t('比赛延迟'),
    value: 'delay'
  },
  {
    label: t('比赛中断'),
    value: 'interrupt'
  },
  {
    label: t('比赛放弃'),
    value: 'abandon'
  },
  {
    label: t('比赛延期'),
    value: 'postponed'
  }
];

export const SPORT_LIST_MAP: sport_list_map_type[] = [
  {
    label: t('足球'),
    value: SPORT_NAME_TYPE.football,
    linkName: 'SETTLE_DETAIL_FOOTBALL_DETAIL'
  },
  {
    label: t('篮球'),
    value: SPORT_NAME_TYPE.basketball,
    linkName: 'SETTLE_DETAIL_NEW_BASKETBALL_DETAIL'
  },
  {
    label: t('网球'),
    value: SPORT_NAME_TYPE.tennis,
    linkName: 'SETTLE_DETAIL_TENNIS_DETAIL'
  },
  {
    label: t('斯诺克/台球'),
    value: SPORT_NAME_TYPE.billiards,
    linkName: 'SETTLE_DETAIL_BILLIARDS_DETAIL'
  },
  {
    label: t('羽毛球'),
    value: SPORT_NAME_TYPE.badminton,
    linkName: 'SETTLE_DETAIL_BADMINTON_DETAIL'
  },
  {
    label: t('乒乓球'),
    value: SPORT_NAME_TYPE.pingpong,
    linkName: 'SETTLE_DETAIL_PINGPONG_DETAIL'
  },
  {
    label: t('排球'),
    value: SPORT_NAME_TYPE.volleyball,
    linkName: 'SETTLE_DETAIL_VOLLEBALL_DETAIL'
  },
  {
    label: t('冰球'),
    value: SPORT_NAME_TYPE.iceHockey,
    linkName: 'SETTLE_DETAIL_ICEHOCKEY_DETAIL'
  },
  {
    label: t('手球'),
    value: SPORT_NAME_TYPE.handball,
    linkName: 'SETTLE_DETAIL_HANDBALL_DETAIL'
  },
  {
    label: t('板球'),
    value: SPORT_NAME_TYPE.cricket,
    linkName: 'SETTLE_DETAIL_CRICKET_DETAIL'
  },
  {
    label: t('曲棍球'),
    value: SPORT_NAME_TYPE.hockey,
    linkName: 'SETTLE_DETAIL_FIELD_HOCKEY'
  },
  {
    label: t('英式橄榄球'),
    value: SPORT_NAME_TYPE.rugby,
    linkName: 'SETTLE_DETAIL_RUGBY_DETAIL'
  },
  {
    label: t('美式足球'),
    value: SPORT_NAME_TYPE.american_football,
    linkName: 'SETTLE_DETAIL_AMERICAN_FOOTBALL_DETAIL'
  },
  {
    label: t('拳击/格斗'),
    value: SPORT_NAME_TYPE.boxing,
    linkName: 'SETTLE_DETAIL_FIGHTING'
  },
  {
    label: t('棒球'),
    value: SPORT_NAME_TYPE.baseball,
    linkName: 'SETTLE_DETAIL_BASEBALL_DETAIL'
  },
  {
    label: t('飞镖'),
    value: SPORT_NAME_TYPE.darts,
    linkName: 'SETTLE_DETAIL_FOOTBALL_DETAIL'
  }

  // { label: t('特别项目'), value: 7, type: 'SpecialProjects' },
  // { label: t('电子竞技'), value: 4, type: 'FootBall' },
];
