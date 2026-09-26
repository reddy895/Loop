/**
 * @file searchUtils.ts
 * @description Helper functions for sanitizing search queries and building database search filters.
 */

/**
 * Sanitizes user search query string to prevent injection or invalid characters.
 * @param query Raw search query string
 */
export const sanitizeSearchQuery = (query?: string): string => {
  if (!query) return "";
  return query.trim().replace(/[%_]/g, "\\$&");
};

/**
 * Generates insensitive SQL/Prisma search clause object placeholder.
 * @param searchField Database field name
 * @param query Search query string
 */
export const createInsensitiveSearchFilter = (searchField: string, query?: string): Record<string, unknown> => {
  const sanitized = sanitizeSearchQuery(query);
  if (!sanitized) return {};

  return {
    [searchField]: {
      contains: sanitized,
      mode: "insensitive",
    },
  };
};
