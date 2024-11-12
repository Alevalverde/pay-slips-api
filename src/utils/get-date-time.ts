/**
 * Formats a date string into an object containing separate date and time strings.
 *
 * @param {Date} dateString - The date string to be formatted.
 * @returns {{ date: string, time: string }} An object containing the formatted date and time.
 */
export const formatDateAndTime = (dateString: Date) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`,
  };
};
