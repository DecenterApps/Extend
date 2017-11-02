import React from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import { TABS } from '../../../../constants/general';
import { setActiveTabMessage } from '../../../../messages/userActionsMessages';
import Tips from '../Tips/Tips';

import './tabs.scss';

const Tabs = ({ activeTab }) => (
  <div>
    <ul styleName="tabs">
      {
        TABS.map((tab) => (
          <li key={tab}>
            <span
              styleName={activeTab === tab ? 'active' : ''}
              onClick={() => { setActiveTabMessage(tab); }}
            >
              { tab }
            </span>
          </li>
        ))
      }
    </ul>

    { (activeTab === 'Sent') && <Tips tipsType="sent" /> }
    { (activeTab === 'Received') && <Tips tipsType="received" /> }
  </div>
);

Tabs.propTypes = {
  activeTab: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  activeTab: state.user.activeTab
});

export default connect(Tabs, mapStateToProps);
