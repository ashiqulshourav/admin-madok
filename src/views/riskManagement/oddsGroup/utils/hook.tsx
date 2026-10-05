import { message } from '@/utils/message';
import { reactive, ref, onMounted } from 'vue';
import { StateProps } from './types';
import { t } from '@/plugins/i18n';
export function useOddsGroupHook() {
  const dafaultObj = {
    level: 1,
    optionAssignmentOne: '',
    optionAssignmentTwo: ''
  };
  const state = reactive<StateProps>({
    isEdit: false,
    loading: false,
    columns: [
      {
        label: t('赔率分组等级'),
        prop: 'level'
      },
      {
        label: t('选项1减值'),
        prop: 'optionAssignmentOne',
        cellRenderer: ({ row }) => (
          <el-input-number
            controls={false}
            v-model={row.optionAssignmentOne}
            placeholder={t('请输入-0.99 ~ 0.00')}
            min={-0.99}
            max={0}
            precision={2}
            readonly={!state.isEdit}
          />
        )
      },
      {
        label: t('选项2减值'),
        prop: 'optionAssignmentTwo',
        cellRenderer: ({ row }) => (
          <el-input-number
            controls={false}
            v-model={row.optionAssignmentTwo}
            placeholder={t('请输入-0.99 ~ 0.00')}
            min={-0.99}
            max={0}
            precision={2}
            readonly={!state.isEdit}
          />
        )
      }
    ],
    data: [{ ...dafaultObj }]
  });

  // 编辑
  const edit = () => {
    state.isEdit = true;
  };

  // 确认
  const confirm = async () => {
    const params: RiskManagementDataAPI.RiskOddsGroupData[] = state.data;
    state.loading = true;
    const res = await API.EditOddsGroupApi(params);
    getOddsGroup();
    state.isEdit = false;
  };

  // 取消
  const cancel = () => {
    state.isEdit = false;
  };

  // 添加
  const add = () => {
    const item = { ...dafaultObj, level: state.data.length + 1 };
    state.data.push(item);
  };

  // 删除
  const deleteRow = () => {
    state.data.pop();
  };

  const getOddsGroup = async () => {
    state.loading = true;
    const res = await API.getOddsGroupApi({});
    state.data = res.data;
    state.loading = false;
  };
  onMounted(() => {
    getOddsGroup();
  });

  return {
    state,
    edit,
    confirm,
    cancel,
    deleteRow,
    add
  };
}
