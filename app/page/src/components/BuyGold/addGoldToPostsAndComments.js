import React from 'react';
import { render } from 'react-dom';
import BuyGold from './BuyGold';

const insertGoldToPosts = () => {
  $('.sitetable.linklisting .thing .flat-list.buttons').append('<li class="extend-gold-post"></li>');
  const authors = $('.sitetable.linklisting .thing .tagline').map((i, el) => ($(el).find('.author').text()));
  const divs = document.getElementsByClassName('extend-gold-post');

  return { authors, divs };
};

const insertGoldToComments = () => {
  $(".commentarea .comment .flat-list:contains('permalink')").append('<li class="extend-gold-comment"></li>');
  const authors = $('.commentarea .comment .tagline').map((i, el) => ($(el).find('.author').text()));
  const divs = document.getElementsByClassName('extend-gold-comment');

  return { authors, divs };
};

export default () => {
  const postCollection = insertGoldToPosts();
  const commentCollection = insertGoldToComments();

  Object.keys(postCollection.divs).forEach((index) => {
    render(<BuyGold author={postCollection.authors[index]} />, postCollection.divs[index]);
  });

  Object.keys(commentCollection.divs).forEach((index) => {
    render(<BuyGold author={commentCollection.authors[index]} />, commentCollection.divs[index]);
  });
};
