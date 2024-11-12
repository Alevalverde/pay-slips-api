/**
 * Generates a formatted date-time string based on the provided timezone.
 * The format of the returned string is 'YY-MM-DD_HH-MM-SS'.
 *
 * @param {string} timezone - The IANA timezone identifier (e.g., 'America/New_York').
 * @returns {string} - A string representing the current date and time in the specified timezone,
 * formatted as 'YY-MM-DD_HH-MM-SS'.
 */
export function getDateToFileName(timezone: string): string {
  const now = new Date();
  const localTime = now.toLocaleString('en-US', { timeZone: timezone });
  const localDate = new Date(localTime);

  const year = String(localDate.getFullYear()).slice(-2);
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');
  const hours = String(localDate.getHours()).padStart(2, '0');
  const minutes = String(localDate.getMinutes()).padStart(2, '0');
  const seconds = String(localDate.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}
