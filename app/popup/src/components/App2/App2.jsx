import React from 'react';
import { createWalletMessage } from '../../../../actions/accountActionMessages';
import NetworkSelect from '../NetworkSelect/NetworkSelect';

const App2 = () => (
  <div>
    <NetworkSelect />
    <button onClick={() => createWalletMessage()}>
      Generate wallet
    </button>
  </div>
);

export default App2;
