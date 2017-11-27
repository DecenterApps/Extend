import React from 'react';
import PropTypes from 'prop-types';

import '../../../../commonComponents/pageIcons.scss';

const TipsEth = ({ val }) => (
  <span styleName="icon-wrapper">
    { val } Eth
  </span>
);

TipsEth.propTypes = {
  val: PropTypes.string.isRequired
};

export default TipsEth;
