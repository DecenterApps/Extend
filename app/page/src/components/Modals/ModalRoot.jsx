import React from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import modalTypes from './modalTypes';
import connect from '../../../../customRedux/connect';
import { toggleModalMessage } from '../../../../messages/modalsActionsMessages';

const closeModal = () => { toggleModalMessage('', {}, false); };

const ModalRoot = ({ SpecificModal, modalProps, modalType, modalOpen }) => (
  <Modal modalOpen={modalOpen} closeModal={closeModal}>
    {
      SpecificModal ?
        <SpecificModal
          closeModal={closeModal}
          modalType={modalType}
          {...modalProps}
        /> : null
    }
  </Modal>
);

ModalRoot.defaultProps = {
  SpecificModal: null
};

ModalRoot.propTypes = {
  modalProps: PropTypes.object.isRequired,
  modalType: PropTypes.string.isRequired,
  modalOpen: PropTypes.bool.isRequired,
  SpecificModal: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func
  ])
};

const mapStateToProps = (state) => ({
  modalProps: state.modals.modalProps,
  modalOpen: state.modals.modalType.length > 0,
  SpecificModal: modalTypes[state.modals.modalType],
  modalType: state.modals.modalType
});

export default connect(ModalRoot, mapStateToProps);
