/**
 * @file asyncUtils.ts
 * @description Safe asynchronous execution wrapper utilities for handling promises without try-catch bloat.
 */

export type SafeAsyncResult<T> = [Error, null] | [null, T];

/**
 * Wraps a promise execution into a safe tuple result [error, data].
 * @param promise Target asynchronous promise
 */
export const toSafeAsync = async <T>(promise: Promise<T>): Promise<SafeAsyncResult<T>> => {
  try {
    const data = await promise;
    return [null, data];
  } catch (error) {
    return [error instanceof Error ? error : new Error(String(error)), null];
  }
};
