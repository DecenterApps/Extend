import React from 'react';
import PropTypes from 'prop-types';
import ModalHeader from '../ModalHeader';
import ModalBody from '../ModalBody';
import TipForm from './TipForm';

const TipModal = ({ closeModal }) => (
  <div>
    <ModalHeader title={'Tip'} closeModal={closeModal} />
    <ModalBody>
      <TipForm />
    </ModalBody>
  </div>
);

TipModal.propTypes = {
  closeModal: PropTypes.func.isRequired
};

export default TipModal;
