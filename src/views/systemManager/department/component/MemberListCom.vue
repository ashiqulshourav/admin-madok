<template>
  <div class="main">
    <MemberSerachForm :form="form" :loading="loading" @on-search="onSearch" />

    <pure-table
      align-whole="center"
      table-layout="auto"
      :loading="loading"
      show-overflow-tooltip
      adaptive
      row-key="id"
      :data="dataList"
      :columns="columns"
      :header-cell-style="tableHeaderStyle"
      @page-size-change="handleTableWidthChange"
      @page-current-change="handleCurrentChange"
      :pagination="pagination"
      :paginationSmall="true"
    >
      <template #deptName="{ row }">
        <span v-if="type === 'query'">{{ row.deptName }}</span>

        <el-tree-select
          v-else
          v-model="row.deptName"
          :data="departmentList"
          default-expand-all="all"
          :check-on-click-node="true"
          :check-strictly="true"
          :expand-on-click-node="false"
          @change="$event => changeId($event, row, 'dep')"
          :props="{
            label: 'name',
            children: 'subNodeList',
            value: 'id'
          }"
        >
        </el-tree-select>
      </template>

      <template #roleName="{ row }">
        <span v-if="type === 'query'">{{ row.roleName }}</span>
        <el-tree-select
          v-else
          v-model="row.roleId"
          :data="roleList"
          default-expand-all="all"
          :check-on-click-node="true"
          :check-strictly="true"
          :expand-on-click-node="false"
          @change="$event => changeId($event, row, 'role')"
          :props="{
            label: 'name',
            children: 'subRoleNodeList',
            value: 'id'
          }"
        >
        </el-tree-select>
      </template>

      <template #operation="{ row }">
        <el-button
          v-if="type === 'query'"
          v-auth="['REMOVEUSER']"
          class="reset-margin"
          link
          type="primary"
          size="small"
          @click="removeDepartment(row)"
        >
          {{ t("移出部门") }}
        </el-button>

        <el-button
          v-else
          v-auth="['CONFIRMASSOCIATION']"
          class="reset-margin"
          link
          type="primary"
          size="small"
          @click="confirmClick(row)"
        >
          {{ t("确认关联") }}
        </el-button>
      </template>
    </pure-table>
  </div>
</template>

<script setup lang="ts">
import { useMemberHook } from "../utils/useMemberHook"
import MemberSerachForm from "./MemberSerachForm.vue"
import { columns } from "./MemberTableColumn"
import { t } from "@/plugins/i18n"
import { usePublicHooks } from "@/hooks"

const { tableHeaderStyle } = usePublicHooks()
const { id, type } = defineProps<{ id: number; type: "setting" | "query" }>()

const {
  loading,
  dataList,
  form,
  pagination,
  roleList,
  departmentList,
  confirmClick,
  onSearch,
  handleTableWidthChange,
  handleCurrentChange,
  removeDepartment,
  changeId
} = useMemberHook(id, type)
</script>
