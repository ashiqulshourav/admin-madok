<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100 p-6">
    <el-card class="w-full max-w-md">
      <template #header>
        <div class="text-lg font-semibold">Madok Admin</div>
      </template>

      <el-form>
        <el-form-item label="Email">
          <el-input type="email" placeholder="Enter your email" />
        </el-form-item>

        <el-form-item label="Password">
          <el-input
            type="password"
            show-password
            placeholder="Enter your password"
          />
        </el-form-item>

        <el-button type="primary" class="w-full"> Login </el-button>
      </el-form>
    </el-card>
  </div>
</template>
