import React from 'react';
import PropTypes from 'prop-types';
import customConnect from '../../../../customRedux/connect';
import OutsideAlerter from './OutsideAlerter';
import AnimatedCaret from '../AnimatedCaret/AnimatedCaret';
import { toggleDropdownMessage } from '../../../../actions/dropdownActionMessages';
import { selectedNetworkMessage } from '../../../../actions/userActionsMessages';

import './network-select.scss';

const NetworkSelect = ({ selectedNetwork, networks, dropdownVisible }) => (
  <OutsideAlerter>
    <div styleName="network-select-wrapper">
      <div styleName="active-network-wrapper">
        <span>{ selectedNetwork }</span>
        <span
          onClick={() => { toggleDropdownMessage(!dropdownVisible); }}
          role="button"
          tabIndex={0}
        >
          <AnimatedCaret active={dropdownVisible} />
        </span>
      </div>

      {
        networks.length > 0 &&
        dropdownVisible &&
        <div styleName="network-select-dropdown">
          {
            networks.map((network, index) => (
              <div
                key={network.name}
                role="button"
                tabIndex={index + 1}
                onClick={() => selectedNetworkMessage(index)}
              >
                { network.name }
              </div>
            ))
          }
        </div>
      }
    </div>
  </OutsideAlerter>
);

// NetworkSelect.defaultProps = {
//   selectedNetwork: '',
//   networks: [],
//   dropdownVisible: false
// };

NetworkSelect.propTypes = {
  selectedNetwork: PropTypes.string.isRequired,
  networks: PropTypes.array.isRequired,
  dropdownVisible: PropTypes.bool
};

const mapStateToProps = (state) => ({
  selectedNetwork: state.user.selectedNetwork.name,
  networks: state.user.networks,
  dropdownVisible: state.networkDropdown.visible
});

export default customConnect(NetworkSelect, mapStateToProps);
