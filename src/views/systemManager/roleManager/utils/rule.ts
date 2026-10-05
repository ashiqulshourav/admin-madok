import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { t } from "@/plugins/i18n";


// const NAME_REG = /^[\u4e00-\u9fa5a-zA-Z0-9]{2,30}$/;

const formRules = reactive(<FormRules>{
  roleName: [
    { required: true, message: t("角色名称不能为空") },
    {
      validator: (_, value, callback) => {
        if (value === "") {
          callback(new Error(t("角色名称不能为空")));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
});

export { formRules };
