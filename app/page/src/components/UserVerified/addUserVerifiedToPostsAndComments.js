import React from 'react';
import { render } from 'react-dom';
import { checkIfUsernameVerifiedMessage } from '../../../../messages/pageActionsMessages';
import UserVerified from './UserVerified';

const insertUserVerifiedToPosts = () => {
  $('.sitetable.linklisting .thing .flat-list.buttons').append('<li class="extend-verified-post"></li>');
  const authors = $('.sitetable.linklisting .thing .tagline').map((i, el) => ($(el).find('.author').text()));
  const divs = document.getElementsByClassName('extend-verified-post');

  authors.each((i, author) => { checkIfUsernameVerifiedMessage(author, i, 'post'); });

  return divs;
};

const insertUserVerifiedToComments = () => {
  $(".commentarea .comment .flat-list:contains('permalink')").append('<li class="extend-verified-comment"></li>');
  const authors = $('.commentarea .comment .tagline')
    .map((i, el) => ($(el).find('.author').text()));
  const divs = document.getElementsByClassName('extend-verified-comment');

  authors.each((i, author) => { checkIfUsernameVerifiedMessage(author, i, 'comment'); });

  return divs;
};

export default () => {
  const postElements = insertUserVerifiedToPosts();
  const commentElements = insertUserVerifiedToComments();

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type !== 'checkIfUsernameVerified') return;

    const { index, isVerified, type } = message.payload;

    if (type === 'post') {
      render(<UserVerified isVerified={isVerified} />, postElements[index]);
    }
    if (type === 'comment') {
      render(<UserVerified isVerified={isVerified} />, commentElements[index]);
    }
  });
};
