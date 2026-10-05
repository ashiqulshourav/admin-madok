<template>
  <el-form
    ref="formRef"
    :inline="true"
    :model="form"
    class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
  >
    <el-form-item :label="`${t('部门名称')}:`" prop="name">
      <el-input
        v-model.trim="form.name"
        :placeholder="t('请输入部门名称')"
        clearable
        maxlength="30"
        v-enter="search"
        class="!w-[200px]"
      />
    </el-form-item>

    <el-form-item :label="`${t('状态')}:`" prop="status">
      <el-select v-model="form.status" clearable class="!w-[150px]">
        <el-option :label="t('全部')" :value="' '" />
        <el-option :label="t('禁用')" :value="0" />
        <el-option :label="t('开启')" :value="1" />
      </el-select>
    </el-form-item>

    <el-form-item prop="createTimeStart" :label="`${t('创建时间')}:`">
      <Custom_date
        v-model:val="selectDate"
        @changeDate="changeDate"
        :format="'YYYY-MM-DD'"
        :class="''"
      />
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
import { searchFormType } from "../utils/types"
import dayjs from "dayjs"
import Custom_date from "@/components/Form/Custom_date.vue"

const { form } = defineProps<{
  loading: boolean
  form: searchFormType
}>()

const selectDate = ref("")
const formRef = ref()
const emits = defineEmits(["onSearch"])

const resetForm = (formEl: FormInstance | undefined) => {
  formEl.resetFields()
  form.createFrom = ""
  form.createEnd = ""
  selectDate.value = ""
  search()
}

const search = () => {
  emits("onSearch", ...["reload"])
}

const changeDate = t => {
  if (!t) {
    form.createFrom = ""
    form.createEnd = ""
  } else {
    form.createFrom = dayjs(t[0]).startOf("day").format("YYYY-MM-DD HH:mm:ss")
    form.createEnd = dayjs(t[1]).endOf("day").format("YYYY-MM-DD HH:mm:ss")
  }
  search()
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
