import React from 'react';
import PropTypes from 'prop-types';
import BackIcon from '../../../../commonComponents/Decorative/BackIcon';
import Logo from '../../../../commonComponents/Decorative/Logo';
import OptionsDropdown from '../OptionsDropdown/OptionsDropdown';
import { changeViewMessage } from '../../../../messages/userActionsMessages';
import { clearRefundValuesMessage } from '../../../../messages/accountActionMessages';

import './header.scss';

const Header = ({ view, generatedVault, copiedSeed, password }) => (
  <div styleName="header-wrapper">
    {

      (view === 'refund') &&
      <span styleName="back" onClick={() => { changeViewMessage('dashboard'); clearRefundValuesMessage(); }}>
        <BackIcon />
      </span>
    }

    {
      (
        (view === 'send') ||
        (view === 'withdraw')
      ) &&
      <span styleName="back" onClick={() => { changeViewMessage('dashboard'); }}>
        <BackIcon />
      </span>
    }

    { (view === 'privacyNotice') && <span>Privacy Notice</span> }
    { (view === 'createAccount') && <span>Create Account</span> }
    { (view === 'copySeed') && <span>Copy recovery phrase</span> }
    { (view === 'dashboard') && <span styleName="logo-wrapper"><Logo /></span> }
    { (view === 'unlockAccount') && <span>Unlock Account</span> }
    { (view === 'send') && <span>Send funds</span> }
    { (view === 'withdraw') && <span>Withdraw tips</span> }
    { (view === 'networkUnavailable') && <span>Network Unavailable</span> }
    { (view === 'refund') && <span>Refund tip</span> }

    {
      generatedVault &&
      copiedSeed &&
      password &&
      <OptionsDropdown />
    }
  </div>
);

Header.propTypes = {
  view: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  generatedVault: PropTypes.bool.isRequired,
  copiedSeed: PropTypes.bool.isRequired
};

export default Header;
