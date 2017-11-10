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
              styleName={`tab ${activeTab === tab.slug ? 'active' : ''}`}
              onClick={() => { setActiveTabMessage(tab.slug); }}
            >
              <span styleName="tab-name">
                { tab.name }
              </span>
            </span>
          </li>
        ))
      }
    </ul>

    { (activeTab.slug === 'tips') && <Tips /> }
    { (activeTab.slug === 'gold') && <Gold /> }
  </div>
);

Tabs.propTypes = {
  activeTab: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  activeTab: state.user.activeTab
});

export default connect(Tabs, mapStateToProps);
