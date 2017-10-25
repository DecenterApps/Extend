import React from 'react';
import PropsTypes from 'prop-types';
import { withdrawMessage } from '../../../../messages/accountActionMessages';
import connect from '../../../../customRedux/connect';


const Withdraw = ({ withdrawing, withdrawingError, withdrawSuccessful }) => (
  <div>
    {
      withdrawingError &&
      <div>Error: {withdrawingError}</div>
    }

    <button disabled={withdrawing} onClick={withdrawMessage}>
      Withdraw
    </button>

    {
      withdrawSuccessful &&
      <div>Transaction sent to withdraw funds</div>
    }
  </div>
);

Withdraw.propTypes = {
  withdrawing: PropsTypes.bool.isRequired,
  withdrawingError: PropsTypes.string.isRequired,
  withdrawSuccessful: PropsTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
  withdrawing: state.account.withdrawing,
  withdrawingError: state.account.withdrawingError,
  withdrawSuccessful: state.account.withdrawSuccessful
});

export default connect(Withdraw, mapStateToProps);
