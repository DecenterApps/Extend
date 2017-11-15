import React from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
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
  address, balance, verifiedUsername, registering, registeringError, registeringUsername, onboardingUnVerified,
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
        <button styleName="copy" onClick={copyAddress} />
        <div styleName="small-section-title">Address</div>
      </div>

      <div styleName="small-section">
        <div>
          { !registering && !registeringError && !verifiedUsername && <span styleName="error">Not verified</span> }
          { !registering && registeringError && <span styleName="error">There was an error, try again</span> }
          { registering &&
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
  registeringUsername: PropTypes.string.isRequired,
  onboardingUnVerified: PropTypes.bool.isRequired,
  onboardingUnVerifiedStep: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  address: state.keyStore.address,
  balance: state.account.balance,
  verifiedUsername: state.permanent.verifiedUsername,
  registering: state.permanent.registering,
  registeringError: state.permanent.registeringError,
  registeringUsername: state.permanent.registeringUsername,
  onboardingUnVerified: state.onboarding.onboardingUnVerified,
  onboardingUnVerifiedStep: state.onboarding.onboardingUnVerifiedStep,
});

export default connect(Dashboard, mapStateToProps);

