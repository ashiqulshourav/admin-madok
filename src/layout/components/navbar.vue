<template>
  <div
    class="navbar bg-[#fff] shadow-sm shadow-[rgba(0, 21, 41, 0.08)] dark:shadow-[#0d0d0d]"
  >
    <topCollapse
      class="hamburger-container"
      :is-active="pureApp.sidebar.opened"
      @toggleClick="toggleSideBar"
    />
    <Breadcrumb v-if="layout !== 'mix'" class="breadcrumb-container" />
    <!-- <mixNav v-if="layout === 'mix'" /> -->

    <div
      v-if="layout === 'vertical'"
      class="vertical-header-right flex items-center"
    >
      <!-- 菜单搜索 -->
      <!-- <Search /> -->
      <!-- 通知 -->
      <!-- <Notice id="header-notice" /> -->
      <!-- 国际化 -->
      <!-- RiskNotice Menu -->
      <div
        v-if="noticeValueCount > 0"
        class="relative mr-5 flex items-center justify-center cursor-pointer"
        @click="goToRiskNotice"
      >
        <el-icon size="large"><UserFilled /></el-icon>
        <span
          class="absolute p-1 bg-red-500 min-w-4 h-4 text-[10px] mr-2 flex items-center justify-center bottom-[10px] left-[10px] text-white rounded-full"
          >{{ noticeValue }}</span
        >
      </div>
      <LanguageNav />
      <!-- 退出登录 -->
      <el-dropdown trigger="click">
        <span class="el-dropdown-link navbar-bg-hover select-none">
          <img :src="userAvatar" />
          <p v-if="userStore.userInfo.name" class="dark:text-white ml-1">
            {{ userStore.userInfo.name }}
          </p>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="logout">
            <el-dropdown-item @click="openResetDialog">
              <IconifyIconOffline icon="configCenter" style="margin: 5px" />
              {{ t('重置密码') }}
            </el-dropdown-item>
            <el-dropdown-item @click="logout">
              <IconifyIconOffline
                icon="LogoutCircleRLine"
                style="margin: 5px"
              />
              {{ t('退出系统') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <span
        class="set-icon navbar-bg-hover"
        @click="onPanel"
        :title="t('打开项目配置')"
      >
        <IconifyIconOffline icon="Setting" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNav } from '@/layout/hooks/useNav';
import Breadcrumb from './sidebar/breadCrumb.vue';
import topCollapse from './sidebar/topCollapse.vue';

import LanguageNav from '@/components/LanguageNav/index.vue';
import { t } from '@/plugins/i18n';
import { useUserStore } from '@/store/user';
import { useResetPasswordHook } from '@/hooks/resetPasswordHook';
import { UserFilled } from '@element-plus/icons-vue';
import { useRiskNoticeStore } from '@/store/riskNotice';
import { useRouter } from 'vue-router';

const { openResetDialog } = useResetPasswordHook();
const interval = ref<NodeJS.Timeout>();
const router = useRouter();

const userStore = useUserStore();
const riskNoticeStore = useRiskNoticeStore();
const { layout, logout, onPanel, pureApp, userAvatar, toggleSideBar } =
  useNav();

const goToRiskNotice = () => {
  router.push('/riskManagement/riskNotice');
};

const noticeValue = computed(() => {
  const total =
    Number(riskNoticeStore.esportAuditCount) +
    Number(riskNoticeStore.jjAuditCount) +
    Number(riskNoticeStore.sportAuditCount);
  return Number(total) > 9999 ? '9999+' : total;
});

const noticeValueCount = computed(() => {
  const total =
    Number(riskNoticeStore.esportAuditCount) +
    Number(riskNoticeStore.jjAuditCount) +
    Number(riskNoticeStore.sportAuditCount);
  return Number(total);
});

const refreshRiskNoticeWithInterval = async () => {
  // console.log('leep', riskNoticeStore.isLoop);
  if (interval.value) clearInterval(interval.value);
  if (riskNoticeStore.isLoop) {

    if (riskNoticeStore.riskNotificationSwitch) {      
      await riskNoticeStore.setRiskNotice();
      interval.value = setInterval(async () => {
        await riskNoticeStore.setRiskNotice();
      }, 5000);
    } else {
        await riskNoticeStore.setRiskNotice();
    }
  } 
};

onMounted(() => {
  if (riskNoticeStore.isLoop) {
    refreshRiskNoticeWithInterval();
    riskNoticeStore.setRiskNotificationSwitch();
  }
  // riskNoticeStore.setRiskNotice();
});

watch(
  () => [
    riskNoticeStore.riskNotificationSwitch,
    riskNoticeStore.riskNotificationRefresh,
    riskNoticeStore.createTimeStart,
    riskNoticeStore.createTimeEnd,
    // riskNoticeStore.isLoop
  ],
  () => {
    if (riskNoticeStore.createTimeStart && riskNoticeStore.createTimeEnd) {
      refreshRiskNoticeWithInterval();
    } else {
      refreshRiskNoticeWithInterval();
    }
  }
);
</script>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  height: 48px;
  overflow: hidden;

  .hamburger-container {
    float: left;
    height: 100%;
    line-height: 48px;
    cursor: pointer;
  }

  .vertical-header-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 280px;
    height: 48px;
    color: #000000d9;

    .el-dropdown-link {
      display: flex;
      align-items: center;
      justify-content: space-around;
      height: 48px;
      padding: 10px;
      color: #000000d9;
      cursor: pointer;

      p {
        font-size: 14px;
      }

      img {
        width: 22px;
        height: 22px;
        border-radius: 50%;
      }
    }
  }

  .breadcrumb-container {
    float: left;
    margin-left: 16px;
  }
}

.translation {
  ::v-deep(.el-dropdown-menu__item) {
    padding: 5px 40px;
  }

  .check-zh {
    position: absolute;
    left: 20px;
  }

  .check-en {
    position: absolute;
    left: 20px;
  }
}
</style>
