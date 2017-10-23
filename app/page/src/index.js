import React from 'react';
import { render } from 'react-dom';
import ModalRoot from './components/Modals/ModalRoot';
import addTipToPostsAndComments from './components/Tip/addTipToPostsAndComments';

addTipToPostsAndComments();

const pageAppInstance = document.body.appendChild(document.createElement('div'));

render(
  <ModalRoot />, pageAppInstance
);
