import { ESPORT_ID_MAP, SPORT_ID_MAP } from '@/utils/maps/sports_map';
import dayjs from 'dayjs';

export const columns: TableColumnList = [
  {
    label: t('延时秒数'),
    prop: 'delaySeconds',
    formatter({ delaySeconds }) {
      return delaySeconds + 's';
    }
  },
  {
    label: t('体育/电竞'),
    prop: 'venueType',
    formatter({ venueType }) {
      return venueType === 0 ? t('体育') : t('电竞');
    }
  },
  {
    label: t('赛种/游戏类型'),
    prop: 'sportIds',
    formatter({ sportIds }) {
      const r = sportIds.split(',').map((item: string) => {
        // @ts-ignore
        const s = SPORT_ID_MAP.concat(ESPORT_ID_MAP).find(
          i => i.value === +item
        );
        return s?.label;
      });
      return r.join(',');
    }
  },
  {
    label: t('动作'),
    prop: 'updateType',
    formatter({ updateType }) {
      const _ = {
        1: t('编辑'),
        2: t('新增'),
        3: t('删除')
      };
      return _[updateType as keyof typeof _] ?? '_';
    }
  },
  {
    label: t('修改时间'),
    prop: 'createdAt',
    formatter({ createdAt }) {
      return dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  {
    label: t('操作人'),
    prop: 'updatedBy'
  }
];
