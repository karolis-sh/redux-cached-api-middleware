const DEFAULT_CONFIG = {
  DEFAULT_EVENT: {},
  DEFAULT_CACHE_STRATEGY: undefined,
};

const config = { ...DEFAULT_CONFIG };

export const resetConfig = () => {
  Object.entries(DEFAULT_CONFIG).forEach(([key, value]) => {
    config[key] = value;
  });
};

export default {
  set DEFAULT_EVENT(value) {
    config.DEFAULT_EVENT = value;
  },
  get DEFAULT_EVENT() {
    return config.DEFAULT_EVENT;
  },
  set DEFAULT_CACHE_STRATEGY(value) {
    config.DEFAULT_CACHE_STRATEGY = value;
  },
  get DEFAULT_CACHE_STRATEGY() {
    return config.DEFAULT_CACHE_STRATEGY;
  },
};
