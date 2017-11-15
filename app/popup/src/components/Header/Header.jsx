import React from 'react';
import PropTypes from 'prop-types';
import BackIcon from '../../../../commonComponents/Decorative/BackIcon';
import Logo from '../../../../commonComponents/Decorative/Logo';
import OptionsDropdown from '../OptionsDropdown/OptionsDropdown';
import { clearRefundValuesMessage } from '../../../../messages/accountActionMessages';
import { changeViewMessage } from '../../../../messages/permanentActionsMessages';

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
        (view === 'showSeed') ||
        (view === 'showPrivacy') ||
        (view === 'showInfo')
      ) &&
      <span styleName="back" onClick={() => { changeViewMessage('dashboard'); }}>
        <BackIcon />
      </span>
    }

    {
      ((view === 'privacyNotice') ||
      (view === 'showPrivacy'))
      && <span>Terms of agreement</span>
    }
    { (view === 'createAccount') && <span>Chose passphrase</span> }
    { (view === 'copySeed') && <span>Copy recovery phrase</span> }
    { (view === 'dashboard') && <span styleName="logo-wrapper"><Logo /></span> }
    { (view === 'unlockAccount') && <span>Unlock account</span> }
    { (view === 'send') && <span>Transfer funds</span> }
    { (view === 'networkUnavailable') && <span>Network unavailable</span> }
    { (view === 'refund') && <span>Refund tip</span> }
    { (view === 'showSeed') && <span>Refund tip</span> }
    { (view === 'showPrivacy') && <span>Refund tip</span> }
    { (view === 'showInfo') && <span>Extension info</span> }
    { (view === 'showSeed') && <span>Recovery phrase</span> }

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
