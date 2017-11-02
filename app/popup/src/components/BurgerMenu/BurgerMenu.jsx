import React from 'react';
import PropTypes from 'prop-types';

import './burger-menu.scss';

const BurgerMenu = ({ active }) => (
  <div styleName={`burger-menu ${active ? 'active' : ''}`}>
    <span />
  </div>
);

BurgerMenu.propTypes = {
  active: PropTypes.bool.isRequired
};

export default BurgerMenu;
