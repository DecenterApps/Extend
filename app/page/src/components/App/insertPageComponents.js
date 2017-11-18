import React from 'react';
import { render } from 'react-dom';
import { checkIfUsernameVerifiedMessage } from '../../../../messages/pageActionsMessages';
import UserVerified from '../UserVerified/UserVerified';
import Tip from '../Tip/Tip';
import BuyGold from '../BuyGold/BuyGold';

const insertComponentsToPosts = () => {
  $('.sitetable.linklisting .thing .flat-list.buttons').append(`
    <li class="extend-tip-post"></li>
    <li class="extend-gold-post"></li>
    <li class="extend-verified-post"></li>
   `);

  const authors = $('.sitetable.linklisting .thing .tagline').map((i, el) => ($(el).find('.author').text()));
  const idElements = authors.map((key, val) => ($('.sitetable.linklisting').find(`[data-author='${val}']`)));
  const ids = idElements.map((key, val) => val.attr('id').substring(6));

  const tipDivs = document.getElementsByClassName('extend-tip-post');
  const goldDivs = document.getElementsByClassName('extend-gold-post');
  const verifiedDivs = document.getElementsByClassName('extend-verified-post');

  authors.each((i, author) => { checkIfUsernameVerifiedMessage(author, i, 'post'); });

  return { tipDivs, goldDivs, verifiedDivs, authors, ids };
};

const insertComponentsToComments = () => {
  $(".commentarea .comment .flat-list:contains('permalink')").append(`
    <li class="extend-tip-comment"></li>
    <li class="extend-gold-comment"></li>
    <li class="extend-verified-comment"></li>
   `);

  const authors = $('.commentarea .comment .tagline .author').map((i, el) => (el.textContent));
  const idElements = authors.map((key, val) => ($('.commentarea').find(`[data-author='${val}']`)));
  const ids = idElements.map((key, val) => val.attr('id').substring(6));

  const tipDivs = document.getElementsByClassName('extend-tip-comment');
  const goldDivs = document.getElementsByClassName('extend-gold-comment');
  const verifiedDivs = document.getElementsByClassName('extend-verified-comment');

  authors.each((i, author) => { checkIfUsernameVerifiedMessage(author, i, 'comment'); });

  return { tipDivs, goldDivs, verifiedDivs, authors, ids };
};

export default () => {
  const postDivs = insertComponentsToPosts();
  const commentDivs = insertComponentsToComments();

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type !== 'checkIfUsernameVerified') return;

    const { index, isVerified, type } = message.payload;

    if (type === 'post') {
      const author = postDivs.authors[index];
      const id = postDivs.ids[index];

      if (!isVerified) {
        render(<Tip author={author} isVerified={isVerified} />, postDivs.tipDivs[index]);
        render(<BuyGold author={author} id={id} />, postDivs.goldDivs[index]);
        return;
      }

      render(<Tip author={author} isVerified={isVerified} />, postDivs.tipDivs[index]);
      render(<BuyGold author={author} id={id} />, postDivs.goldDivs[index]);
      render(<UserVerified isVerified={isVerified} />, postDivs.verifiedDivs[index]);
    }

    if (type === 'comment') {
      const author = commentDivs.authors[index];
      const id = commentDivs.ids[index];

      if (!isVerified) {
        render(<Tip author={author} isVerified={isVerified} />, commentDivs.tipDivs[index]);
        render(<BuyGold author={author} id={id} />, commentDivs.goldDivs[index]);
        return;
      }

      render(<Tip author={author} isVerified={isVerified} />, commentDivs.tipDivs[index]);
      render(<BuyGold author={author} id={id} />, commentDivs.goldDivs[index]);
      render(<UserVerified isVerified={isVerified} />, commentDivs.verifiedDivs[index]);
    }
  });
};
