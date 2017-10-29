import React from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import { getEtherScanLinkByNetwork } from '../../../../actions/utils';
import Tabs from '../Tabs/Tabs';

import './dashboard.scss';

const Dashboard = ({ address, accountIcon, balance, verifiedUsername, tipsBalance }) => (
  <div styleName="dashboard-wrapper">
    <div styleName="account-info-wrapper">
      <img src={accountIcon} alt="Account icon" />

      <div styleName="account-info">
        <a
          styleName="address"
          href={getEtherScanLinkByNetwork('kovan', address)}
          target="_blank"
          rel="noopener"
        >
          { address }
        </a>

        <div styleName="balance">
          Balance (ETH): { balance }
        </div>
        {
          verifiedUsername &&
          <div>
            <div styleName="username">{ verifiedUsername }</div>
            <div styleName="tips">Tips (ETH): { tipsBalance }</div>
          </div>
        }
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
  balance: PropTypes.string.isRequired,
  verifiedUsername: PropTypes.string.isRequired,
  tipsBalance: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  address: state.account.address,
  accountIcon: state.account.accountIcon,
  balance: state.account.balance,
  verifiedUsername: state.user.verifiedUsername,
  tipsBalance: state.account.tipsBalance
});

export default connect(Dashboard, mapStateToProps);

