import React from 'react';
import PropTypes from 'prop-types';

import './tips-eth.scss';

const TipsEth = ({ val }) => (
  <span styleName="tips-eth-wrapper">
    Total tips: {val} ETH
  </span>
);

TipsEth.propTypes = {
  val: PropTypes.string.isRequired
};

export default TipsEth;
