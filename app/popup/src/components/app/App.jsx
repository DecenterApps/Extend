import React from 'react';
import { connect } from 'react-redux';
import { createUserAuth } from '../../../../actions/userActions';

const Popup = ({ username, address, network, $createUserAuth, registering }) => (
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
      onClick={ () => $createUserAuth(address) }
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

const mapDispatchToProps = (dispatch) => {
  return {
    $createUserAuth: (address) => {
      createUserAuth(address, dispatch)
    },
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Popup);
