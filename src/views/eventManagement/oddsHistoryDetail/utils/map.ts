import { t } from '@/plugins/i18n';

export const EVENT_SOURCE = [
  {
    label: '熊猫',
    value: 'PS'
  },
  {
    label: '播控',
    value: 'VS'
  },
  {
    label: '188小金体育',
    value: 'XJ'
  }
];

export const playMethodsList = [{
  title: t('全场独赢'),
  key: 'FT_1X2',
  type: 1,
},
{
  title: t('半场独赢'),
  key: 'HT_1X2',
  type: 1,
},
{
  title: t('全场让球'),
  key: 'FT_AH',
  type: 2
},
{
  title: t('半场让球'),
  key: 'HT_AH',
  type: 2
},
{
  title: t('全场大小'),
  key: 'FT_OU',
  type: 3,
},
{
  title: t('半场大小'),
  type: 3,
  key: 'HT_OU'
},
{
  title: t('全场波胆'),
  type: 4,
  key: 'FT_CS'
},
{
  title: t('半场波胆'),
  type: 4,
  key: 'HT_CS'
}
]