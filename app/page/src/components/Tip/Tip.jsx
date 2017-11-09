import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'react-tooltip-lite';
import { toggleModalMessage } from '../../../../messages/modalsActionsMessages';
import TipIcon from '../../../../commonComponents/Decorative/TipIcon';

import '../../../../commonComponents/pageIcons.scss';

const openTipModal = (author) => {
  toggleModalMessage('tip_modal', { author }, true);
};

const Tip = ({ author }) => (
  <span styleName="icon-wrapper" onClick={() => { openTipModal(author); }}>
    <Tooltip
      content="Tip user with ETH"
      useDefaultStyles
    >
      <TipIcon />
    </Tooltip>
  </span>
);

Tip.propTypes = {
  author: PropTypes.string.isRequired
};

export default Tip;
