import React from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import { getEtherScanLinkByNetwork } from '../../../../actions/utils';
import Tabs from '../Tabs/Tabs';

import './dashboard.scss';

const Dashboard = ({ address, accountIcon, network, balance }) => (
  <div styleName="dashboard-wrapper">
    <div styleName="account-info-wrapper">
      <img src={accountIcon} alt="Account icon" />

      <div styleName="account-info">
        {
          network !== 'unknown' &&
          <a
            styleName="address"
            href={getEtherScanLinkByNetwork(network, address)}
            target="_blank"
            rel="noopener"
          >
            { address }
          </a>
        }

        {
          network === 'unknown' &&
          <span styleName="address">{ address }</span>
        }

        <div styleName="balance">
          Balance (ETH): { balance }
        </div>
      </div>
    </div>

    <div styleName="dashboard-content">
      <Tabs />
    </div>
  </div>
);

Dashboard.propTypes = {
  address: PropTypes.string.isRequired,
  accountIcon: PropTypes.string.isRequired,
  network: PropTypes.string.isRequired,
  balance: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  address: state.account.address,
  accountIcon: state.account.accountIcon,
  network: state.user.network,
  balance: state.account.balance,
  registering: state.user.registering,
  registeringError: state.user.registeringError,
  registeringUsername: state.user.registeringUsername,
});

export default connect(Dashboard, mapStateToProps);

