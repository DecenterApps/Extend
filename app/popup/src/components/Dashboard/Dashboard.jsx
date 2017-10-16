import React from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';

const Dashboard = ({ address }) => (
  <div>
    Address: { address }
  </div>
);

Dashboard.propTypes = {
  address: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  address: state.account.address
});

export default connect(Dashboard, mapStateToProps);
