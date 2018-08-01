import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactJson from 'react-json-view';
import * as cachedApi from 'redux-cached-api-middleware';

class ResourceLoader extends React.Component {
  async componentDidMount() {
    const { callAPI } = this.props;
    callAPI();
  }

  render() {
    const { fetching, result, url } = this.props;
    return (
      <div>
        {fetching || !result ? (
          <div>
            Fetching <b>{url}</b> ...
          </div>
        ) : (
          <div>
            <div>
              <b>{url}</b> result:
            </div>
            <div className="api-response">
              <ReactJson src={result.payload} name={null} collapsed />
            </div>
          </div>
        )}
      </div>
    );
  }
}

ResourceLoader.propTypes = {
  url: PropTypes.string.isRequired,
  callAPI: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
  result: PropTypes.shape({
    error: PropTypes.bool.isRequired,
    timestamp: PropTypes.number.isRequired,
    payload: PropTypes.any,
  }),
};

ResourceLoader.defaultProps = {
  result: undefined,
};

const enhance = connect(
  (state, { cache }) => ({
    fetching: cachedApi.selectors.isFetching(state, cache.key),
    result: cachedApi.selectors.getResult(state, cache.key),
  }),
  (dispatch, { url, cache }) => ({
    dispatch,
    callAPI: () =>
      dispatch(cachedApi.actions.callAPI({ endpoint: url, cache })),
  })
);

export default enhance(ResourceLoader);
