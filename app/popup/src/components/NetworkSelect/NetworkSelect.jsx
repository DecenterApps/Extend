import React from 'react';
import PropTypes from 'prop-types';
import customConnect from '../../../../customRedux/connect';
import OutsideAlerter from '../../../../commonComponents/OutsideAlerter';
import AnimatedCaret from '../AnimatedCaret/AnimatedCaret';
import { toggleDropdownMessage } from '../../../../messages/dropdownActionMessages';
import { selectedNetworkMessage } from '../../../../messages/userActionsMessages';

import './network-select.scss';

const NetworkSelect = ({ selectedNetwork, networks, dropdownVisible }) => (
  <OutsideAlerter onClickOutside={() => { toggleDropdownMessage(false); }}>
    <div styleName="network-select-wrapper">
      <div styleName="active-network-wrapper">
        <span>{ selectedNetwork }</span>
        <span onClick={() => { toggleDropdownMessage(!dropdownVisible); }}>
          <AnimatedCaret active={dropdownVisible} />
        </span>
      </div>

      {
        networks.length > 0 &&
        dropdownVisible &&
        <div styleName="network-select-dropdown">
          {
            networks.map((network, index) => (
              <div key={network.name} onClick={() => selectedNetworkMessage(index)}>
                { network.name }
              </div>
            ))
          }
        </div>
      }
    </div>
  </OutsideAlerter>
);

NetworkSelect.propTypes = {
  selectedNetwork: PropTypes.string.isRequired,
  networks: PropTypes.array.isRequired,
  dropdownVisible: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
  selectedNetwork: state.user.selectedNetwork.name,
  networks: state.user.networks,
  dropdownVisible: state.networkDropdown.visible
});

export default customConnect(NetworkSelect, mapStateToProps);
