const DEFAULT_CONFIG = {
  DEFAULT_EVENT: {},
};

const config = { ...DEFAULT_CONFIG };

export const resetConfig = () => {
  Object.entries(DEFAULT_CONFIG).forEach(([key, value]) => {
    config[key] = value;
  });
};

export default {
  setDefaultEvent(value) {
    config.DEFAULT_EVENT = value;
  },
  getDefaultEvent() {
    return config.DEFAULT_EVENT;
  },
};
