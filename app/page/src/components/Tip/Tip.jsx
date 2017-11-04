import React from 'react';
import PropTypes from 'prop-types';
import { toggleModalMessage } from '../../../../messages/modalsActionsMessages';

const openTipModal = (author) => {
  toggleModalMessage('tip_modal', { author }, true);
};

const Tip = ({ author, isVerified }) => (
  <a onClick={() => { openTipModal(author); }}>
    { isVerified ? 'Tip ETH' : 'Tip unverified' }
  </a>
);

Tip.propTypes = {
  author: PropTypes.string.isRequired,
  isVerified: PropTypes.bool.isRequired,
};

export default Tip;
