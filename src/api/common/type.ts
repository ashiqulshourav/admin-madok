declare namespace COMMON {
  type ListData<T = Record<string, any>> = {
    total: number;
    list: T[];
    pageNum?: number;
    pageSize?: number;
    size?: number;
    startRow?: number;
    endRow?: number;
    pages?: number;
    prePage?: number;
    nextPage?: number;
    isFirstPage?: boolean;
    isLastPage?: boolean;
    hasPreviousPage?: boolean;
    hasNextPage?: boolean;
    navigatePages?: number;
    navigatepageNums?: number[];
    navigateFirstPage?: number;
    navigateLastPage?: number;
    pageData?:T[];
  };

  type BASE_RES_TYPE<T = ListData> = {
    code: number;
    msg: string;
    ts?: number;
    data: T;
  };

  type ListFetchProps = {
    pageSize: number;
    pageNum: number;
  }

  type FormProps<T = any> = {
    formInline: T;
  };
}
