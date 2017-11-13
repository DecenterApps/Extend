import React from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import { getEtherScanLinkByNetwork, createRedditLink } from '../../../../actions/utils';
import { changeViewMessage } from '../../../../messages/userActionsMessages';
import Tabs from '../Tabs/Tabs';
import RegisterForm from '../RegisterForm/RegisterForm';

import './dashboard.scss';

const copyAddress = () => {
  document.getElementById('user-address').select();
  document.execCommand('copy');
};

const Dashboard = ({
  address, balance, verifiedUsername, registering, registeringError, registeringUsername
}) => (
  <div styleName="dashboard-wrapper">
    <div styleName="account-info-wrapper">
      <div styleName="small-section">
        <div styleName="small-section-title">Address</div>
        <a
          href={getEtherScanLinkByNetwork('kovan', address)}
          target="_blank"
          rel="noopener"
        >
          { address }
        </a>
        <input type="text" id="user-address" styleName="user-address" defaultValue={address} />
        <button styleName="copy" onClick={copyAddress} />
      </div>

      <div styleName="small-section">
        <div styleName="small-section-title">Username</div>
        <div>
          { !registering && !registeringError && !verifiedUsername && <span styleName="error">Not verified</span> }
          { !registering && registeringError && <span styleName="error">There was an error, try again</span> }
          { registering &&
            <span styleName="pending">
              Verifying
              <a
                href={createRedditLink(registeringUsername)}
                target="_blank"
                rel="noopener"
              >
                /u/{registeringUsername }
              </a>
            </span>
          }
          {
            verifiedUsername &&
            <span>
              <a
                href={createRedditLink(verifiedUsername)}
                target="_blank"
                rel="noopener"
              >
                /u/{verifiedUsername }
              </a>
            </span>
          }
        </div>
      </div>

      <div styleName="large-section-wrapper">
        <div styleName="large-section">
          <div styleName="large-section-title">
            Balance (ETH):
          </div>
          <div styleName="large-section-balance">
            { balance }
          </div>
          <div styleName="large-section-btn" onClick={() => { changeViewMessage('send'); }}>
            Send
          </div>
        </div>
      </div>
    </div>

    {
      !registering &&
      !verifiedUsername &&
      <div styleName="register-btn-wrapper">
        <RegisterForm />
      </div>
    }
    {
      registering && <div styleName="registering-info">Username is currently being verified. Please wait...</div>
    }
    {
      !registering &&
      verifiedUsername &&
      <Tabs />
    }
  </div>
);

Dashboard.propTypes = {
  address: PropTypes.string.isRequired,
  balance: PropTypes.string.isRequired,
  verifiedUsername: PropTypes.string.isRequired,
  registeringError: PropTypes.string.isRequired,
  registering: PropTypes.bool.isRequired,
  registeringUsername: PropTypes.string.isRequired

};

const mapStateToProps = (state) => ({
  address: state.account.address,
  balance: state.account.balance,
  verifiedUsername: state.user.verifiedUsername,
  registering: state.user.registering,
  registeringError: state.user.registeringError,
  registeringUsername: state.user.registeringUsername
});

export default connect(Dashboard, mapStateToProps);

