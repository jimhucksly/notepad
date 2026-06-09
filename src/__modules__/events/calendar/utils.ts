/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function isDate(date: any): boolean {
  return date instanceof Date && !isNaN(date.getFullYear());
}

/**
 * @param {string} d 15.01.2001
 * @return {Date}
 */
export function getNativeDate(d: string): Date | null {
  if (/^(\d+).(\d+).(\d+)$/.test(d)) {
    return new Date(d.replace(/^(\d+)\.(\d+)\.(\d+)$/, '$2/$1/$3'));
  }
  try {
    const date = new Date(d);
    return date;
  } catch (e) {
    /* eslint-disable no-console */
    console.error(e);
  }
  return null;
}
