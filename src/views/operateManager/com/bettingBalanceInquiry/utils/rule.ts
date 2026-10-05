
import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { t } from '@/plugins/i18n'

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  category: [{ required: true, message: t('赛事分类不能为空'), trigger: "blur" }],
  text: [{ required: true, message: t('标签名不能为空'), trigger: "blur" }],
  sportId: [{ required: true, message: t('赛种不能为空'), trigger: "blur" }],
});