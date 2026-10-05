<template>
  <div class="flex mt-4 flex-wrap w-full">
    <CustomButton
      class="mb-2 !ml-0 mr-2"
      v-for="item in renderList"
      :key="item.value"
      :type="item.value === currentSportId ? 'primary' : ''"
      :btnText="item.label"
      @click="changeType(item)"
    />
  </div>
</template>

<script setup lang="ts">
import CustomButton from '@/components/Form/CustomButton.vue';
import { useMatchStore } from '@/store/match';
import { SPORT_LIST_MAP } from '../utils/map';
import { sport_list_map_type } from '../utils/type';

const props = defineProps<{
  currentSportId: number;
}>();

const emits = defineEmits(['changeNavType']);
const matchStore = useMatchStore();
const renderList = computed(() => {
  return SPORT_LIST_MAP.slice(0, 15);
});

const changeType = (_: sport_list_map_type) => {
  if (_.value === props.currentSportId) return;
  matchStore.set_currentSportId(_.value);
  emits('changeNavType', _.value);
};
</script>

<style scoped></style>
