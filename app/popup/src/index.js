import React from 'react';
import {render} from 'react-dom';
import { STORE_PORT } from '../../constants/general';

import App from './components/app/App';

import {Store} from 'react-chrome-redux';
import {Provider} from 'react-redux';

const proxyStore = new Store({ portName: STORE_PORT });

console.log('PROXY STORE', 'TEST');

render(
    <Provider store={proxyStore}>
      <App />
    </Provider>, document.getElementById('app'));
