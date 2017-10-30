import React from 'react';
import PropTypes from 'prop-types';
import { clearPasswordMessage } from '../../../../messages/accountActionMessages';

import './header.scss';

const Header = ({ view }) => (
  <div styleName="header-wrapper">
    { (view === 'privacyNotice') && <span>Privacy Notice</span> }
    { (view === 'createAccount') && <span>Create Account</span> }
    { (view === 'copySeed') && <span>Copy recovery phrase</span> }
    { (view === 'dashboard') && <span>ReddApp</span> }
    { (view === 'unlockAccount') && <span>Unlock Account</span> }
  </div>
);

Header.propTypes = {
  view: PropTypes.string.isRequired
};

export default Header;
