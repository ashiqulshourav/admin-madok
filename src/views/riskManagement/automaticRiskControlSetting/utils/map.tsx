import { auto_risks_control_type } from './types';

export enum AUTO_RISKS_BUTTONS {
  automatically_reject = 0,
  automatic_order_placement = 1,
  auto_freeze = 2
  // auto_label_limit = 3
}

export const AUTO_RISK_CONTROLS: auto_risks_control_type[] = [
  {
    label: t('自动接拒'),
    value: AUTO_RISKS_BUTTONS.automatically_reject,
    linkName: 'AUTO_RISKS_REJECT_DETAIL'
  },
  {
    label: t('自动划单'),
    value: AUTO_RISKS_BUTTONS.automatic_order_placement,
    linkName: 'AUTO_RISKS_ORDER_PLACEMENT_DETAIL'
  },
  {
    label: t('自动冻结'),
    value: AUTO_RISKS_BUTTONS.auto_freeze,
    linkName: 'AUTO_RISKS_FREEZE_DETAIL'
  }
  // {
  //   label: t('自动标签限额'),
  //   value: AUTO_RISKS_BUTTONS.auto_label_limit,
  //   linkName: 'AUTO_RISKS_LABEL_LIMIT_DETAIL'
  // }
];

export const EVENT_NAMES = [
  {
    eventName: '进球事件',
    eventCode: 'goal'
  },
  {
    eventName: '红牌事件',
    eventCode: 'red_card'
  },
  {
    eventName: '获得点球事件',
    eventCode: 'penalty_awarded'
  },
  {
    eventName: '角球 ',
    eventCode: 'corner'
  }
] as const;

export const LEAGUE_GRADLES = [
  '-1',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20'
];

export function formatRanges(arr: string[]) {
  if (!arr.length) return '';

  arr = arr
    .sort((a: any, b: any) => {
      if (isNaN(a) && isNaN(b)) {
        return a.localeCompare(b);
      } else if (isNaN(a)) {
        return 1;
      } else if (isNaN(b)) {
        return -1;
      } else {
        return a - b; // Sort numerically
      }
    })
    .filter(item => item !== '未评级');

  const ranges = [];
  let start = arr[0];
  let end = start;
  let prevIsNum = !isNaN(parseInt(start)); // check if the first item is a number

  for (let i = 1; i < arr.length; i++) {
    const current = arr[i];
    const currentIsNum = !isNaN(parseInt(current)); // check if the current item is a number

    // If the type changes or there's a gap in numbers, push the range
    if (
      currentIsNum !== prevIsNum ||
      (currentIsNum && parseInt(current) - parseInt(end) !== 1)
    ) {
      if (start !== end) {
        ranges.push(`${start}~${end}`);
      } else {
        ranges.push(`${start}`);
      }
      start = current;
    }

    end = current;
    prevIsNum = currentIsNum;
  }

  // Push the last range
  if (start !== end) {
    ranges.push(`${start}~${end}`);
  } else {
    ranges.push(`${start}`);
  }

  const index = ranges.indexOf('-1');

  if (index !== -1) {
    ranges[index] = '未评级';
  }

  return `${ranges.join(', ')}`;
}
