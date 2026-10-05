import { reactive } from 'vue';
import type { FormRules } from 'element-plus';

export const searchFormRules = reactive(<FormRules>{
  matchId: [{ required: true, message: t('不能为空'), trigger: 'blur' }]
});
