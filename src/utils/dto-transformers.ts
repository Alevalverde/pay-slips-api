export const capitalize = (text: string): string => (text ? text[0].toUpperCase() + text.slice(1).toLowerCase() : text);

export const formatDateTime = (date: string): string => `${date.substring(0, 10)} ${date.substring(11, 19)}`;
export const extractDatePart = (date: string): string => `${date.substring(0, 10)}`;
export const transformDateToHour = (date: string): number => Number(`${date.substring(11, 13)}`);

export const filterUndefined = <T extends object>(obj: T): Partial<T> =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>;
