import { render } from 'react-dom';
import React from 'react';
import Tip from './Tip';

export default () => {
  $('.sitetable.linklisting .thing .flat-list.buttons').append('<li class="reddapp-tip"></li>');
  const Authors = $('.sitetable.linklisting .thing .tagline').map((i, el) => ($(el).find('.author').text()));

  console.log('Authors', Authors);

  const divs = document.getElementsByClassName('reddapp-tip');

  for (let i = 0; i < divs.length; i++) {
    render(<Tip />, divs[i]);
  }
};
