import React from 'react';
import PropTypes from 'prop-types';
import { toggleModalMessage } from '../../../../messages/modalsActionsMessages';
import { GOLD_MODAL } from '../Modals/modalTypes';

const openGoldModal = (author) => {
  toggleModalMessage(GOLD_MODAL, { author }, true);
};

const BuyGold = ({ author, isVerified }) => (
  <a onClick={() => { openGoldModal(author); }}>
    { isVerified ? 'Buy gold' : 'Buy gold unverified' }
  </a>
);

BuyGold.propTypes = {
  author: PropTypes.string.isRequired,
  isVerified: PropTypes.bool.isRequired,
};

export default BuyGold;
