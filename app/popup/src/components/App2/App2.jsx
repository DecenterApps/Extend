import React from 'react';
import { createWalletMessage } from '../../../../messages/accountActionMessages';
import NetworkSelect from '../NetworkSelect/NetworkSelect';

import './app2.scss';

const App2 = () => (
  <div styleName="app2">
    <NetworkSelect />
    <button onClick={() => createWalletMessage()}>
      Generate wallet
    </button>
  </div>
);

export default App2;
