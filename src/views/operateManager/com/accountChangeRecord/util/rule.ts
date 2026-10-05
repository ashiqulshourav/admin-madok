import { reactive } from 'vue';
import type { FormRules } from 'element-plus';
import { t } from '@/plugins/i18n';

export const formRules = reactive(<FormRules>{
  accountChangeTypeCode: [{ required: true, message: t('不能为空'), trigger: 'blur' }],
  amount: [{ required: true, message: t('请输入金额'), trigger: 'blur' }],
  remark: [{ required: true, message: t('备注不能为空'), trigger: 'blur' }],
});