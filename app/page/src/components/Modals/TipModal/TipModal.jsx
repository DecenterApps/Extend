import React from 'react';
import PropTypes from 'prop-types';
import ModalHeader from '../ModalHeader';
import ModalBody from '../ModalBody';
import TipForm from './TipForm';
import connect from '../../../../../customRedux/connect';
import TypeInPasswordForm from '../../../../../commonComponents/TypeInPasswordForm';

import '../../../../../commonComponents/forms.scss';

const TipModal = ({ closeModal, password }) => (
  <div>
    <ModalHeader title={password ? 'Tip' : 'Unlock account'} closeModal={closeModal} />
    <ModalBody>
      { password && <TipForm closeModal={closeModal} /> }
      { !password && <TypeInPasswordForm /> }
    </ModalBody>
  </div>
);

TipModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  password: state.account.password,
});

export default connect(TipModal, mapStateToProps);
