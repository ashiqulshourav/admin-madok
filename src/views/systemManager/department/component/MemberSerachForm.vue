<template>
  <el-form
    ref="formRef"
    :inline="true"
    :model="form"
    class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
  >
    <el-form-item :label="`${t('用户账号')}:`" prop="name">
      <el-input
        v-model="form.name"
        :placeholder="t('请输入用户账号')"
        clearable
        maxlength="30"
        v-enter="search"
        class="!w-[200px]"
      />
    </el-form-item>

    <el-form-item :label="`${t('用户状态')}:`" prop="status">
      <el-select v-model="form.status" clearable class="!w-[200px]">
        <el-option :label="t('全部')" :value="' '" />
        <el-option :label="t('禁用')" :value="0" />
        <el-option :label="t('开启')" :value="1" />
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        :icon="useRenderIcon(SearchIcon)"
        :loading="loading"
        @click="search"
      >
        {{ t("搜索") }}
      </el-button>
      <el-button :icon="useRenderIcon(RefreshIcon)" @click="resetForm(formRef)">
        {{ t("重置") }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { t } from "@/plugins/i18n"
import SearchIcon from "@iconify-icons/ep/search"
import RefreshIcon from "@iconify-icons/ep/refresh"
import { useRenderIcon } from "@/components/ReIcon/src/hooks"
import { type FormInstance } from "element-plus"

const { form } = defineProps<{
  loading: boolean
  form: {
    name: string
    status: boolean | string
  }
}>()

const formRef = ref()
const emits = defineEmits(["onSearch"])

const resetForm = (formEl: FormInstance | undefined) => {
  formEl.resetFields()
  search()
}

const search = () => {
  emits("onSearch", ...["reload"])
}
</script>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
