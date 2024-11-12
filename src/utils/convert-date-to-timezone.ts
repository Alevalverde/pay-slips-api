/**
 * Converts a given date string to a specific timezone offset.
 * @param dateString - The date string in ISO format.
 * @param offset - The timezone offset in hours (e.g., -3 for GMT-3).
 * @returns The converted date string with the specified timezone offset.
 */
export function convertDateToTimezone(dateString: string, offset: number): string {
  // Convert the input date string to a Date object
  const date = new Date(dateString);

  // Calculate the offset in milliseconds
  const offsetInMilliseconds = offset * 60 * 60 * 1000;

  // Get the UTC time in milliseconds from the Date object
  const utcTimeInMilliseconds = date.getTime();

  // Adjust the UTC time by adding the offset in milliseconds
  const adjustedTimeInMilliseconds = utcTimeInMilliseconds + offsetInMilliseconds;

  // Create a new Date object with the adjusted time
  const adjustedDate = new Date(adjustedTimeInMilliseconds);

  // Format the date to an ISO string and remove milliseconds
  const isoString = adjustedDate.toISOString();
  const isoDateTime = isoString.slice(0, 19);

  // Format the timezone offset string
  const timezoneOffset = `${(offset >= 0 ? '+' : '-') + String(Math.abs(offset)).padStart(2, '0')}:00`;

  return `${isoDateTime}${timezoneOffset}`;
}
