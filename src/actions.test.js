import { RSAA } from 'redux-api-middleware';
import { callAPI } from './actions';
import config, { resetConfig } from './config';

describe('callAPI', () => {
  beforeEach(() => {
    resetConfig();
  });

  it('should construct a valid action', () => {
    expect(callAPI({ types: ['REQUEST', 'SUCCESS', 'FAILURE'] })).toEqual({
      [RSAA]: {
        types: ['REQUEST', 'SUCCESS', 'FAILURE'],
      },
    });
  });

  it('should re-use default event', () => {
    config.setDefaultEvent({
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    expect(
      callAPI({ method: 'POST', types: ['REQUEST', 'SUCCESS', 'FAILURE'] })
    ).toEqual({
      [RSAA]: {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        types: ['REQUEST', 'SUCCESS', 'FAILURE'],
      },
    });
  });
});
