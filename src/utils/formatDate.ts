// import dayjs from "dayjs";

export const disableDate = (date: Date) => {
  return new Date(date).getTime() + 1 * 24 * 3600 * 1000 < Date.now();
};

export const dateGetSecond = (timestamp: Date) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  return totalSeconds;
};

export const padZero = (n: number) => {
  return n < 10 ? '0' + n : n;
}

export const getSecondTime = (s1: any, s2: any) => {
  return dateSetSecond(parseInt(new Date(s1).getTime() / 1000) -
    parseInt(new Date(s2).getTime() / 1000));
}

export const dateSetSecond = (secondNumber: number) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const seconds = secondNumber % 60;
  const minutes = Math.floor((secondNumber / 60) % 60);
  const hours = Math.floor(secondNumber / 3600);
  return `${year}-${padZero(month)}-${padZero(day)} ${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
};

export const getSecond = (totalSeconds: number) => {
  const minutes = padZero(Math.floor(totalSeconds / 60));
  const seconds = padZero(totalSeconds % 60);
  return `${minutes}:${seconds}`;
}

//- 十分秒获取时间戳
export const compareTime = (time: string) => {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};


export const WEEK_MAP = {
  0: t('星期日'),
  1: t('星期一'),
  2: t('星期二'),
  3: t('星期三'),
  4: t('星期四'),
  5: t('星期五'),
  6: t('星期六')
};
