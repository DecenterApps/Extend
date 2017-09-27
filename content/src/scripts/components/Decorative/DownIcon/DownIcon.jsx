import React from 'react';
import PropTypes from 'prop-types';

const DownIcon = ({ size }) => (
  <svg fill="#000000" height={size} viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"/>
    <path d="M0-.75h24v24H0z" fill="none"/>
  </svg>
);

DownIcon.propTypes = {
  size: PropTypes.string
};

DownIcon.defaultProps = {
  size: '18'
};

export default DownIcon;
