import React from 'react';
import PropTypes from 'prop-types';
import distanceInWordsStrict from 'date-fns/distance_in_words_strict';
import cx from 'classnames';

const mapCurrency = value => ({ USD: '$', EUR: '€' }[value] || value);

class CryptoCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      now: Date.now(),
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => this.setState({ now: Date.now() }), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { data } = this.props;
    const { now } = this.state;

    if (data.lastSuccessPayload && data.lastSuccessPayload.success) {
      const { base, target, price, change } = data.lastSuccessPayload.ticker;
      const changeNumber = Number(change);
      return (
        <div className="inline-block border-2 border-grey rounded py-2 px-3 m-2 flex-grow">
          <h3>
            {base}{' '}
            {data.fetching && <div className="loader inline-block ml-1" />}
          </h3>
          <div className="mt-1 mb-2">
            {mapCurrency(target)}
            {price}
            <span
              className={cx('ml-3', {
                'text-green': changeNumber > 0,
                'text-red': changeNumber < 0,
                'text-grey': changeNumber === 0,
              })}
            >
              {changeNumber > 0 && '↑'}
              {changeNumber < 0 && '↓'} {mapCurrency(target)}
              {Math.abs(changeNumber)}
            </span>
          </div>
          <div className="text-grey text-xs">
            Updated {distanceInWordsStrict(data.timestamp, now)} ago
          </div>
        </div>
      );
    }
    return null;
  }
}

CryptoCard.propTypes = {
  data: PropTypes.shape({}).isRequired,
};

export default CryptoCard;
