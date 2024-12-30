export interface FilePayload {
  nameFile: NameFile;
  month: Month;
  year: string;
}

export enum NameFile {
  PAYSLIP = 'BS',
  FIRST_SAC = '1° SAC',
  SECOND_SAC = '2° SAC',
}

export enum Month {
  JANUARY = 'ENE',
  FEBRUARY = 'FEB',
  MARCH = 'MAR',
  APRIL = 'ABR',
  MAY = 'MAY',
  JUNE = 'JUN',
  JULY = 'JUL',
  AUGUST = 'AGO',
  SEPTEMBER = 'SEP',
  OCTOBER = 'OCT',
  NOVEMBER = 'NOV',
  DECEMBER = 'DIC',
}
