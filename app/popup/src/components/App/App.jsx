import React from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import Header from '../Header/Header';
import PrivacyNotice from '../PrivacyNotice/PrivacyNotice';
import CopySeed from '../CopySeed/CopySeed';
import GenerateNewPassword from '../GenerateNewPassword/GenerateNewPassword';
import Dashboard from '../Dashboard/Dashboard';
import TypeInPassword from '../TypeInPassword/TypeInPassword';
import Send from '../Send/Send';
import Withdraw from '../Withdraw/Withdraw';

import '../../../../commonComponents/general.scss';

const App = ({ acceptedNotice, generatedVault, copiedSeed, seed, password, view }) => (
  <div styleName="popup-wrapper">
    <Header view={view} password={password} copiedSeed={copiedSeed} generatedVault={generatedVault} />

    { view === 'privacyNotice' && <PrivacyNotice /> }
    { (view === 'createAccount') && !generatedVault && acceptedNotice && <GenerateNewPassword /> }
    { (view === 'copySeed') && generatedVault && !copiedSeed && <CopySeed seed={seed} /> }
    { (view === 'dashboard') && generatedVault && acceptedNotice && copiedSeed && password && <Dashboard /> }
    { (view === 'unlockAccount') && generatedVault && acceptedNotice && copiedSeed && !password && <TypeInPassword /> }
    { (view === 'send') && <Send /> }
    { (view === 'withdraw') && <Withdraw /> }
  </div>
);

App.propTypes = {
  acceptedNotice: PropTypes.bool.isRequired,
  generatedVault: PropTypes.bool.isRequired,
  copiedSeed: PropTypes.bool.isRequired,
  seed: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  view: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  acceptedNotice: state.user.acceptedNotice,
  generatedVault: state.account.created,
  password: state.account.password,
  copiedSeed: state.account.copiedSeed,
  seed: state.account.seed,
  view: state.user.view
});

export default connect(App, mapStateToProps);
