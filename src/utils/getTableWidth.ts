import { useNav } from "@/layout/hooks/useNav";
import { TableColumnRenderer } from "@pureadmin/table";

export const handleTableWidth = (d: TableColumnRenderer, label: string, type?: 'auto', isOperation?: boolean): string => {
  const { $storage } = useNav();
  if ((type && $storage.locale.locale === 'zh') || d.column.width) return label;
  d.column.width = isOperation ? 50 + getColumnWidth(d.column.label as string) : getColumnWidth(d.column.label as string);
  return ''
}

export const getColumnWidth = (strs: string) => {
  const { $storage } = useNav();
  if ($storage.locale.locale === 'zh') {
    return strs.length * 20;
  } else {
    return strs.length * 15;
  }
}