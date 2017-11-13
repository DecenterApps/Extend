import React from 'react';
import PropTypes from 'prop-types';
import ModalHeader from '../ModalHeader';
import ModalBody from '../ModalBody';
import TipForm from './TipForm';
import connect from '../../../../../customRedux/connect';
import TypeInPasswordForm from '../../../../../commonComponents/TypeInPasswordForm';

import '../../../../../commonComponents/forms.scss';

const TipModal = ({ closeModal, password, sendingTipSuccess }) => (
  <div>
    <ModalHeader title={password ? 'Buy gold' : 'Unlock account'} closeModal={closeModal} />
    <ModalBody>
      { password && <TipForm /> }
      { !password && <TypeInPasswordForm /> }

      {
        sendingTipSuccess &&
        <div styleName="submit-success">
          Tip successfully sent to the contract.
        </div>
      }
    </ModalBody>
  </div>
);

TipModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  sendingTipSuccess: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
  password: state.account.password,
  sendingTipSuccess: state.user.sendingTipSuccess
});

export default connect(TipModal, mapStateToProps);
