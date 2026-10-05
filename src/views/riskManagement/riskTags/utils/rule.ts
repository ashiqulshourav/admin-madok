import { reactive } from 'vue';
import type { FormRules } from 'element-plus';
import { t } from '@/plugins/i18n';

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: t('标签名称不能为空'), trigger: 'blur' }],
  level: [{ required: true, message: t('标签级别不能为空'), trigger: 'blur' }],
  // remark: [{ required: true, message: t('备注不能为空'), trigger: 'blur' }]
});
