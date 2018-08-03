import React from 'react';
import PropTypes from 'prop-types';
import distanceInWordsStrict from 'date-fns/distance_in_words_strict';
import cx from 'classnames';

const mapCurrency = value => ({ USD: '$', EUR: '€' }[value] || value);

function CryptoCard({ data }) {
  if (data.lastSuccessPayload && data.lastSuccessPayload.success) {
    const { base, target, price, change } = data.lastSuccessPayload.ticker;
    const changeNumber = Number(change);
    return (
      <div className="inline-block border-2 border-grey rounded py-2 px-3 m-2 flex-grow">
        <h3>{base}</h3>
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
          Updated {distanceInWordsStrict(data.timestamp, new Date())} ago
        </div>
      </div>
    );
  }
  return null;
}

CryptoCard.propTypes = {
  data: PropTypes.shape({}).isRequired,
};

export default CryptoCard;
