import dayjs from 'dayjs';

const STATUS_MAP = {
  2: t('开'),
  3: '-',
  4: t('关')
};
export const columns = () => {
  return [
    {
      field: 'matchStartTime',
      title: t('比赛时间'),
      minWidth: 200,
      formatter: ({ cellValue }: { cellValue: string }) => {
        if (cellValue) {
          const s = cellValue.split(':');
          if (s[1].length === 1) s[1] = '0' + s[1];
          return s.join(':');
        } else {
          return '-';
        }
        return cellValue ?? '-';
      }
    },
    {
      field: 'eventName',
      title: t('事件'),
      minWidth: 150,
      formatter({ cellValue }: { cellValue: string }) {
        return cellValue ? cellValue : '-';
      }
    },
    {
      field: 'eventCurrentScore',
      title: t('DP当前比分'),
      minWidth: 150,
      formatter({ cellValue }: { cellValue: string }) {
        return cellValue ? cellValue : '-';
      }
    },
    {
      field: 'handicapValue',
      title: t('盘口值'),
      minWidth: 150,
      formatter({ cellValue }: { cellValue: string }) {
        return cellValue ? cellValue : '-';
      }
    },
    {
      title: t('188'),
      children: [
        {
          title: t('状态'),
          field: 'xjIsSale',
          type: 'html',
          formatter({ cellValue }: { cellValue: number }) {
            return `<div class="w-full justify-center flex items-center ">
            <div class="rounded-full w-[20px] h-[20px] text-white  justify-center flex items-center text-xs ${
              cellValue == 2 ? 'bg-[#00bf6f]' : 'bg-[#ff5e1d]'
            }">${STATUS_MAP[cellValue as keyof typeof STATUS_MAP] ?? '-'}</div>
            </div>`;
          }
        },
        {
          title: t('比分'),
          field: 'xjCurrentScore',
          formatter: ({ cellValue }: { cellValue: string }) =>
            cellValue ? cellValue : '-'
        },
        {
          title: t('主胜'),
          field: 'xjHomeOdds',
          type: 'html',
          formatter: ({ cellValue }: { cellValue: string }) => {
            return `<div class="text-[#0893fb]">${
              cellValue ? (+cellValue).toFixed(2) : '-'
            }</div>`;
          }
        },
        {
          title: t('大'),
          field: 'xjBigOdds',
          type: 'html',
          formatter: ({ cellValue }: { cellValue: string }) => {
            return `<div class="text-[#0893fb]">${
              cellValue ? (+cellValue).toFixed(2) : '-'
            }</div>`;
          }
        },
        {
          title: t('平'),
          field: 'xjDrawOdds',
          type: 'html',
          formatter: ({ cellValue }: { cellValue: string }) => {
            return `<div class="text-[#ff5e1d]">${
              cellValue ? (+cellValue).toFixed(2) : '-'
            }</div>`;
          }
        },

        {
          title: t('客胜'),
          field: 'xjAwayOdds',
          type: 'html',
          formatter: ({ cellValue }: { cellValue: string }) => {
            return `<div class="text-[#00bf6f]">${
              cellValue ? (+cellValue).toFixed(2) : '-'
            }</div>`;
          }
        },
        {
          title: t('小'),
          field: 'xjSmallOdds',
          type: 'html',
          formatter: ({ cellValue }: { cellValue: string }) => {
            return `<div class="text-[#00bf6f]">${
              cellValue ? cellValue : '-'
            }</div>`;
          }
        },
        {
          title: t('赔率'),
          field: 'xjCsOdds',
          type: 'html',
          formatter: ({ cellValue }: { cellValue: string }) => {
            return `<div class="text-[#0893fb]">${
              cellValue ? (+cellValue).toFixed(2) : '-'
            }</div>`;
          }
        },
        {
          title: t('返还率'),
          field: 'xjReturnRate',
          formatter: ({ cellValue }: { cellValue: string }) => {
            return cellValue ? (+cellValue * 100).toFixed(2) + '%' : '-';
          }
        }
      ]
    },
    {
      title: t('播控'),
      children: [
        {
          title: t('状态'),
          field: 'addition5',
          visible: false
        },
        {
          title: t('比分'),
          field: 'dataSourceCode',
          visible: false
        },
        {
          title: t('主胜'),
          field: 'operationType',
          visible: false
        },
        {
          title: t('平'),
          slot: 'canceled',
          visible: false
        },
        {
          title: t('客胜'),
          field: 'operationType',
          visible: false
        },
        {
          title: t('返还率'),
          slot: 'canceled',
          visible: false
        }
      ]
    },
    {
      title: t('熊猫'),
      visible: false,
      children: [
        {
          title: t('状态'),
          field: 'addition5',
          visible: false
        },
        {
          title: t('比分'),
          field: 'dataSourceCode',
          visible: false
        },
        {
          title: t('主胜'),
          field: 'operationType',
          visible: false
        },
        {
          title: t('平'),
          field: 'canceled',
          visible: false
        },
        {
          title: t('客胜'),
          field: 'operationType',
          visible: false
        },
        {
          title: t('返还率'),
          field: '123',
          visible: false
        }
      ]
    },
    {
      title: t('操盘'),
      visible: false,
      children: [
        {
          title: t('状态'),
          visible: false,
          field: 'addition5'
        },
        {
          title: t('比分'),
          visible: false,
          field: 'dataSourceCode'
        },
        {
          title: t('主胜'),
          visible: false,
          field: 'operationType'
        },
        {
          title: t('平'),
          visible: false,
          slot: 'canceled'
        },
        {
          title: t('客胜'),
          visible: false,
          field: 'operationType'
        },
        {
          title: t('返还率'),
          visible: false,
          slot: 'canceled'
        }
      ]
    },
    {
      title: t('数据获取时间'),
      field: 'createdTime',
      minWidth: 150,
      formatter: ({ cellValue }: { cellValue: string }) =>
        cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : '-'
    }
  ];
};
