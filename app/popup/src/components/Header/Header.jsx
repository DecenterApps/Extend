import React from 'react';
import PropTypes from 'prop-types';
import BackIcon from '../../../../commonComponents/Decorative/BackIcon';
import OptionsDropdown from '../OptionsDropdown/OptionsDropdown';

import './header.scss';
import { changeViewMessage } from '../../../../messages/userActionsMessages';

const Header = ({ view, generatedVault, copiedSeed, password }) => (
  <div styleName="header-wrapper">
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
    { (view === 'dashboard') && <span>ReddApp</span> }
    { (view === 'unlockAccount') && <span>Unlock Account</span> }
    { (view === 'send') && <span>Send funds</span> }
    { (view === 'withdraw') && <span>Withdraw tips</span> }
    { (view === 'networkUnavailable') && <span>Network Unavailable</span> }

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
