<template>
  <div v-if="list" class="flex items-center">
    <div class="items-center flex flex-wrap gap-x-1 gap-y-2">
      <div
        v-for="label in list
          .slice(0, showNumber)
          .sort((a, b) => a.level - b.level)"
        :key="label.id"
        class="custom"
      >
        <el-tag
          :style="`background-color: ${getLabelColor(label.level, 'risk')}`"
          class="rounded-lg w-full py-1"
        >
          {{ label.name }}
        </el-tag>
      </div>
    </div>

    <div v-if="list?.length > showNumber">
      <el-popover
        placement="top-end"
        :width="300"
        trigger="hover"
        content="this is over"
      >
        <template #reference>
          <el-button class="w-full"
            ><el-icon><Plus /></el-icon
          ></el-button>
        </template>
        <template #default>
          <div class="flex flex-wrap gap-x-1 gap-y-2">
            <div
              v-for="label in list.sort((a, b) => a.level - b.level)"
              :key="label.id"
              class="custom"
            >
              <el-tag
                :style="`background-color: ${getLabelColor(
                  label.level,
                  'risk'
                )}`"
                class="rounded-lg w-full py-1 text-white text-center"
              >
                {{ label.name }}
              </el-tag>
            </div>
          </div>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue';

import { getLabelColor } from './utils';

const { list, showNumber } = defineProps<{
  list: MemberAdminAPI.riskControlLabel[];
  showNumber: number;
}>();
</script>

<style lang="scss">
.el-row {
  row-gap: 0.5rem;
}
.custom {
  flex: 0 0 0;
  max-width: unset;
  .el-tag__content {
    color: white;
  }
}
</style>
