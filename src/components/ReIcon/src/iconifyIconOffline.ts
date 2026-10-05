import { h, defineComponent } from "vue";
import { Icon as IconifyIcon, addIcon } from "@iconify/vue/dist/offline";
import type { IconifyIcon as IconifyIconType } from '@iconify/types';

export default defineComponent({
  name: "IconifyIconOffline",
  components: { IconifyIcon },
  props: {
    icon: {
      type: [String, Object],
      default: '',
    }
  },
  render() {
    if (typeof this.icon === "object") addIcon(this.icon as unknown as string, this.icon as IconifyIconType);
    const attrs = this.$attrs;
    return h(
      IconifyIcon,
      {
        icon: this.icon as string | IconifyIconType,
        style: attrs?.style
          ? Object.assign(attrs.style, { outline: "none" })
          : { outline: "none" },
        ...attrs
      },
      {
        default: () => []
      }
    );
  }
});
