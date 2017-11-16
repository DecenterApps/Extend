import React from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import Tooltip from '../../../../commonComponents/Tooltip/Tooltip';
import { getEtherScanLinkByNetwork, createRedditLink } from '../../../../actions/utils';
import { changeViewMessage } from '../../../../messages/permanentActionsMessages';
import Tabs from '../Tabs/Tabs';
import RegisterForm from '../RegisterForm/RegisterForm';
import Onboarding from '../Onboarding/Onboarding';

import './dashboard.scss';

const copyAddress = () => {
  document.getElementById('user-address').select();
  document.execCommand('copy');
};

const Dashboard = ({
  address, balance, verifiedUsername, registeringError, registeringUsername, onboardingUnVerified,
  onboardingUnVerifiedStep
}) => (
  <div styleName="dashboard-wrapper">
    <Onboarding onboardingUnVerified={onboardingUnVerified} onboardingUnVerifiedStep={onboardingUnVerifiedStep} />

    <div styleName="account-info-wrapper">
      <div styleName="small-section">
        <a
          href={getEtherScanLinkByNetwork('kovan', address)}
          target="_blank"
          rel="noopener noreferrer"
        >
          { address }
        </a>
        <input type="text" id="user-address" styleName="user-address" defaultValue={address} />
        <Tooltip
          tagName="span"
          content="Copied"
          eventOn="onClick"
          eventOff="onMouseMove"
          useDefaultStyles
        >
          <button styleName="copy" onClick={copyAddress} />
        </Tooltip>
        <div styleName="small-section-title">Address</div>
      </div>

      <div styleName="small-section">
        <div>
          {
            !registeringUsername &&
            !registeringError &&
            !verifiedUsername &&
            <span styleName="error">Not verified</span>
          }

          {
            !registeringUsername &&
            registeringError &&
            !verifiedUsername &&
            <span styleName="error">{ registeringError }</span>
          }

          { registeringUsername &&
            <span styleName="pending">
              Verifying
              <a
                href={createRedditLink(registeringUsername)}
                target="_blank"
                rel="noopener noreferrer"
              >
                /u/{registeringUsername }
              </a>
            </span>
          }

          {
            verifiedUsername &&
            <span>
              <span styleName="success">Verified</span>
              <a
                href={createRedditLink(verifiedUsername)}
                target="_blank"
                rel="noopener noreferrer"
              >
                /u/{verifiedUsername }
              </a>
            </span>
          }
        </div>
        <div styleName="small-section-title">Username</div>
      </div>

      <div styleName={`large-section-wrapper ${verifiedUsername ? '' : 'with-border'}`}>
        <div styleName="large-section">
          <div styleName="large-section-balance">
            { balance } ETH
            <div styleName="large-section-btn" onClick={() => { changeViewMessage('send'); }}>
              Transfer
            </div>
          </div>
          <div styleName="large-section-title">
            Balance
          </div>
        </div>
      </div>
    </div>

    {
      !registeringUsername &&
      !verifiedUsername &&
      <div styleName="register-btn-wrapper">
        <RegisterForm />
      </div>
    }
    {
      registeringUsername &&
      <div styleName="registering-info">Username is currently being verified. Please wait...</div>
    }
    {
      !registeringUsername &&
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
  registeringUsername: PropTypes.string.isRequired,
  onboardingUnVerified: PropTypes.bool.isRequired,
  onboardingUnVerifiedStep: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  address: state.keyStore.address,
  balance: state.account.balance,
  verifiedUsername: state.user.verifiedUsername,
  registeringError: state.user.registeringError,
  registeringUsername: state.permanent.registeringUsername,
  onboardingUnVerified: state.onboarding.onboardingUnVerified,
  onboardingUnVerifiedStep: state.onboarding.onboardingUnVerifiedStep,
});

export default connect(Dashboard, mapStateToProps);

