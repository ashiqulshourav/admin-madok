
export type accountChangeRecordSearchFormType = {
  pageSize?: number | string;
  pageNum?: number | string;
  endCreatedAt: string | number,
  startCreatedAt: string | number,
  userId: string
  accountChangeTypeCode: string | number
  identifier: string | number,
}


export type modifyBalanceFormType = {
  userId: string,
  amount: number,
  accountChangeTypeCode: number,
  remark: string,
}

export type userDataType = {
  userId: string,
  userName: string,
  tenantName: string,
  balance: number,
}
