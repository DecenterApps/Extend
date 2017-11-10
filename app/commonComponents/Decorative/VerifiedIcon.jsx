/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';

const VerifiedIcon = ({ isVerified }) => (
  <svg
    width="1.5em"
    height="1.5em"
    viewBox="0 0 14 11"
    version="1.1"
  >
    <defs />
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
      <g id="Reddit-buttons" transform="translate(-324.000000, -91.000000)" strokeWidth="2" stroke={ isVerified ? '#FF791A' : '#888888' }>
        <polyline id="reg-user-icon" points="337 92 328.75 100.25 325 96.5" />
      </g>
    </g>
  </svg>
);

VerifiedIcon.propTypes = {
  isVerified: PropTypes.bool.isRequired
};

export default VerifiedIcon;
