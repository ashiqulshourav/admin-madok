import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  countryId: [{ required: true, message: t('国家地区ID不能为空'), trigger: "blur" }],
  isCountryTeam: [{ required: true, message: t('是否是国家队不能为空'), trigger: "blur" }],
  leagueId: [{ required: true, message: t('联赛ID不能为空'), trigger: "blur" }],
  teamId: [{ required: true, message: t('球队ID不能为空'), trigger: "blur" }],
  level: [{ required: true, message: t('热门排序不能为空'), trigger: "blur" }],
  // stadiumName: [{ required: true, message: t('主场名称不能为空'), trigger: "blur" }],
  sportId: [{ required: true, message: t('赛种不能为空'), trigger: "blur" }],
  teamNameCn: [{ required: true, message: t('球队中文名不能为空'), trigger: "blur" }],
  teamNameEn: [{ required: true, message: t('球队英文名不能为空'), trigger: "blur" }],
});
