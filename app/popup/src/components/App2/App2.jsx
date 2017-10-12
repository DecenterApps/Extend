import React from 'react';
import PropTypes from 'prop-types';
import { createWalletMessage } from '../../../../messages/accountActionMessages';
import connect from '../../../../customRedux/connect';
import Header from '../Header/Header';
import PrivacyNotice from '../PrivacyNotice/PrivacyNotice';
import Dashboard from '../Dashboard/Dashboard';
import GenerateNewPassword from '../GenerateNewPassword/GenerateNewPassword';

import './app2.scss';

// <button o nClick={() => createWalletMessage()}>
// Generate wallet
// </button>

const App2 = ({ acceptedNotice, generatedVault }) => (
  <div styleName="app2">
    <Header />

    {
      !acceptedNotice && <PrivacyNotice />
    }

    {
      acceptedNotice &&
      !generatedVault &&
      <GenerateNewPassword />
    }
  </div>
);

App2.propTypes = {
  acceptedNotice: PropTypes.bool.isRequired,
  generatedVault: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  acceptedNotice: state.user.acceptedNotice,
  generatedVault: state.user.generatedVault
});

export default connect(App2, mapStateToProps);
