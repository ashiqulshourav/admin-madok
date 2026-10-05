import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { t } from "@/plugins/i18n";

// const NAME_REG = /^[\u4e00-\u9fa5]{2,32}$/;
// const EN_NAME_REG = /^[\u4e00-\u9fa5a-zA-Z\_]{2,32}$/;

const formRules = reactive(<FormRules>{
  name: [
    { required: true, message: t("菜单名称不能为空") },
    /*  {
       validator: (_, value, callback) => {
         if (!NAME_REG.test(value)) callback(new Error(t("菜单名称格式不正确")))
         else callback()
       },
       trigger: "blur"
     } */
  ],
  enName: [
    { required: true, message: t("菜单英文名不能为空") },
    /*  {
       validator: (_, value, callback) => {
         if (!EN_NAME_REG.test(value)) callback(new Error(t("菜单英文名格式不正确")))
         else callback()
       },
       trigger: "blur"
     } */
  ],
  type: [
    { required: true, message: t("菜单类型不能为空") },
  ],
  parentId: [
    { required: true, message: t("上级菜单不能为空") },
  ],
  sort: [
    { required: true, message: t("排序不能为空") },

  ],
  path: [
    { required: true, message: t("路径不能为空") },
    // {
    //   validator: (_, value, callback) => {
    //     if (!(value.startsWith('/'))) callback(new Error(t("path格式不正确")))
    //     else callback()
    //   },
    //   trigger: "blur"
    // }
  ],
  routerPath: [
    { required: true, message: t("后端路径不能为空") },
    // {
    //   validator: (_, value, callback) => {
    //     if (!(value.startsWith('/'))) callback(new Error(t("path格式不正确")))
    //     else callback()
    //   },
    //   trigger: "blur"
    // }
  ],
});

export { formRules };
