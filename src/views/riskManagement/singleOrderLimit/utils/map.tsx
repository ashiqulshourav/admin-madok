import { sport_list_map_type,currency_list_map_type } from './types';

export enum SPORT_NAME_TYPE {
  football = 0,
  basketball = 1,
  other = 2,
  esport = 3,

}

export const SPORT_LIST_MAP: sport_list_map_type[] = [
  {
    label: t('足球'),
    value: SPORT_NAME_TYPE.football,
    linkName: 'SETTLE_DETAIL_FOOTBALL_DETAIL'
  },
  {
    label: t('篮球'),
    value: SPORT_NAME_TYPE.basketball,
    linkName: 'SETTLE_DETAIL_BASKETBALL_DETAIL'
  },
  {
    label: t('其他赛种'),
    value: SPORT_NAME_TYPE.other,
    linkName: 'SETTLE_DETAIL_OTHER_DETAIL'
  },
  {
    label: t('电竞'),
    value: SPORT_NAME_TYPE.esport,
    linkName: 'SETTLE_DETAIL_ESPORT_DETAIL'
  }
  // { label: t('特别项目'), value: 7, type: 'SpecialProjects' },
  // { label: t('电子竞技'), value: 4, type: 'FootBall' },
];

export const CURRENCY_LIST_MAP:currency_list_map_type[] = [
  {
    label:t('人民币'),
    value:1
  },
  {
    label:t('USDT'),
    value:2
  }
]


