import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from '../../modules/react-chrome-redux/index';
import { STORE_PORT } from '../../constants/general';
import App from './components/app/App';

const proxyStore = new Store({ portName: STORE_PORT });

render(
  <Provider store={proxyStore}>
    <App />
  </Provider>, document.getElementById('app')
);
