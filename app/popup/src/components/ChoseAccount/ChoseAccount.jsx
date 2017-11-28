import React from 'react';
import { changeViewMessage } from '../../../../messages/permanentActionsMessages';

import './chose-account.scss';

const ChoseAccount = () => (
  <div styleName="chose-account-wrapper">
    <button onClick={() => { changeViewMessage('createAccount'); }}>Create new</button>
    <div>
      <span onClick={() => { changeViewMessage('importAccount'); }}>Import existing</span>
    </div>
  </div>
);

export default ChoseAccount;
