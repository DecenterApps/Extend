import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'react-tooltip-lite';
import { toggleModalMessage } from '../../../../messages/modalsActionsMessages';
import { GOLD_MODAL } from '../Modals/modalTypes';
import GoldIcon from '../../../../commonComponents/Decorative/GoldIcon';

import '../../../../commonComponents/pageIcons.scss';

const openGoldModal = (author) => {
  toggleModalMessage(GOLD_MODAL, { author }, true);
};

const BuyGold = ({ author }) => (
  <span styleName="icon-wrapper" onClick={() => { openGoldModal(author); }}>
    <Tooltip
      content="Give gold to user with ETH"
      useDefaultStyles
    >
      <GoldIcon />
    </Tooltip>
  </span>
);

BuyGold.propTypes = {
  author: PropTypes.string.isRequired
};

export default BuyGold;
