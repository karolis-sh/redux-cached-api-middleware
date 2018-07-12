import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactJson from 'react-json-view';

import { config, actions } from '../es';

const URL = 'https://api.github.com/users/buz-zard/repos';

export const init = () => {
  config.setDefaultEvent({
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};

class App extends React.Component {
  state = { response: undefined, fetching: true };

  async componentDidMount() {
    const { dispatch } = this.props;
    const response = await dispatch(
      actions.callAPI({
        endpoint: URL,
        types: ['REQUEST', 'SUCCESS', 'FAILURE'],
      })
    );
    this.setState({ response, fetching: false });
  }

  render() {
    const { response, fetching } = this.state;
    return (
      <div className="demo">
        <h3>redux-cached-api-middleware demo</h3>
        <div>
          {fetching ? (
            <div>
              Fetching <b>{URL}</b> ...
            </div>
          ) : (
            <div>
              <div>
                <b>GET {URL}</b> result:
              </div>
              <div className="api-response">
                <ReactJson
                  src={response}
                  name={null}
                  shouldCollapse={({ name }) => name === 'payload'}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const enhance = connect(
  null,
  dispatch => ({ dispatch })
);

export default enhance(App);
