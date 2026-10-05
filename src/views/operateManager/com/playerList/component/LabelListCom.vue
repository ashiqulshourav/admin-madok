<template>
  <div class="flex items-center">
    <div class="flex gap-2 flex-wrap">
      <LabelItem
        v-for="label in renderItem"
        :key="label.id"
        :label="label"
        :type="type"
        :expand="!expand"
        @onClose="emits('onClose', label.id, type)"
      />
    </div>
    <div v-if="expand && labels.length > 1" class="w-10">
      <el-popover
        placement="top-end"
        :width="300"
        trigger="hover"
        content="this is over"
      >
        <template #reference>
          <span class="px-2 border border-slate-300 text-slate-500 rounded-full cursor-default inline-block">{{ labels.length}}</span>
        </template>
        <template #default>
          <div class="flex gap-2 flex-wrap">
            <LabelItem
              v-for="label in [...props.labels]"
              :key="label.id"
              :label="label"
              :type="type"
            />
          </div>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<script setup lang="ts">
import LabelItem from './LabelItem.vue';

const props = defineProps<{
  labels: UserAPI.labelType[];
  type: string;
  expand?: boolean;
}>();
const emits = defineEmits(['onClose']);
const renderItem = computed(() => {
  return props.expand ? props.labels.slice(0, 1) : props.labels;
});
</script>
<style lang="scss" scoped></style>
