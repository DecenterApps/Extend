import React from 'react';
import PropTypes from 'prop-types';
// import Tooltip from 'react-tooltip-lite';
import Tooltip from '../../../../commonComponents/Tooltip/Tooltip';
import { toggleModalMessage } from '../../../../messages/modalsActionsMessages';
import TipIcon from '../../../../commonComponents/Decorative/TipIcon';

import pageIcons from '../../../../commonComponents/pageIcons.scss';

const openTipModal = (author) => {
  toggleModalMessage('tip_modal', { author }, true);
};

const Tip = ({ author }) => (
  <a href="#" styleName="icon-wrapper" onClick={() => { openTipModal(author); }}>
    <Tooltip
      content="Tip user with ETH"
    >
      <TipIcon />tip
    </Tooltip>
  </a>
);

Tip.propTypes = {
  author: PropTypes.string.isRequired
};

export default Tip;
