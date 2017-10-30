import React from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import OutsideAlerter from '../../../../commonComponents/OutsideAlerter';
import { toggleDropdownMessage } from '../../../../messages/dropdownActionMessages';
import { clearPasswordMessage } from '../../../../messages/accountActionMessages';
import BurgerMenu from '../BurgerMenu/BurgerMenu';

import './options-dropdown.scss';

const OptionsDropdown = ({ optionsDropdownItems, dropdownVisible }) => (
  <OutsideAlerter onClickOutside={() => { toggleDropdownMessage(dropdownVisible, false); }}>
    <div styleName="network-select-wrapper">
      <span onClick={() => { toggleDropdownMessage(dropdownVisible, !dropdownVisible); }}>
        <BurgerMenu active={dropdownVisible} />
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
                  <div
                    styleName="dropdown-item"
                    onClick={itemOnClick}
                    key={item + Math.random()}
                  >
                    { item.text }
                  </div>
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
