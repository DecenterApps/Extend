import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createUserAuthMessage } from '../../../../actions/userActionsMessages';

const Popup = ({ username, address, network, registering, verified }) => (
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

    {
      verified &&
      <div><br /> Reddit user associeted to current address is verified</div>
    }

    {
      !verified &&
      <button
        disabled={registering || !network}
        onClick={() => createUserAuthMessage()}
      >
        <br />
        {registering ? 'Creating user' : 'Create User'}
      </button>
    }
  </div>
);

Popup.defaultProps = {
  address: '',
  network: '',
  registering: false,
  username: '',
  verified: false,
};

Popup.propTypes = {
  address: PropTypes.string,
  network: PropTypes.string,
  registering: PropTypes.bool,
  username: PropTypes.string,
  verified: PropTypes.bool,
};

const mapStateToProps = (state) => {
  if (Object.keys(state).length === 0 && state.constructor === Object) return {};

  console.log('POPUP STATE', state);
  return {
    network: state.user.network,
    address: state.user.address,
    registering: state.user.registering,
    username: state.user.username,
    verified: state.user.verified
  };
};

export default connect(mapStateToProps)(Popup);
