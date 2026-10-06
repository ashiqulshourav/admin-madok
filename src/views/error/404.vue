<template>
  <el-result status="404" title="404" sub-title="The page you requested could not be found.">
    <template #extra>
      <el-button type="primary" @click="$router.push('/dashboard')">Return to dashboard</el-button>
    </template>
  </el-result>
</template>
