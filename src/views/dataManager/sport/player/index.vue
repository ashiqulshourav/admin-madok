<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item :label="`${t('球员ID')}:`" prop="playerId">
        <el-input
          v-model="form.teamId"
          :placeholder="t('球员ID')"
          clearable
          class="!w-[130px]"
        />
      </el-form-item>
      <el-form-item :label="`${t('所属球队')}:`" prop="level">
        <el-input
          v-model="form.countryId"
          :placeholder="t('所属球队')"
          clearable
          class="!w-[130px]"
        />
      </el-form-item>

      <el-form-item :label="`${t('国籍')}:`" prop="countryId">
        <el-input
          v-model="form.countryId"
          :placeholder="t('国籍')"
          clearable
          class="!w-[130px]"
        />
      </el-form-item>

      <el-form-item :label="`${t('是否国家队队员')}:`" prop="countryId">
        <el-select
          v-model="form.isCountryPlayer"
          :placeholder="t('请选择')"
          class="!w-[150px]"
        >
          <el-option :label="t('是')" :value="0" />
          <el-option :label="t('否')" :value="1" />
        </el-select>
      </el-form-item>

      <el-form-item :label="`${t('身高')}:`" prop="level">
        <el-input
          v-model="form.height"
          :placeholder="t('身高')"
          clearable
          class="!w-[130px]"
        />
      </el-form-item>

      <el-form-item :label="`${t('性别')}:`" prop="countryId">
        <el-select
          v-model="form.gender"
          :placeholder="t('请选择')"
          class="!w-[150px]"
        >
          <el-option :label="t('男')" :value="0" />
          <el-option :label="t('女')" :value="1" />
        </el-select>
      </el-form-item>

      <el-form-item :label="`${t('生日')}:`" prop="sportId">
        <el-input
          v-model="form.birthday"
          :placeholder="t('生日')"
          clearable
          class="!w-[150px]"
        />
      </el-form-item>

      <el-form-item :label="`${t('简称')}:`" prop="sportId">
        <el-input
          v-model="form.简称"
          :placeholder="t('简称')"
          clearable
          class="!w-[130px]"
        />
      </el-form-item>

      <el-form-item :label="`${t('球员中文名')}:`" prop="sportId">
        <el-input
          v-model="form.playerNameCn"
          :placeholder="t('球员中文名')"
          clearable
          class="!w-[130px]"
        />
      </el-form-item>

      <el-form-item :label="`${t('创建时间')}:`" prop="sportId">
        <el-input
          v-model="form.createdAt"
          :placeholder="t('创建时间')"
          clearable
          class="!w-[130px]"
        />
      </el-form-item>

      <el-form-item :label="`${t('更新时间')}:`" prop="sportId">
        <el-input
          v-model="form.updatedAt"
          :placeholder="t('更新时间')"
          clearable
          class="!w-[130px]"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="onSearch('reload')"
        >
          {{ t('筛选') }}
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          {{ t('重置') }}
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar
      title="球员管理列表"
      :columns="columns"
      @refresh="onSearch('reload')"
    >
      <!-- <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDialog(t('新增球员'))"
        >
          {{ t("新增球员") }}
        </el-button>
      </template> -->
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          class="table_container"
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="{ ...pagination, pageSizes: pageSizeArr }"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="tableHeaderStyle"
          @selection-change="handleSelectionChange"
          @page-size-change="handleTableWidthChange"
          @page-current-change="handleCurrentChange"
        >
          <template #isCountryTeam="row">
            {{ row.isCountryTeam ?? '-' }}
          </template>
          <template #stadiumName="row">
            {{ row.stadiumName ?? '-' }}
          </template>
          <template #teamLogo="{ row, index }">
            <el-image
              preview-teleported
              loading="lazy"
              :src="row.leagueLogo"
              :preview-src-list="dataList.map(v => v.picture)"
              :initial-index="index"
              fit="fill"
              class="!w-[80px] h-[30px]"
            >
              <template #placeholder>
                <div class="loading_container">
                  <IconifyIconOffline icon="loadingIcon"></IconifyIconOffline>
                </div>
              </template>
            </el-image>
          </template>
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="openDialog(t('编辑赛事'), row)"
            >
              {{ t('编辑') }}
            </el-button>
            <el-popconfirm
              :title="`是否确认删除角色名称为${row.name}的这条数据`"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="danger"
                  :size="size"
                  :icon="useRenderIcon(Delete)"
                >
                  {{ t('删除') }}
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { PureTableBar } from '@/components/RePureTableBar';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import Delete from '@iconify-icons/ep/delete';
import EditPen from '@iconify-icons/ep/edit-pen';
import Search from '@iconify-icons/ep/search';
import Refresh from '@iconify-icons/ep/refresh';
import { useLeague } from './utils/hook';

import { t } from '@/plugins/i18n';
import { usePublicHooks } from '@/hooks';
import { pageSizeArr } from '@/utils/math';

defineOptions({ name: 'DATAMANAGER_SPORT_PLAYER' });

const { tableHeaderStyle } = usePublicHooks();

const formRef = ref();
const {
  form,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  openDialog,
  handleDelete,
  handleTableWidthChange,
  handleCurrentChange,
  handleSelectionChange
} = useLeague();
</script>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
