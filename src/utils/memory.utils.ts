export default function printMemoryUsage() {
  const used = process.memoryUsage();
  Object.entries(used).forEach(([key, value]) => {
    if (Object.prototype.hasOwnProperty.call(used, key)) {
      console.log(`${key} ${Math.round((value / 1024 / 1024) * 100) / 100} MB`);
    }
  });
}
