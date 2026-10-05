/** 密码正则（密码格式应为8-18位数字、字母、符号的任意两种组合） */
// export const REGEXP_PWD = /^(?=.*[a-zA-Z])(?=.*\d|[^\u4e00-\u9fa5])[\da-zA-Z!@#$%^&*()_+-=]{8,32}$/;
export const REGEXP_PWD = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z\u4E00-\u9FA5]).{8,32}$/;