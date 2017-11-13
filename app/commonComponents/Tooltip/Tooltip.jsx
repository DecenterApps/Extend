import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip-lite';

import style from './tooltip.scss';

const Tooltip = ({ children, ...props }) => (
  <ReactTooltip
    {...props}
    className={style['tooltip-wrapper']}
    useDefaultStyles
  >
    {children}
  </ReactTooltip>
);

Tooltip.propTypes = {
  children: PropTypes.any,
};


Tooltip.defaultProps = {
  children: [],
};

export default Tooltip;
