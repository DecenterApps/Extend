import React from 'react';
import PropTypes from 'prop-types';
import CloseIcon from '../../../../commonComponents/Decorative/CloseIcon';

import './modals.scss';

const ModalHeader = ({ closeModal, title }) => (
  <div styleName="modal-header">
    { title && <h1>{ title }</h1> }

    <span onClick={closeModal} styleName="icon-close"><CloseIcon /></span>
  </div>
);

ModalHeader.defaultProps = {
  title: ''
};

ModalHeader.propTypes = {
  closeModal: PropTypes.func.isRequired,
  title: PropTypes.string
};

export default ModalHeader;
