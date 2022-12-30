import moment from "moment";

export const getHours = (durationM: moment.Duration) => Math.floor(durationM.asHours());
export const getMins = (durationM: moment.Duration) => Math.floor(durationM.asMinutes() % 60);
export const getSeconds = (durationM: moment.Duration) => Math.floor(durationM.asSeconds() % 60);
export const getZeroPrefixedNum = (num: number, length: number = 2) => (
  String(num).length >= length ? num : Array(length - String(num).length).fill(0).join('') + num
);

export const getShortDurationFormat = (durationM: moment.Duration) => (
  (getHours(durationM) ? getZeroPrefixedNum(getHours(durationM)) + ':' : '') +
  (getMins(durationM) ? getZeroPrefixedNum(getMins(durationM)) + ':' : '00:') +
  (getSeconds(durationM) ? getZeroPrefixedNum(getSeconds(durationM)) : '00')
);

export const formatShortFromNow = (str: string) => (
  str
    .replace('minute', 'min')
    .replace('hour', 'hr')
    .replace('a few', '')
)
