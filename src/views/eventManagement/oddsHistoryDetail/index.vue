<template>
  <div class="main relative h-full">
    <IconifyIconOffline
      icon="cancelIcon"
      class="absolute right-4 top-4 text-[26px] cursor-pointer"
      @click="$router.go(-1)"
    />
    <MatchTitle :matchDetail="matchDetail" />
    <SelectContainer
      :matchId="matchDetail.matchId?.toString()"
      :selectData="selectData"
      @changeList="changeList"
      :list="list"
    />

    <div class="h-[calc(100%-324px)]" ref="tableRef">
      <VxeTableBar
        :vxeTableRef="vxeTableRef"
        :columns="columns()"
        title=""
        @refresh="onSearch"
      >
        <template v-slot="{ dynamicColumns }">
          <vxe-grid
            ref="vxeTableRef"
            headerAlign="center"
            align="center"
            v-loading="loading"
            border
            :rowConfig="{
              useKey: true
            }"
            :height="h"
            :show-overflow="true"
            size="small"
            :column-config="{ resizable: true, useKey: true }"
            :columns="dynamicColumns"
            :scroll-y="{ enabled: true }"
            :data="list"
          />
        </template>
      </VxeTableBar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VxeTableBar } from '@/components/ReVxeTableBar';
import { useOddsHistoryDetailHook } from './utils/hook';
import MatchTitle from './component/MathcTitle.vue';
import SelectContainer from './component/SelectContainer.vue';

defineOptions({ name: 'EVENTMANAGEMENT_EVENTQUERY' });
const tableRef = ref();
const h = ref(0);
onMounted(() => {
  h.value = tableRef.value.offsetHeight ?? 500;
});

const {
  loading,
  onSearch,
  vxeTableRef,
  matchDetail,
  columns,
  selectData,
  list,
  changeList
} = useOddsHistoryDetailHook();
</script>

<style lang="scss">
.export_dialog {
  .el-message-box__btns {
    flex-direction: row;
  }
}
.EVENTMANAGEMENT_ODDSHISTORYDETAIL {
  .el-scrollbar__view {
    min-height: 98%;
    height: 98%;
  }
}
</style>
