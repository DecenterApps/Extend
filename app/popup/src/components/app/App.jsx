import React from 'react';
import { connect } from 'react-redux';

const Popup = ({ count, address, network }) => (
  <div>
    Click Count: {count}
    <div>
      <h2>Address</h2>
      { address }
    </div>
    <div>
      <h2>Network</h2>
      { network }
    </div>
  </div>
);

Popup.defaultProps = {
  count: 0,
  address: '',
  network: ''
};

const mapStateToProps = (state) => {
  console.log(state);
  if (Object.keys(state).length === 0 && state.constructor === Object) return {};

  return {
    count: state.count,
    network: state.user.network,
    address: state.user.address,
  };
};

export default connect(mapStateToProps)(Popup);
