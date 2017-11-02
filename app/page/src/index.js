import React from 'react';
import { render } from 'react-dom';
import App from './components/App/App';

const pageAppInstance = document.body.appendChild(document.createElement('div'));

render(
  <App />, pageAppInstance
);
