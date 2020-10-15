import * as simple from './simple';
import * as simpleSuccess from './simpleSuccess';
import * as ttl from './ttl';
import * as ttlSuccess from './ttlSuccess';

export default {
  get: (type) => {
    switch (type) {
      case simple.type:
        return simple;
      case simpleSuccess.type:
        return simpleSuccess;
      case ttl.type:
        return ttl;
      case ttlSuccess.type:
        return ttlSuccess;
      default:
        throw new Error(`Invalid cache type - ${type}`);
    }
  },
};
