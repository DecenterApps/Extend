import React from 'react';
import { render } from 'react-dom';
import { checkIfUsernameVerifiedMessage } from '../../../../messages/pageActionsMessages';
import Tip from './Tip';

export default () => {
  $('.sitetable.linklisting .thing .flat-list.buttons').append('<li class="reddapp-tip"></li>');
  const Authors = $('.sitetable.linklisting .thing .tagline').map((i, el) => ($(el).find('.author').text()));
  const divs = document.getElementsByClassName('reddapp-tip');

  Authors.each((i, author) => {
    checkIfUsernameVerifiedMessage(author, i);
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type !== 'checkIfUsernameVerified') return;

    const { username, index, isVerified } = message.payload;

    render(<Tip author={username} isVerified={isVerified} />, divs[index]);
  });
};
