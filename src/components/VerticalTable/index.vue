<template>
	<div class="table-container">
		<div class="vertical-table-title" :style="cssVar">{{ title }}</div>
		<table class="vertical-table" :style="cssVar">
			<tr v-for="(column, index) in columns" :key="index">
				<th>{{ t(column.label) }}</th>
				<td>
					<div v-for="(key, index) in column.keys" :key="index">
						{{ handleNullValue(dataList[key]) }}
					</div>
				</td>
			</tr>
		</table>
	</div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { useDataThemeChange } from '@/layout/hooks/useDataThemeChange';

defineProps<{ 
	columns: { label: string; keys: string[]; }[];
	dataList: [];
	title: string;
}>()

const { dataTheme } = useDataThemeChange();
const cssVar = dataTheme.value ? `--bgEven: #262727; --bgOdd: #141414; --border: rgba(30 30 30);` : `--bgEven: #F2F2F2; --bgOdd: #FFFFFF; --border: rgb(248 248 248);`
const handleNullValue = (value: string | number) => {
	return value ? value : '-';
}
</script>
<style lang="scss">
.table-container {
	box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
}

.vertical-table {
	border-collapse: collapse;
	border-spacing: 0;
	width: 100%;
}

.vertical-table th,
.vertical-table td {
	text-align: left;
	padding: 16px;
	border: 1px solid var(--border);
}

.vertical-table tr:nth-child(even) {
	background-color: var(--bgEven);
}

.vertical-table tr:nth-child(odd) {
	background-color: var(--bgOdd);
}

.vertical-table-title {
  text-align: center;
	background-color: var(--bgEven);
}
</style>
