import React from 'react';
import PropTypes from 'prop-types';
import ModalHeader from '../ModalHeader';
import ModalBody from '../ModalBody';
import BuyGoldForm from './BuyGoldForm';
import connect from '../../../../../customRedux/connect';
import TypeInPasswordForm from '../../../../../commonComponents/TypeInPasswordForm';

const GoldModal = ({ closeModal, password }) => (
  <div>
    <ModalHeader title={password ? 'Buy gold' : 'Unlock account'} closeModal={closeModal} />
    <ModalBody>
      { password && <BuyGoldForm /> }
      { !password && <TypeInPasswordForm /> }
    </ModalBody>
  </div>
);

GoldModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  password: state.account.password
});

export default connect(GoldModal, mapStateToProps);
