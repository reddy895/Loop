/**
 * @file dateUtils.ts
 * @description Helper functions for date formatting, calculation, and ISO string conversion.
 */

/**
 * Formats a Date object or timestamp string into ISO 8601 standard format.
 * @param date Target date input
 */
export const formatDateToIso = (date: Date | string | number): string => {
  const d = new Date(date);
  return d.toISOString();
};

/**
 * Calculates start and end Date objects for a given number of days in the past.
 * @param days Number of days lookback
 */
export const getDateRangeForDays = (days: number): { startDate: Date; endDate: Date } => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);
  return { startDate, endDate };
};

/**
 * Checks if a given value is a valid Date instance or parseable string.
 * @param value Input candidate value
 */
export const isValidDate = (value: unknown): boolean => {
  if (value instanceof Date) {
    return !isNaN(value.getTime());
  }
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    return !isNaN(d.getTime());
  }
  return false;
};
