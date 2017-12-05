import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '../../../../commonComponents/Tooltip/Tooltip';
import { toggleModalMessage } from '../../../../messages/modalsActionsMessages';
import { GOLD_MODAL } from '../Modals/modalTypes';
import GoldIcon from '../../../../commonComponents/Decorative/GoldIcon';

import '../../../../commonComponents/pageIcons.scss';

const openGoldModal = (author, id) => {
  const type = id.substring(0, 2) === 't3' ? 'post' : 'comment';
  toggleModalMessage(GOLD_MODAL, { author, id, type }, true);
};

const BuyGold = ({ author, id }) => (
  <a styleName="icon-wrapper" onClick={() => { openGoldModal(author, id); }}>
    <Tooltip
      content="Give gold to user with ETH"
      useDefaultStyles
    >
      <GoldIcon />gold
    </Tooltip>
  </a>
);

BuyGold.propTypes = {
  author: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
};

export default BuyGold;
