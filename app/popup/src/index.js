import React from 'react';
import { render } from 'react-dom';
import App from './components/App/App';

chrome.runtime.connect({ name: 'popup' });

render(
  <App />, document.getElementById('app')
);
