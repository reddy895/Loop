/**
 * @file stringUtils.ts
 * @description Utilities for string transformations, slugification, truncation, and capitalization.
 */

/**
 * Truncates text to a specified maximum length with trailing ellipsis.
 * @param str Target text string
 * @param maxLength Max allowed characters
 */
export const truncateString = (str: string, maxLength: number = 100): string => {
  if (!str || str.length <= maxLength) return str;
  return `${str.slice(0, maxLength).trim()}...`;
};

/**
 * Capitalizes the first letter of a word or sentence.
 * @param str Input string
 */
export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Converts a string into a URL-friendly slug.
 * @param text Raw title or text
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};
