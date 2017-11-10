import React from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import OutsideAlerter from '../../../../commonComponents/OutsideAlerter';
import { toggleDropdownMessage } from '../../../../messages/dropdownActionMessages';
import { clearPasswordMessage } from '../../../../messages/accountActionMessages';
import DotsMenu from '../DotsMenu/DotsMenu';

import './options-dropdown.scss';

const OptionsDropdown = ({ optionsDropdownItems, dropdownVisible }) => (
  <OutsideAlerter onClickOutside={() => { toggleDropdownMessage(dropdownVisible, false); }}>
    <div styleName="network-select-wrapper">
      <span onClick={() => { toggleDropdownMessage(dropdownVisible, !dropdownVisible); }}>
        <DotsMenu active={dropdownVisible} />
      </span>

      <span styleName="dropdown-wrappper">
        {
          optionsDropdownItems.length > 0 &&
          <div styleName={`network-select-dropdown ${dropdownVisible ? 'active' : ''}`}>
            {
              optionsDropdownItems.map((item) => {
                let itemOnClick = null;
                if (item.id === 'lock_acc') { itemOnClick = clearPasswordMessage; }

                return (
                  <span
                    key={item + Math.random()}
                    onClick={() => { toggleDropdownMessage(dropdownVisible, false); }}
                  >
                    <div styleName="dropdown-item" onClick={itemOnClick}>
                      { item.text }
                    </div>
                  </span>
                );
              })
            }
          </div>
        }
      </span>
    </div>
  </OutsideAlerter>
);

OptionsDropdown.propTypes = {
  optionsDropdownItems: PropTypes.array.isRequired,
  dropdownVisible: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
  optionsDropdownItems: state.dropdowns.optionsDropdownItems,
  dropdownVisible: state.dropdowns.visible
});

export default connect(OptionsDropdown, mapStateToProps);
