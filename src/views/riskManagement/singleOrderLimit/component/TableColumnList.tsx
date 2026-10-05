import { t } from '@/plugins/i18n';
// 足球 篮球,其他赛种
export const columns: TableColumnList = [
  {
    label: t('联赛等级'),
    prop: 'leagueLevel',
    formatter: ({ leagueLevel }): string => {
      return leagueLevel === -1 ? '未评级' : leagueLevel;
    },
  },
  {
    label: t('单用户单场累计赔付限额'),
    slot: 'singleUserMaxWin',
    width: 100,
  },
  {
    label: t('让球'),
    children: [
      {
        label: t('单玩法累计期望赔付'),
        slot: 'handicapSingleMaxWin',
        width: 100,
      },
      {
        label: t('全场-单注最高可投金额'),
        children: [
          {
            label: t('早盘'),
            slot: 'handicapWholeMaxBetMorning',
            width: 100,
          },
          {
            label: t('滚球'),
            slot: 'handicapWholeMaxBetRolling',
            width: 100,
          },
        ]
      },
      {
        label: t('半场-单注最高可投金额'),
        children: [
          {
            label: t('早盘'),
            slot: 'handicapHalfMaxBetMoring',
            width: 100,
          },
          {
            label: t('滚球'),
            slot: 'handicapHalfMaxBetRolling',
            width: 100,
          },
        ]
      },
    ]
  },
  {
    label: t('大小'),
    children: [
      {
        label: t('单玩法累计期望赔付'),
        slot: 'bigsmallSingleMaxWin',
        width: 100,
      },
      {
        label: t('全场-单注最高可投金额'),
        children: [
          {
            label: t('早盘'),
            slot: 'bigsmallWholeMaxBetMoring',
            width: 100,
          },
          {
            label: t('滚球'),
            slot: 'bigsmallWholeMaxBetRolling',
            width: 100,
          },
        ]
      },
      {
        label: t('半场-单注最高可投金额'),
        children: [
          {
            label: t('早盘'),
            slot: 'bigsmallHalfMaxBetMoring',
            width: 100,
          },
          {
            label: t('滚球'),
            slot: 'bigsmallHalfMaxBetRolling',
            width: 100,
          },
        ]
      },
    ]
  },
  {
    label: t('独赢'),
    children: [
      {
        label: t('单玩法累计期望赔付'),
        slot: 'winSingleMaxWin',
        width: 100,
      },
      {
        label: t('全场-单注最高可投金额'),
        children: [
          {
            label: t('早盘'),
            slot: 'winWholeMaxBetMoring',
            width: 100,
          },
          {
            label: t('滚球'),
            slot: 'winWholeMaxBetRolling',
            width: 100,
          },
        ]
      },
      {
        label: t('半场-单注最高可投金额'),
        children: [
          {
            label: t('早盘'),
            slot: 'winHalfMaxBetMoring',
            width: 100,
          },
          {
            label: t('滚球'),
            slot: 'winHalfMaxBetRolling',
            width: 100,
          },
        ]
      },
    ]
  },
  {
    label: t('其他玩法'),
    children: [
      {
        label: t('单玩法累计期望赔付'),
        slot: 'otherSingleMaxWin',
        width: 100,
      },
      {
        label: t('早盘-单注最高可投金额'),
        slot: 'otherMaxBetMoring',
        width: 100,
      },
      {
        label: t('滚球-单注最高可投金额'),
        slot: 'otherMaxBetRolling',
        width: 100,
      },
    ]
  },

];


// 电竞
export const columns2: TableColumnList = [
  {
    label: t('联赛等级'),
    prop: 'leagueLevel',
    formatter: ({ leagueLevel }): string => {
      return leagueLevel === -1 ? '未评级' : leagueLevel;
    },
  },
  {
    label: t('单用户单场累计期望赔付'),
    slot: 'singleUserMaxWin'
  },
  {
    label: t('单玩法累计期望赔付'),
    slot: 'esportSingleMaxWin'
  },
  {
    label: t('全局-单注最高可投金额'),
    children: [
      {
        label: t('早盘'),
        slot: 'esportWholeMaxBetMoring'
      },
      {
        label: t('滚球'),
        slot: 'esportWholeMaxBetRolling'
      },
    ]
  },
  {
    label: t('单局-单注最高可投金额'),
    children: [
      {
        label: t('早盘'),
        slot: 'esportSingleMaxBetMoring'
      },
      {
        label: t('滚球'),
        slot: 'esportSingleMaxBetRolling'
      },
    ]
  },
  {
    label: t('回合-单注最高可投金额'),
    children: [
      {
        label: t('早盘'),
        slot: 'esportRoundMaxBetMoring'
      },
      {
        label: t('滚球'),
        slot: 'esportRoundMaxBetRolling'
      },
    ]
  },
];



