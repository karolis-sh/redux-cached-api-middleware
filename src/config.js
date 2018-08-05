const DEFAULT_CONFIG = {
  DEFAULT_INVOKE_OPTIONS: {},
  DEFAULT_CACHE_STRATEGY: undefined,
};

const config = { ...DEFAULT_CONFIG };

export const resetConfig = () => {
  Object.entries(DEFAULT_CONFIG).forEach(([key, value]) => {
    config[key] = value;
  });
};

export default {
  set DEFAULT_INVOKE_OPTIONS(value) {
    config.DEFAULT_INVOKE_OPTIONS = value;
  },
  get DEFAULT_INVOKE_OPTIONS() {
    return config.DEFAULT_INVOKE_OPTIONS;
  },
  set DEFAULT_CACHE_STRATEGY(value) {
    config.DEFAULT_CACHE_STRATEGY = value;
  },
  get DEFAULT_CACHE_STRATEGY() {
    return config.DEFAULT_CACHE_STRATEGY;
  },
};
