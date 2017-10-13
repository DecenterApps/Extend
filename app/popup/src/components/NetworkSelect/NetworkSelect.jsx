import React from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import OutsideAlerter from '../../../../commonComponents/OutsideAlerter';
import AnimatedCaret from '../AnimatedCaret/AnimatedCaret';
import { toggleDropdownMessage } from '../../../../messages/dropdownActionMessages';
import { selectedNetworkMessage } from '../../../../messages/userActionsMessages';

import './network-select.scss';

const NetworkSelect = ({ selectedNetwork, networks, dropdownVisible }) => (
  <OutsideAlerter onClickOutside={() => { toggleDropdownMessage(dropdownVisible, false); }}>
    <div styleName="network-select-wrapper">
      <div
        styleName="active-network-wrapper"
        onClick={() => { toggleDropdownMessage(dropdownVisible, !dropdownVisible); }}
        style={{ background: selectedNetwork.color }}
      >
        <span styleName="active-network-name">{ selectedNetwork.displayName }</span>
        <AnimatedCaret active={dropdownVisible} />
      </div>

      <span styleName="dropdown-wrappper">
        {
          networks.length > 0 &&
          <div styleName={`network-select-dropdown ${dropdownVisible ? 'active' : ''}`}>
            {
              networks.map((network, index) => (
                <div
                  styleName="dropdown-item"
                  key={network.name}
                  onClick={() => selectedNetworkMessage(index)}
                >
                  <span
                    styleName="dropdown-item-bar"
                    style={{ background: network.color }}
                  />
                  <span styleName="dropdown-item-text">
                    { network.name }
                  </span>
                </div>
              ))
            }
          </div>
        }
      </span>
    </div>
  </OutsideAlerter>
);

NetworkSelect.propTypes = {
  networks: PropTypes.array.isRequired,
  dropdownVisible: PropTypes.bool.isRequired,
  selectedNetwork: PropTypes.shape({
    color: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired
  }).isRequired
};

const mapStateToProps = (state) => ({
  selectedNetwork: state.user.selectedNetwork,
  networks: state.user.networks,
  dropdownVisible: state.networkDropdown.visible
});

export default connect(NetworkSelect, mapStateToProps);
