import React from 'react';
import PropTypes from 'prop-types';

const Tip = ({ author, isVerified }) => (
  <span>
    <button>{ isVerified ? 'Tip' : 'Tip unverified' }</button>
  </span>
);

Tip.propTypes = {
  author: PropTypes.string.isRequired,
  isVerified: PropTypes.bool.isRequired,
};

export default Tip;
