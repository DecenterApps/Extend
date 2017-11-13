import React from 'react';
import PropTypes from 'prop-types';
import ModalHeader from '../ModalHeader';
import ModalBody from '../ModalBody';
import BuyGoldForm from './BuyGoldForm';
import connect from '../../../../../customRedux/connect';
import TypeInPasswordForm from '../../../../../commonComponents/TypeInPasswordForm';

import '../../../../../commonComponents/forms.scss';

const GoldModal = ({ closeModal, password, buyingGoldSuccess }) => (
  <div>
    <ModalHeader title={password ? 'Buy gold' : 'Unlock account'} closeModal={closeModal} />
    <ModalBody>
      { password && <BuyGoldForm /> }
      { !password && <TypeInPasswordForm /> }

      {
        buyingGoldSuccess &&
        <div styleName="submit-success">
          Tip successfully sent to the contract.
        </div>
      }
    </ModalBody>
  </div>
);

GoldModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  buyingGoldSuccess: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  password: state.account.password,
  buyingGoldSuccess: state.user.buyingGoldSuccess
});

export default connect(GoldModal, mapStateToProps);
