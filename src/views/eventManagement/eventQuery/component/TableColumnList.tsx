import dayjs from 'dayjs';
import { handleTableWidth } from '@/utils/getTableWidth';
const IconMap = {
  goal: new URL('@/assets/event_img/goal.png', import.meta.url).href,
  yellow_card: new URL('@/assets/event_img/yellow_card.png', import.meta.url)
    .href,
  corner: new URL('@/assets/event_img/corner.png', import.meta.url).href,
  red_card: new URL('@/assets/event_img/red.png', import.meta.url).href
};
export const columns: TableColumnList = [
  {
    label: t('收到事件源时间'),
    prop: 'createdAt',
    minWidth: 200,
    formatter({ createdAt }: { createdAt: string }) {
      return dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  {
    label: t('距离比赛开赛时间'),
    prop: 'playingTime',
    minWidth: 200,
    headerRenderer: d => handleTableWidth(d, t('距离比赛开赛时间'), 'auto'),
    formatter({ playingTime }) {
      return playingTime ? playingTime : '-';
    }
  },
  {
    label: t('事件名称'),
    prop: 'addition5',
    headerRenderer: d => handleTableWidth(d, t('事件名称'), 'auto')
  },
  {
    label: t('事件源'),
    prop: 'dataSourceCode',
    headerRenderer: d => handleTableWidth(d, t('事件源'), 'auto')
  },
  {
    label: t('操作方式'),
    prop: 'operationType',
    headerRenderer: d => handleTableWidth(d, t('操作方式'), 'auto')
  },
  {
    label: t('取消事件'),
    slot: 'canceled',
    headerRenderer: d => handleTableWidth(d, t('取消事件'), 'auto')
  },
  {
    label: t('场次/局数/盘数'),
    headerRenderer: d => handleTableWidth(d, t('场次/局数/盘数'), 'auto'),
    prop: 'extraInfo',
    minWidth: 150
  },
  {
    label: t('主/客'),
    prop: 'homeAway',
    headerRenderer: d => handleTableWidth(d, t('主/客'), 'auto')
  },
  {
    label: t('球员名称'),
    prop: 'player1Name',
    headerRenderer: d => handleTableWidth(d, t('球员名称'), 'auto')
  },
  {
    label: t('比分'),
    slot: 'score',
    headerRenderer: d => handleTableWidth(d, t('比分'), 'auto')
  }
];

export const titleColumn: TableColumnList = [
  {
    label: t('队伍名称'),
    prop: 'teamName',
    minWidth: 200
  },
  {
    label: t('HT1'),
    prop: 'ht1'
  },
  {
    label: t('HT2'),
    prop: 'ht2'
  },
  {
    prop: 'goal',
    headerRenderer() {
      return (
        <div class="flex justify-center">
          <img src={IconMap.goal} class="h-4 w-4" />
        </div>
      );
    }
  },
  {
    prop: 'corner',
    headerRenderer() {
      return (
        <div class="flex justify-center">
          <img src={IconMap.corner} class="h-4 w-4" />
        </div>
      );
    }
  },
  {
    prop: 'yellow_card',
    headerRenderer() {
      return (
        <div class="flex justify-center">
          <img src={IconMap.yellow_card} class="h-4 w-4" />
        </div>
      );
    }
  },
  {
    prop: 'red_card',
    headerRenderer() {
      return (
        <div class="flex justify-center">
          <img src={IconMap.red_card} class="h-4 w-4" />
        </div>
      );
    }
  }
];
