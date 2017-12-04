import React from 'react';
import PropTypes from 'prop-types';

const ComponentMonths = ({ months }) => (
  <span>
    { months } { months === 1 ? 'Month' : 'Months' }
  </span>
);

ComponentMonths.propTypes = {
  months: PropTypes.number.isRequired
};

export default ComponentMonths;
