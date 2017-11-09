import React from 'react';
import { render } from 'react-dom';
import Tip from './Tip';

const insertTipToPosts = () => {
  $('.sitetable.linklisting .thing .flat-list.buttons').append('<li class="extend-tip-post"></li>');
  const authors = $('.sitetable.linklisting .thing .tagline').map((i, el) => ($(el).find('.author').text()));
  const divs = document.getElementsByClassName('extend-tip-post');

  return { authors, divs };
};

const insertTipToComments = () => {
  $(".commentarea .comment .flat-list:contains('permalink')").append('<li class="extend-tip-comment"></li>');
  const authors = $('.commentarea .comment .tagline').map((i, el) => ($(el).find('.author').text()));
  const divs = document.getElementsByClassName('extend-tip-comment');

  return { divs, authors };
};

export default () => {
  const postCollection = insertTipToPosts();
  const commentCollection = insertTipToComments();

  Object.keys(postCollection.divs).forEach((index) => {
    render(<Tip author={postCollection.authors[index]} />, postCollection.divs[index]);
  });

  Object.keys(commentCollection.divs).forEach((index) => {
    render(<Tip author={commentCollection.authors[index]} />, commentCollection.divs[index]);
  });
};
