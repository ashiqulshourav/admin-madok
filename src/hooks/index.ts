// 抽离可公用的工具函数等用于系统管理页面逻辑
import { computed } from "vue";
import { useDark } from "@pureadmin/utils";
import { ElMessageBox } from "element-plus";

export function usePublicHooks() {
  const { isDark } = useDark();

  const switchStyle = computed(() => {
    return {
      "--el-switch-on-color": "#6abe39",
      "--el-switch-off-color": "#e84749"
    };
  });

  const tagStyle = computed(() => {
    return (status: number) => {
      return status === 1
        ? {
          "--el-tag-text-color": isDark.value ? "#6abe39" : "#389e0d",
          "--el-tag-bg-color": isDark.value ? "#172412" : "#f6ffed",
          "--el-tag-border-color": isDark.value ? "#274a17" : "#b7eb8f"
        }
        : {
          "--el-tag-text-color": isDark.value ? "#e84749" : "#cf1322",
          "--el-tag-bg-color": isDark.value ? "#2b1316" : "#fff1f0",
          "--el-tag-border-color": isDark.value ? "#58191c" : "#ffa39e"
        };
    };
  });

  const tableHeaderStyle = computed(() => {
    return {
      background: 'var(--el-fill-color-light)',
      color: 'var(--el-text-color-primary)'
    }
  })

  const tableHeaderStyleBlue = computed(() => {
    return {
      background: 'var(--el-color-primary)',
      color: 'white'
    }
  })

  const exportDialog = ({
    firstTitle,
    callback,
    router
  }: {
    callback: () => void;
    firstTitle?: string;
    secondContent?: string;
    router: any
  }) => {
    ElMessageBox.confirm(
      `<div class="flex flex-col pl-4">
        <span class="font-bold text-[16px]">${firstTitle}</span>
        <span>${t('点击确认立即导出')}</span>
      </div>`,
      t('操作确认'),
      {
        confirmButtonText: t('确定'),
        cancelButtonText: t('取消'),
        customClass: 'export_dialog',
        dangerouslyUseHTMLString: true
      }
    )
      .then(async () => {
        await callback();
        ElMessageBox.confirm(
          `<div class="flex flex-col pl-4">
            <span class="font-bold text-[16px]">${t('正在执行导出任务')}</span>
            <span>${t('点击确认前往任务中心?')}</span>
          </div>`,
          t(''),
          {
            confirmButtonText: t('确定'),
            cancelButtonText: t('留在当前页面'),
            customClass: 'export_dialog',
            dangerouslyUseHTMLString: true
          }
        ).then(() => {
          router.push('/taskCenter');
        });
      })
      .catch(e => {
        console.log(e);
      });
  };


  return {
    /** 当前网页是否为`dark`模式 */
    isDark,
    /** 表现更鲜明的`el-switch`组件  */
    switchStyle,
    /** 表现更鲜明的`el-tag`组件  */
    tagStyle,
    exportDialog,
    tableHeaderStyle,
    tableHeaderStyleBlue
  };
}
