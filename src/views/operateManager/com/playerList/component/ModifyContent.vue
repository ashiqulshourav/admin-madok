<template>
  <div class="">
    <div class="flex items-center" v-if="category === 0">
      <span class="flex-shrink mr-4">{{ t('体育') }}</span>
      <div class="w-28">
        <el-select clearable v-model="betDelay" @clear="clearAll('sport')">
          <el-option
            v-for="item in timeArr.slice(0, 15)"
            :key="item"
            :label="item + 's'"
            :value="item"
          ></el-option>
        </el-select>
      </div>
      <div class="flex-grow ml-4 mr-40">
        <el-tree-select
          class="!min-w-52"
          v-model="sportIdsData"
          :data="SPORT_ID_MAP"
          filterable
          clearable
          multiple
          tag-type="primary"
          collapse-tags
          :max-collapse-tags="3"
          :render-after-expand="false"
          show-checkbox
          check-strictly
          check-on-click-node
        >
        </el-tree-select>
      </div>
    </div>
    <div class="flex items-center mt-4">
      <span class="flex-shrink mr-4">{{ t('电竞') }}</span>
      <div class="w-28">
        <el-select clearable v-model="betDelayDj" @clear="clearAll('eSport')">
          <el-option
            v-for="item in timeArr"
            :key="item"
            :label="item + 's'"
            :value="item"
          ></el-option>
        </el-select>
      </div>
      <div class="flex-grow ml-4 mr-40">
        <el-tree-select
          class="!min-w-52"
          v-model="sportIdsDjData"
          :data="ESPORT_ID_MAP"
          filterable
          clearable
          multiple
          tag-type="primary"
          collapse-tags
          :max-collapse-tags="3"
          :render-after-expand="false"
          show-checkbox
          check-strictly
          check-on-click-node
        >
        </el-tree-select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { SPORT_ID_MAP, ESPORT_ID_MAP } from '@/utils/maps/sports_map';

const props = defineProps<{
  betDelay: number;
  betDelayDj: number;
  sportIds: string;
  sportIdsDj: string;
  category: number;
}>();

const timeArr = Array.from({ length: 60 }, (_, i) => i + 1);

//- 清空按钮点击
const clearAll = (type: 'sport' | 'eSport') => {
  type === 'sport'
    ? emits('update:sportIds', '')
    : emits('update:sportIdsDj', '');
};

const emits = defineEmits([
  'update:betDelay',
  'update:betDelayDj',
  'update:sportIds',
  'update:sportIdsDj'
]);
const betDelay = computed({
  get() {
    return props.betDelay ? props.betDelay : '';
  },
  set(v) {
    emits('update:betDelay', v);
  }
});
const betDelayDj = computed({
  get() {
    return props.betDelayDj ? props.betDelayDj : '';
  },
  set(v) {
    emits('update:betDelayDj', v);
  }
});
const sportIdsData = computed({
  get() {
    if (props.sportIds === '') {
      return [];
    } else {
      return props.sportIds?.split(',').map(s => +s);
    }
  },
  set(v) {
    emits('update:sportIds', v.join(','));
  }
});
const sportIdsDjData = computed({
  get() {
    if (props.sportIdsDj === '') {
      return [];
    } else {
      return props.sportIdsDj?.split(',').map(s => +s);
    }
  },
  set(v) {
    emits('update:sportIdsDj', v.join(','));
  }
});
</script>

<style scoped></style>
