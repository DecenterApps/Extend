import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '../../../../commonComponents/Tooltip/Tooltip';
import { toggleModalMessage } from '../../../../messages/modalsActionsMessages';
import TipIcon from '../../../../commonComponents/Decorative/TipIcon';

import '../../../../commonComponents/pageIcons.scss';

const openTipModal = (author, isVerified, id) => {
  const type = id.substring(0, 2) === 't3' ? 'post' : 'comment';
  toggleModalMessage('tip_modal', { author, isVerified, id, type }, true);
};

const Tip = ({ author, isVerified, id }) => (
  <a styleName="icon-wrapper" onClick={() => { openTipModal(author, isVerified, id); }}>
    <Tooltip
      content="Tip user with ETH"
    >
      <TipIcon />tip
    </Tooltip>
  </a>
);

Tip.propTypes = {
  author: PropTypes.string.isRequired,
  isVerified: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired
};

export default Tip;
