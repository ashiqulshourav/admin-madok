import { hasAuth } from "@/router/utils";
import type { Directive, DirectiveBinding } from "vue";

export const auth: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding;
    if (value) {
      if (!hasAuth(value)) {
        const parentNode = el.parentNode;
        el.parentNode?.removeChild(el);
        (parentNode as HTMLElement).innerHTML = '-'
      }
    } else {
      throw new Error(
        "[Directive: auth]: need auths! Like v-auth=\"['btn.add','btn.edit']\""
      );
    }
  }
};
