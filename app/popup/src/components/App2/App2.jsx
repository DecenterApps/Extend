import React from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import Header from '../Header/Header';
import PrivacyNotice from '../PrivacyNotice/PrivacyNotice';
import CopySeed from '../CopySeed/CopySeed';
import GenerateNewPassword from '../GenerateNewPassword/GenerateNewPassword';
import Dashboard from '../Dashboard/Dashboard';

import './app2.scss';

const App2 = ({ acceptedNotice, generatedVault, copiedSeed, seed }) => (
  <div styleName="app2">
    <Header />

    {
      !acceptedNotice && <PrivacyNotice />
    }

    {
      !generatedVault &&
      acceptedNotice &&
      <GenerateNewPassword />
    }

    {
      generatedVault &&
      !copiedSeed &&
      <CopySeed seed={seed} />
    }

    {
      generatedVault &&
      acceptedNotice &&
      copiedSeed &&
      <Dashboard />
    }
  </div>
);

App2.propTypes = {
  acceptedNotice: PropTypes.bool.isRequired,
  generatedVault: PropTypes.bool.isRequired,
  copiedSeed: PropTypes.bool.isRequired,
  seed: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  acceptedNotice: state.user.acceptedNotice,
  generatedVault: state.account.created,
  copiedSeed: state.account.copiedSeed,
  seed: state.account.seed
});

export default connect(App2, mapStateToProps);
