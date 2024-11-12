import { adjustDateTime } from 'qsocialnow-common';
import { TimeInterval } from '@/models/enums/time-interval.enum';

export function processTimeInterval(
  startDate: string,
  endDate: string,
  isDistributionTemporal: boolean = false
): TimeInterval {
  const endDateFormated = adjustDateTime(new Date(endDate), 23, 59, 59, 999);

  const datesHourDifference = Math.abs(
    (new Date(endDateFormated!).getTime() - new Date(startDate!).getTime()) / (1000 * 60 * 60)
  );

  if (datesHourDifference <= 24) return isDistributionTemporal ? TimeInterval.THREEHOUR : TimeInterval.HOUR;

  if (datesHourDifference <= 720) return TimeInterval.DAY;

  return TimeInterval.WEEK;
}

export const criteriaMap: Record<number, string> = {
  [TimeInterval.HOUR]: '1h',
  [TimeInterval.THREEHOUR]: '3h',
};
