<template>
  <div class="h-[340px] relative">
    <div class="absolute w-full h-full top-0">
      <div ref="chartRef" style="width: 100%; height: 100%" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDark, useECharts } from '@pureadmin/utils';

// 兼容dark主题
const { isDark } = useDark();
let theme = computed(() => {
  return isDark.value ? 'dark' : 'default';
});

const props = defineProps<{
  renderList: (number | string)[][];
}>();

// 初始化ECharts
const chartRef = ref();
const { setOptions } = useECharts(chartRef, { theme });

const initEchart = async () => {
  await nextTick();
  setOptions(
    {
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'cross'
        }
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          show: true,
          align: 'center'
        },
        interval: 15,
        min: 0,
        max: 90
      },
      yAxis: {
        type: 'value'
      },
      grid: {
        left: 0,
        right: 1,
        top: 5,
        bottom: 5,
        containLabel: false
      },
      series: [
        {
          symbolSize: 8,
          data: props.renderList as unknown as number[],
          type: 'scatter',
          tooltip: {
            formatter: function (params) {
              const d = params.data as any[];
              return t('投注额: ') + d[1] + `<br />${t('投注时间')}: ` + d[2];
            }
          }
        }
      ]
    },
    {
      name: 'click',
      callback: params => {
        const orderNumList = props.renderList
          .filter(item => item[0] === params.data[0])
          .map(_ => _[3]);

        getBetDetail(orderNumList);
      }
    }
  );
};

const emits = defineEmits(['getBetDetail']);
const getBetDetail = (o: (string | number)[]) => {
  emits('getBetDetail', o);
};

watch(
  () => props.renderList,
  () => {
    initEchart();
  },
  {
    deep: true,
    immediate: true
  }
);
</script>
