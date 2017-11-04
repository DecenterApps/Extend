import React from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import { TABS } from '../../../../constants/general';
import { setActiveTabMessage } from '../../../../messages/userActionsMessages';
import Tips from '../Tips/Tips';
import Gold from '../Gold/Gold';

import './tabs.scss';

const Tabs = ({ activeTab }) => (
  <div>
    <ul styleName="tabs">
      {
        TABS.map((tab) => (
          <li key={tab.slug}>
            <span
              styleName={activeTab === tab.slug ? 'active' : ''}
              onClick={() => { setActiveTabMessage(tab.slug); }}
            >
              { tab.name }
            </span>
          </li>
        ))
      }
    </ul>

    { (activeTab === 'sentTips') && <Tips tipsType="sent" /> }
    { (activeTab === 'receivedTips') && <Tips tipsType="received" /> }
    { (activeTab === 'sentGold') && <Gold goldType="sent" /> }
    { (activeTab === 'receivedGold') && <Gold goldType="received" /> }
  </div>
);

Tabs.propTypes = {
  activeTab: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  activeTab: state.user.activeTab
});

export default connect(Tabs, mapStateToProps);
