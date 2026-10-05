import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  teamNameCn: [{ required: true, message: t('队伍中文名不能为空'), trigger: "blur" }],
  teamNameEn: [{ required: true, message: t('队伍英文名不能为空'), trigger: "blur" }]
});
