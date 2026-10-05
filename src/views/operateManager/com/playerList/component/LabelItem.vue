import { columns } from './TableColumnList';
<template>
  <el-tag
    @close="emits('onClose')"
    round
    type="info"
    effect="plain"
    :closable="expand && hasAuth('DELUSERLABEL')"
  >
    <div
      :style="`background-color: ${getLabelColor(label.level, label.labelColor)}`"
      class="w-[10px] h-[10px] rounded-[50%] bg-blue-500"
    />
    <el-text v-if="props.label.name.length <= 4" size="small">{{ props.label.name }}</el-text>
    <el-tooltip
      v-else
      effect="light"
      :content="props.label.name"
      placement="top"
    >
      <el-text>{{ props.label.name.substring(0, 4) }}...</el-text>
    </el-tooltip>
  </el-tag>
</template>
<script setup lang="ts">
import { hasAuth } from '@/router/utils';

const props = defineProps<{
  label: UserAPI.labelType;
  type: string;
  expand?: boolean;
}>();
const emits = defineEmits(['onClose']);

const getLabelColor = (level: number, labelColor?: string) => {
  if(labelColor) return labelColor    
  switch(level) {
    case 1: 
      return "#1891FF"
    case 2:
      return "#19BE6B"
    case 3:
      return "#2E4050"
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-tag__content) {
  display: flex;
  align-items: center;
  column-gap: 0.3rem;
}
</style>
