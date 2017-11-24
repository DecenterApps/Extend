import React from 'react';
import { changeViewMessage } from '../../../../messages/permanentActionsMessages';

import './chose-account.scss';

const ChoseAccount = () => (
  <div styleName="chose-account-wrapper">
    <button onClick={() => { changeViewMessage('createAccount'); }}>Create new</button>
    <div onClick={() => { changeViewMessage('importAccount'); }}>Import existing</div>
  </div>
);

export default ChoseAccount;
