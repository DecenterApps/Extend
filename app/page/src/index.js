import React from 'react';
import { render } from 'react-dom';
import App from './components/App/App';

const id = Math.random().toString(36).substring(2);

const pageApp = document.createElement('div');
pageApp.id = id;
const pageAppInstance = document.body.appendChild(pageApp);

render(
  <App id={id} />, pageAppInstance
);
