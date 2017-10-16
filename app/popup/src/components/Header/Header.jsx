import React from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import NetworkSelect from '../NetworkSelect/NetworkSelect';
import { clearPasswordMessage } from '../../../../messages/accountActionMessages';

import './header.scss';

const Header = ({ password }) => (
  <div styleName="header-wrapper">
    <NetworkSelect />

    {
      password &&
      <button
        styleName="lock-account-button"
        onClick={clearPasswordMessage}
      >
        Lock account
      </button>
    }
  </div>
);

Header.propTypes = {
  password: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  password: state.account.password
});

export default connect(Header, mapStateToProps);
