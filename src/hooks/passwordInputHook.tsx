import { addDialog, closeDialog } from '@/components/ReDialog';

import PasswordInput from '@/components/PasswordInput/index.vue';

export const usePasswordInputHook = (prop?: {showClose?: boolean}) => {
  const resetFormRef = ref();

  const openPasswordInput = () => {
    return new Promise<boolean>(resolve => {
      addDialog({
        title: t('请输入U盾密码'),
        class: 'reset_dialog',
        width: '25%',
        center: true,
        closeOnClickModal: false,
        hideFooter: true,
        showClose: prop?.showClose == false ? false : true,
        contentRenderer: ({ options, index }) =>
          h(PasswordInput, {
            ref: resetFormRef,
            onCloseDialog: (_: boolean) => {
              closeDialog(options, index);
              setTimeout(() => {
                resolve(_);
              }, 300);
            }
          })
      });
    });
  };

  return { openPasswordInput };
};
