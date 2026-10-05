 interface StateProps {
   [propName: string]: any;
   isEdit: boolean;
   columns: TableColumnList;
   data: Array<any>;
}

export type {
  StateProps,
};