import React from 'react';
import PropTypes from 'prop-types';

import * as animatedCaret from './animated-caret.scss';

const AnimatedCaret = ({ active }) => (
  <div styleName="animated-caret-wrapper">
    <span styleName={`${active ? 'arrow active' : 'arrow'}`} />
  </div>
);

AnimatedCaret.defaultProps = {
  active: false,
};

AnimatedCaret.propTypes = {
  active: PropTypes.bool
};

export default AnimatedCaret;
