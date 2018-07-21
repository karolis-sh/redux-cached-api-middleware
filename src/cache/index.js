import * as simple from './simple';
import * as ttl from './ttl';

export default {
  get: type => {
    switch (type) {
      case simple.type:
        return simple;
      case ttl.type:
        return ttl;
      default:
        throw new Error(`Invalid cache type - ${type}`);
    }
  },
};
