// input输入数字
const MAX_INPUT_NUMBER_LENGTH = 15;
export const formatNumber = (val: string, len?: number) => {
  if (val === '0') return val;
  return val
    .replace(/\D/g, '')
    .replace(/^0{1,}/g, '')
    .slice(0, len ?? MAX_INPUT_NUMBER_LENGTH);
};

export const formatNumber0to100 = (val: string, len?: number) => {
  const cleanedValue = val.replace(/\D/g, '');

  if (cleanedValue === '') {
    return '';
  }

  const normalizedValue = cleanedValue.replace(/^0+/, '');

  const finalValue = normalizedValue === '' ? '0' : normalizedValue;

  let numericValue = parseInt(finalValue, 10);

  numericValue = Math.min(Math.max(numericValue, 0), 100);

  const formattedValue = numericValue
    .toString()
    .slice(0, len ?? numericValue.toString().length);

  return formattedValue;
};

export const formatIp = (val: string): string => {
  const partialIpPattern = /^(\d{0,3})(\.\d{0,3}){0,3}$/;

  if (!partialIpPattern.test(val)) {
    val = val.slice(0, -1);
  } else {
    const segments = val.split('.');
    for (let i = 0; i < segments.length; i++) {
      if (segments[i] && parseInt(segments[i], 10) > 255) {
        val = val.slice(0, -1);
        break;
      }
    }
  }

  // 重新拼接成IP地址格式，最多四个部分
  return val;
};

export const formatNumberWithLength = (value: string, length: number) => {
  // Convert value to string
  let stringValue = String(value);

  // Remove non-digit characters except plus and minus signs
  stringValue = stringValue.replace(/[^0-9.-]/g, '');

  // Extract sign if present
  let sign = '';
  if (stringValue[0] === '-' || stringValue[0] === '+') {
    sign = stringValue[0];
    stringValue = stringValue.slice(1);
  }

  // Extract decimal part if present
  let decimalPart = '';
  const decimalIndex = stringValue.indexOf('.');
  if (decimalIndex !== -1) {
    decimalPart = stringValue.slice(decimalIndex);
    stringValue = stringValue.slice(0, decimalIndex);
  }

  // Pad integer part with leading zeros if necessary
  while (
    stringValue.length < length &&
    stringValue.length + decimalPart.length < length
  ) {
    stringValue = '0' + stringValue;
  }

  // Concatenate sign and decimal part
  stringValue = sign + stringValue + decimalPart;

  return stringValue;
};

export const formatWarningNum = (val: string, len?: number) => {
  if (val === '0') return 1;
  if (+val > 100) return 100;
  return val
    .replace(/\D/g, '')
    .replace(/^0{1,}/g, '')
    .slice(0, len ?? MAX_INPUT_NUMBER_LENGTH);
};

export const formatNumberAndFillZero = (val: string, len?: number) => {
  if (val === '0') return val;
  if (val === '') return 0;
  return val
    .replace(/\D/g, '')
    .replace(/^0{1,}/g, '')
    .slice(0, len ?? MAX_INPUT_NUMBER_LENGTH);
};

export const formatNumberAndFillNull = (val: string, len?: number) => {
  if (val === '0') return null;
  if (val === '') return null;
  return val
    .replace(/\D/g, '')
    .replace(/^0{1,}/g, '')
    .slice(0, len ?? MAX_INPUT_NUMBER_LENGTH);
};

//- 过滤中文跟空格
export const formatChinese = (val: string, len?: number) => {
  if (val === '0') return val;
  return val
    .replace(/\u4e00-\u9fa5\s/g, '')
    .replace(/^0{1,}/g, '')
    .slice(0, len ?? MAX_INPUT_NUMBER_LENGTH);
};

const MIN = 1;
const MAX = 200;
export const inputRestrictions = (
  val: string,
  min: number = MIN,
  max: number = MAX
) => {
  if (val === '0') return val;
  if (val !== '') {
    let n = +val.replace(/\D/g, '').replace(/^0{1,}/g, '');
    if (n > max) n = max;
    if (n < min) n = min;
    return n;
  } else {
    return '';
  }
};

//- 数字千位分割
export const addThousandSeparator = (num: string, separator = ',') => {
  if (num === null) {
    return '';
  }
  return num?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
};
