import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  configValue: [{ required: true, message: t('分类名称不能为空'), trigger: "blur" }],
  // tags: [{ required: true, message: t('分类标签不能为空'), trigger: "blur" }],
  sort: [{ required: true, message: t('分类排序规则不能为空'), trigger: "blur" }],
});
