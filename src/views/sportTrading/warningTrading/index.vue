<template>
  <div class="flex flex-col h-full">
    <Serach :form="searchForm" :loading="loading" @onSearch="onSearch" />
    <div class="flex flex-grow h-[calc(100%-60px)]">
      <WarningList />
      <div class="flex w-full justify-center" v-if="noMatchList">
        <el-empty></el-empty>
      </div>
      <MatchList
        v-else
        @reloadList="reloadList"
        :pagination="pagination"
        :loading="loading"
        :matchList="matchList"
        @sendNewOdds="sendNewOdds"
        @changePageSize="changePageSize"
        @clearMatchTime="clearMatchTime"
        @changeStatus="changeStatus"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import WarningList from './com/WarningSetting.vue';
import MatchList from './com/WarningList.vue';
import { useWarningHook } from '../util/warning_hook';
import Serach from './com/Search.vue';

const {
  searchForm,
  pagination,
  loading,
  matchList,
  changePageSize,
  reloadList,
  sendNewOdds,
  clearMatchTime,
  changeStatus,
  onSearch,
  noMatchList
} = useWarningHook();
</script>

<style lang="scss">
.el-scrollbar__view {
  height: 97%;
}
</style>
