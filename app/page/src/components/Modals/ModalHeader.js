/* eslint no-unused-vars: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import mhs from './modals.scss';

const ModalHeader = ({ closeModal, title }) => (
  <div styleName="mhs.modal-header">
    { title && <h1>{ title }</h1> }

    <span onClick={closeModal}>Close</span>
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
