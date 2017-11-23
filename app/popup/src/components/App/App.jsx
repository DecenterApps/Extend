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
import NetworkUnavailable from '../NetworkUnavailable/NetworkUnavailable';
import Refund from '../Refund/Refund';
import ExtensionInfo from '../ExtensionInfo/ExtensionInfo';
import ChoseAccount from '../ChoseAccount/ChoseAccount';

import '../../../../commonComponents/general.scss';

const App = ({ acceptedNotice, generatedVault, copiedSeed, seed, password, view, networkActive }) => (
  <div styleName="popup-wrapper">
    <Header
      networkActive={networkActive}
      view={view}
      password={password}
      copiedSeed={copiedSeed}
      generatedVault={generatedVault}
    />

    { !networkActive && <NetworkUnavailable /> }

    { generatedVault && acceptedNotice && !password && <TypeInPassword /> }

    {
      networkActive &&
      <div>
        { view === 'privacyNotice' && <PrivacyNotice acceptedNotice={acceptedNotice} /> }
        { view === 'showPrivacy' && <PrivacyNotice acceptedNotice={acceptedNotice} /> }
        { (view === 'choseAccount') && !generatedVault && acceptedNotice && <ChoseAccount /> }
        { (view === 'createAccount') && !generatedVault && acceptedNotice && <GenerateNewPassword /> }
        { (view === 'copySeed') && generatedVault && !copiedSeed && <CopySeed copiedSeed={copiedSeed} seed={seed} /> }
        { (view === 'showSeed') && generatedVault && copiedSeed && <CopySeed copiedSeed={copiedSeed} seed={seed} /> }
        { (view === 'dashboard') && generatedVault && acceptedNotice && copiedSeed && password && <Dashboard /> }
        { (view === 'send') && <Send /> }
        { (view === 'refund') && <Refund /> }
        { (view === 'showInfo') && <ExtensionInfo /> }
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
  view: PropTypes.string.isRequired,
  networkActive: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
  acceptedNotice: state.permanent.acceptedNotice,
  generatedVault: state.keyStore.created,
  password: state.keyStore.password,
  copiedSeed: state.permanent.copiedSeed,
  seed: state.keyStore.seed,
  view: state.permanent.view,
  networkActive: state.user.networkActive
});

export default connect(App, mapStateToProps);
