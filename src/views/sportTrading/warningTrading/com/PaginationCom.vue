<template>
  <el-pagination
    v-model:current-page="pagination.currentPage"
    v-model:page-size="pagination.pageSize"
    :small="true"
    :background="pagination.background"
    layout="prev, pager, next, jumper"
    :total="pagination.total"
    @current-change="handleCurrentChange"
  />
</template>

<script setup lang="ts">
import type { PaginationProps } from '@pureadmin/table';
defineProps<{
  pagination: PaginationProps;
}>();

const emits = defineEmits(['changePageSize']);
const handleCurrentChange = () => emits('changePageSize');
</script>

<style scoped></style>
