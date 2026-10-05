// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare namespace TaskCenterAPI {
  type responseData = {
    current: number;
    records: ListItem[];
    pages: number;
    pageSize: number;
    size: number;
    total: number;
  };

  type ListItem = {
    orderBy: string;
    asc: string;
    id: number;
    fileName: string;
    fileSize: number;
    pageFrom: string;
    status: number;
    createdBy: string;
    updatedBy: string;
    updatedAt: string;
    createdAt: string;
    num: number;
    url: string;
  };

  type addSysAccountReqType = COMMON.BASE_RES_TYPE<null>;
  type listResponse = COMMON.BASE_RES_TYPE<responseData>;
}
