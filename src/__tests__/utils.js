export const validateCacheModule = item => {
  if (item) {
    const { type, buildStrategy, shouldFetch } = item;
    if (
      typeof type === 'string' &&
      typeof buildStrategy === 'function' &&
      typeof shouldFetch === 'function'
    ) {
      return undefined;
    }
  }
  throw new Error(`Invalid cache module - ${item}`);
};
