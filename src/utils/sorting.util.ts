export function orderByDate<T>(items: T[], dateProperty: keyof T): T[] {
  return items.sort((a, b) => {
    const dateA = new Date(a[dateProperty] as unknown as string);
    const dateB = new Date(b[dateProperty] as unknown as string);
    return dateA.getTime() - dateB.getTime();
  });
}
