// src/common/utils/retry.util.ts

export async function retry<T>(
  fn: () => Promise<T>,
  retryCount = 3,
  delayMs = 1000,
): Promise<T> {
  let lastError: any;

  for (let attempt = 1; attempt <= retryCount; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < retryCount) {
        await new Promise((resolve) =>
          setTimeout(resolve, delayMs),
        );
      }
    }
  }

  throw lastError;
}
