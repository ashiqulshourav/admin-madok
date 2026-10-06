<template>
  <el-result status="403" title="403" sub-title="You do not have access to this section.">
    <template #extra>
      <el-button type="primary" @click="$router.push('/dashboard')">Return to dashboard</el-button>
    </template>
  </el-result>
</template>
