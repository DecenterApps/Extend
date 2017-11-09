import React from 'react';
import PropTypes from 'prop-types';
import SendForm from './SendForm';
import connect from '../../../../customRedux/connect';
import { getEtherScanLinkByNetwork, getEtherScanTxByNetwork
} from '../../../../actions/utils';

import send from './send.scss';
import tabs from '../Tabs/tabs.scss';

const Send = ({ transactions }) => (
  <div styleName="send.send-wrapper">
    <div styleName="send.form-wrapper">
      <SendForm />
    </div>

    <ul styleName="tabs.tabs">
      <li styleName="tabs.large-tab">
        <span styleName="tabs.tab tabs.active">
          <span styleName="tabs.tab-name">
            Transfers
          </span>
        </span>
      </li>
    </ul>

    <div styleName="send.transfers-wrapper">
      {
        transactions.length === 0 && 'You have not made any transactions yet'
      }

      {
        transactions.length > 0 &&
        transactions.map((transaction, i) => (
          <div
            key={transaction.hash}
            styleName={`send.transaction ${(transactions.length - 1) === i ? 'send.last' : ''}`}
          >
            <div styleName="send.tx-info">
              <span>Status:</span>
              <span>{ transaction.state }</span>
            </div>
            <div styleName="send.tx-info">
              <span>To:</span>
              <a
                href={getEtherScanLinkByNetwork('kovan', transaction.to)}
                target="_blank"
                rel="noopener"
              >
                { transaction.to }
              </a>
            </div>
            <div styleName="send.tx-info">
              <span>Hash:</span>
              <a
                styleName="send.hash"
                href={getEtherScanTxByNetwork('kovan', transaction.hash)}
                target="_blank"
                rel="noopener"
              >
                { transaction.hash }
              </a>
            </div>
            <div styleName="send.tx-info">
              <span>Amount:</span>
              <span>{ transaction.amount } ETH</span>
            </div>
          </div>
        ))
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
