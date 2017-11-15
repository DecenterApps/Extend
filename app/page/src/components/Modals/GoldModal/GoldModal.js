import React from 'react';
import PropTypes from 'prop-types';
import ModalHeader from '../ModalHeader';
import ModalBody from '../ModalBody';
import BuyGoldForm from './BuyGoldForm';
import connect from '../../../../../customRedux/connect';
import TypeInPasswordForm from '../../../../../commonComponents/TypeInPasswordForm';

import '../../../../../commonComponents/forms.scss';

const GoldModal = ({ closeModal, password }) => (
  <div>
    <ModalHeader title={password ? 'Buy gold' : 'Unlock account'} closeModal={closeModal} />
    <ModalBody>
      { password && <BuyGoldForm closeModal={closeModal} /> }
      { !password && <TypeInPasswordForm /> }
    </ModalBody>
  </div>
);

GoldModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  password: state.keyStore.password
});

export default connect(GoldModal, mapStateToProps);
