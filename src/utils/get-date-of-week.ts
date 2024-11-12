import { toZonedTime } from 'date-fns-tz';
import { getDay } from 'date-fns';

export const getDayOfWeek = (date: string, timezone: string): string => {
  const zonedDate = toZonedTime(date, timezone || 'America/Argentina/Buenos_Aires');
  const dayOfWeekNum = getDay(zonedDate);
  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return daysOfWeek[dayOfWeekNum] || 'Unknown';
};
