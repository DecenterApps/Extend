import React from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import { TABS } from '../../../../constants/general';
import { setActiveTabMessage } from '../../../../messages/userActionsMessages';
import RegisterUsername from '../RegisterUsername/RegisterUsername';
import Send from '../Send/Send';

import './tabs.scss';

const Tabs = ({ isVerified, activeTab }) => (
  <div>
    <ul styleName="tabs">
      {
        TABS.map((tab) => {
          if (tab === 'Verify' && isVerified) return false;
          if (tab === 'Withdraw' && !isVerified) return false;
          if (tab === 'Sent' && !isVerified) return false;
          if (tab === 'Received' && !isVerified) return false;
          return (
            <li key={tab}>
              <span
                styleName={activeTab === tab ? 'active' : ''}
                onClick={() => { setActiveTabMessage(tab); }}
              >
                { tab }
              </span>
            </li>
          );
        })
      }
    </ul>

    { (activeTab === 'Verify') && <RegisterUsername /> }
    { (activeTab === 'Send') && <Send /> }
  </div>
);

Tabs.propTypes = {
  isVerified: PropTypes.bool.isRequired,
  activeTab: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  isVerified: state.user.verified,
  activeTab: state.user.activeTab
});

export default connect(Tabs, mapStateToProps);
