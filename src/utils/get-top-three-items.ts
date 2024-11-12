/**
 * Determines the top three most frequent items in an array of strings.
 * It counts each occurrence, sorts items by frequency in descending order, and returns the top three items.
 * @param items - Array of strings to analyze.
 * @returns Array of the top three most frequent strings.
 */
export function getTopThreeItems(items: string[]): string[] {
  const countMap: Record<string, number> = {};
  items.forEach((item) => {
    if (item) countMap[item] = (countMap[item] || 0) + 1;
  });

  return Object.entries(countMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map((entry) => entry[0]);
}
