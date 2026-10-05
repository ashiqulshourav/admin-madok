<template>
  <el-popover
    placement="right"
    popper-class="poper_main"
    :width="width"
    trigger="hover"
    :content="content"
  >
    <template #reference>
      <div class="flex items-center">
        <span class="mr-1">{{ title }}</span>
        <IconifyIconOffline
          :class="['cursor-pointer text-sm', iconColor]"
          icon="infoFilled"
        />
      </div>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    width?: number;
    title: string;
    content: string;
    iconColor?: string;
  }>(),
  {
    width: 240,
    iconColor: 'text-gray-400'
  }
);
</script>

<style lang="scss">
.poper_main {
  line-height: 1 !important;
}
</style>
