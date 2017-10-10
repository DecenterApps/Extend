import { render } from 'react-dom';
import React from 'react';
import UpvoteDownvote from './UpvoteDownvote';

export default () => {
  $('.thing .midcol').after('<div class="react-testing midcol"></div>');

  const divs = document.getElementsByClassName('react-testing');

  for (let i = 0; i < divs.length; i++) {
    render(<UpvoteDownvote />, divs[i]);
  }
};
