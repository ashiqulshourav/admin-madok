import { message } from '@/utils/message';
import { useEventListener, useClipboard } from '@vueuse/core';
import type { Directive, DirectiveBinding } from 'vue';

interface CopyEl extends HTMLElement {
  copyValue: string;
}

/** 文本复制指令（默认双击复制） */
export const copy: Directive = {
  mounted(el: CopyEl, binding: DirectiveBinding) {
    const { value } = binding;
    if (value) {
      el.copyValue = value.val;
      const arg = binding.arg ?? "dblclick";
      // Register using addEventListener on mounted, and removeEventListener automatically on unmounted
      useEventListener(el, arg, (e) => {
        e.stopPropagation()
        // const success = copyTextToClipboard(value.val);
        const { copy } = useClipboard({ source: value.val, legacy: true })
        copy(value.val)
        message(value?.tip ? value.tip : "复制成功", { type: "success" })
      });
    } else {
      throw new Error(
        '[Directive: copy]: need value! Like v-copy="modelValue"'
      );
    }
  },
  updated(el: CopyEl, binding: DirectiveBinding) {
    el.copyValue = binding.value;
  }
};
