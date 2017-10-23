import React from 'react';
import PropTypes from 'prop-types';
import { toggleModalMessage } from '../../../../messages/modalsActionsMessages';

const openTipModal = () => {
  toggleModalMessage('example_modal', {}, true);
};

const Tip = ({ author, isVerified }) => (
  <span>
    <button onClick={openTipModal}>{ isVerified ? 'Tip' : 'Tip unverified' }</button>
  </span>
);

Tip.propTypes = {
  author: PropTypes.string.isRequired,
  isVerified: PropTypes.bool.isRequired,
};

export default Tip;
