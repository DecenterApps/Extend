import { render } from 'react-dom';
import { Provider } from 'react-redux';
import React from 'react';
import UpvoteDownvote from './UpvoteDownvote';

export default (proxyStore) => {
  $('.thing .midcol').after('<div class="react-testing midcol"></div>');

  const divs = document.getElementsByClassName('react-testing');

  for (let i = 0 ; i < divs.length; i++) {
    render(<Provider store={proxyStore}><UpvoteDownvote /></Provider>, divs[i]);
  }
};