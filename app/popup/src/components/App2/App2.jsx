import React from 'react';
import { createWalletMessage } from '../../../../actions/accountActionMessages';

const App2 = () => (
  <div>
    <button onClick={() => createWalletMessage()}>
      Generate wallet
    </button>
  </div>
);

export default App2;
