export const columns: TableColumnList = [
  {
    label: t("用户账号"),
    prop: "name"
  },
  {
    label: t("所属部门"),
    slot: "deptName"
  },
  {
    label: t("关联角色"),
    slot: "roleName"
  },
  {
    label: t("创建时间"),
    width: 200,
    prop: "createdAt"
  },
  {
    label: t("状态"),
    minWidth: 200,
    formatter: ({ status }) => (
      <el-text type={status === 1 ? "primary" : "danger"}>
        {status === 1 ? "开启" : "关闭"}
      </el-text>
    )
  },
  {
    label: t("操作"),
    minWidth: 200,
    slot: "operation"
  }
]
