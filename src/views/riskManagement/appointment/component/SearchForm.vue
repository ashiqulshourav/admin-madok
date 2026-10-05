<template>
  <div class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] mb-2">
    <div class="flex flex-col">
      <div>
        <el-button
          class="mb-2 !ml-0 mr-2 min-w-[150px]"
          size="small"
          v-for="item in renderList"
          :key="item.value"
          :type="item.value === currentSportId ? 'primary' : ''"
          @click="changeType(item)"
        >
          {{ item.label }}
        </el-button>
      </div>
      <div>
        <el-button
          class="mb-2 !ml-0 mr-2 min-w-[150px]"
          v-for="item in ESPORT_ID_MAP"
          :key="item.value"
          size="small"
          :type="item.value === currentSportId ? 'primary' : ''"
          @click="changeType(item)"
        >
          {{ item.label }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SPORT_LIST_MAP } from '@/views/settle/main/utils/map';
import { sport_list_map_type } from '@/views/settle/main/utils/type';
import { ESPORT_ID_MAP } from '@/utils/maps/sports_map';

const props = defineProps<{
  currentSportId: number;
}>();

const emits = defineEmits(['changeNavType']);
const renderList = computed(() => {
  return SPORT_LIST_MAP.slice(0, 15);
});

const changeType = (_: sport_list_map_type | (typeof ESPORT_ID_MAP)[0]) => {
  if (_.value === props.currentSportId) return;
  emits('changeNavType', _.value);
};
</script>

<style scoped></style>
