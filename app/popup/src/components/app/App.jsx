import React from 'react';
import { connect } from 'react-redux';
import { createUserAuthMessage } from '../../../../actions/userActions';

const Popup = ({ username, address, network, registering }) => (
  <div>
    <div>
      <h2>Address</h2>
      { address }
    </div>
    <div>
      <h2>Network</h2>
      { network }
    </div>

    {
      username &&
      <div>
        <h2>Username</h2>
        { username }
      </div>
    }

    <br />

    <button
      disabled={ registering || !network }
      onClick={ () => createUserAuthMessage() }
    >
      { registering ? 'Creating user' : 'Create User' }
    </button>
  </div>
);

Popup.defaultProps = {
  address: '',
  network: '',
  registering: false,
  username: ''
};

const mapStateToProps = (state) => {
  if (Object.keys(state).length === 0 && state.constructor === Object) return {};

  return {
    network: state.user.network,
    address: state.user.address,
    registering: state.user.registering,
    username: state.user.username
  };
};

export default connect(mapStateToProps)(Popup);
