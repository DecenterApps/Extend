import React from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import Header from '../Header/Header';
import PrivacyNotice from '../PrivacyNotice/PrivacyNotice';
import CopySeed from '../CopySeed/CopySeed';
import GenerateNewPassword from '../GenerateNewPassword/GenerateNewPassword';
import Dashboard from '../Dashboard/Dashboard';
import TypeInPassword from '../TypeInPassword/TypeInPassword';

import './app.scss';

const App = ({ acceptedNotice, generatedVault, copiedSeed, seed, password }) => (
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
      <div>
        { password && <Dashboard /> }
        { !password && <TypeInPassword /> }
      </div>
    }
  </div>
);

App.propTypes = {
  acceptedNotice: PropTypes.bool.isRequired,
  generatedVault: PropTypes.bool.isRequired,
  copiedSeed: PropTypes.bool.isRequired,
  seed: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  acceptedNotice: state.user.acceptedNotice,
  generatedVault: state.account.created,
  password: state.account.password,
  copiedSeed: state.account.copiedSeed,
  seed: state.account.seed
});

export default connect(App, mapStateToProps);
