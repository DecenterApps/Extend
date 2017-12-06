import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import Tooltip from '../../../../commonComponents/Tooltip/Tooltip';

import './comonent-months.scss';

class ComponentMonths extends Component {
  componentDidMount() {
    $(findDOMNode(this.wrapper)).append(this.props.iconElem); // eslint-disable-line
  }

  render() {
    return (
      <span styleName="gold-icon-wrapper">
        <Tooltip
          content={`
            ${this.props.months} ${this.props.months === 1 ? 'month' : 'months'}
            worth of gold bought with ETH via ΞXTΞND
          `}
          useDefaultStyles
        >
          <div ref={(c) => { this.wrapper = c; }} />
        </Tooltip>
      </span>
    );
  }
}

ComponentMonths.propTypes = {
  months: PropTypes.number.isRequired,
  iconElem: PropTypes.any.isRequired
};

export default ComponentMonths;
