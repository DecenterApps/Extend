import React from 'react';
import PropTypes from 'prop-types';

import './dots-menu.scss';

const DotsMenu = ({ active }) => (
  <div styleName={`dots-menu ${active ? 'active' : ''}`}>
    <svg width="22px" height="6px" viewBox="0 0 22 6" version="1.1">
      <desc>Created with Sketch.</desc>
      <defs />
      <g
        id="Page-1"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g id="Home" transform="translate(-459.000000, -22.000000)" stroke="#FFFFFF" fill="#FFFFFF">
          <g id="header">
            <g id="more-horizontal" transform="translate(460.000000, 23.000000)">
              <circle id="Oval" cx="10" cy="2" r="2" />
              <circle id="Oval" cx="18" cy="2" r="2" />
              <circle id="Oval" cx="2" cy="2" r="2" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  </div>
);

DotsMenu.propTypes = {
  active: PropTypes.bool.isRequired
};

export default DotsMenu;
