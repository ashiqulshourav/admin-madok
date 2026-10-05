import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { t } from "@/plugins/i18n";

/** 密码正则（密码格式应为8-18位数字、字母、符号的任意两种组合） */
export const REGEXP_PWD =
  /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){8,18}$/;

export const REGEXP_EMAIL = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

const NAME_REG = /^[a-zA-Z0-9_]{6,20}$/;

const formRules = reactive(<FormRules>{
  name: [
    {
      validator: (_, value, callback) => {
        if (value === "") {
          callback(new Error(t("部门名称不能为空")));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  parentId: [{ required: true, message: t('上级部门不能为空') }],
  tenantId: [{ required: true, message: t('商户ID不能为空') }],
});

export { formRules };
