import React from 'react';
import PropTypes from 'prop-types';
// import Tooltip from 'react-tooltip-lite';
import Tooltip from '../../../../commonComponents/Tooltip/Tooltip';
import { toggleModalMessage } from '../../../../messages/modalsActionsMessages';
import TipIcon from '../../../../commonComponents/Decorative/TipIcon';

import '../../../../commonComponents/pageIcons.scss';

const openTipModal = (author, isVerified) => {
  toggleModalMessage('tip_modal', { author, isVerified }, true);
};

const Tip = ({ author, isVerified }) => (
  <a styleName="icon-wrapper" onClick={() => { openTipModal(author, isVerified); }}>
    <Tooltip
      content="Tip user with ETH"
    >
      <TipIcon />tip
    </Tooltip>
  </a>
);

Tip.propTypes = {
  author: PropTypes.string.isRequired,
  isVerified: PropTypes.bool.isRequired
};

export default Tip;
