import React from 'react';
import { render } from 'react-dom';
import { checkIfUsernameVerifiedMessage } from '../../../../messages/pageActionsMessages';
import Tip from './Tip';

const insertTipToPosts = () => {
  $('.sitetable.linklisting .thing .flat-list.buttons').append('<li class="reddapp-tip-post"></li>');
  const Authors = $('.sitetable.linklisting .thing .tagline').map((i, el) => ($(el).find('.author').text()));
  const divs = document.getElementsByClassName('reddapp-tip-post');

  Authors.each((i, author) => { checkIfUsernameVerifiedMessage(author, i, 'post'); });

  return divs;
};

const insertTipToComments = () => {
  $('.commentarea .comment .flat-list').append('<li class="reddapp-tip-comment"></li>');
  const Authors = $('.commentarea .comment .tagline').map((i, el) => ($(el).find('.author').text()));
  const divs = document.getElementsByClassName('reddapp-tip-comment');

  Authors.each((i, author) => { checkIfUsernameVerifiedMessage(author, i, 'comment'); });

  return divs;
};

export default () => {
  const postElements = insertTipToPosts();
  const commentElements = insertTipToComments();

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type !== 'checkIfUsernameVerified') return;

    const { username, index, isVerified, type } = message.payload;

    if (type === 'post') {
      render(<Tip author={username} isVerified={isVerified} />, postElements[index]);
    }
    if (type === 'comment') {
      render(<Tip author={username} isVerified={isVerified} />, commentElements[index]);
    }
  });
};
