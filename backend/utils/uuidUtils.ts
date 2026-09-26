/**
 * @file uuidUtils.ts
 * @description UUID validation and identifier format helper functions.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Validates whether a given string is a valid UUID v4 format.
 * @param id Candidate string ID
 */
export const isValidUuid = (id: string): boolean => {
  if (!id || typeof id !== "string") return false;
  return UUID_REGEX.test(id);
};
