import React from 'react';
import PropTypes from 'prop-types';
import SendForm from './SendForm';
import connect from '../../../../customRedux/connect';

import './send.scss';

const Send = ({ transactions }) => (
  <div styleName="send-wrapper">
    <SendForm />

    <div styleName="transaction-list">
      {
        transactions.length > 0 &&
        transactions.map((transaction) => (
          <div key={transaction.hash} styleName="transaction">
            <div>{ transaction.state }</div>
            <div>Nonce: { transaction.nonce }</div>
            <div>Hash: { transaction.hash }</div>
            <div>From: { transaction.from }</div>
            <div>To: { transaction.to }</div>
          </div>
        ))
      }

      {
        transactions.length === 0 &&
        <div styleName="no-transactions">
          You have not made any transactions yet
        </div>
      }
    </div>
  </div>
);

Send.propTypes = {
  transactions: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
  transactions: state.account.transactions
});

export default connect(Send, mapStateToProps);
