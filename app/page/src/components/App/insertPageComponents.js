import React from 'react';
import { render } from 'react-dom';
import { checkIfUsernameVerifiedMessage } from '../../../../messages/pageActionsMessages';
import UserVerified from '../UserVerified/UserVerified';
import Tip from '../Tip/Tip';
import BuyGold from '../BuyGold/BuyGold';

const insertComponentsToPosts = () => {
  const elem = $('.sitetable.linklisting .thing:not(.added) .flat-list.buttons');

  elem.append(`
    <li class="extend-tip-post"></li>
    <li class="extend-gold-post"></li>
    <li class="extend-verified-post"></li>
  `);

  const authors = $('.sitetable.linklisting .thing:not(.added) .tagline').map((i, e) => ($(e).find('.author').text()));
  const idElements = authors.map((key, val) => ($('.sitetable.linklisting').find(`[data-author='${val}']`)));
  const ids = idElements.map((key, val) => val.attr('id').substring(6));

  const tipDivs = elem.find('.extend-tip-post').toArray();
  const goldDivs = elem.find('.extend-gold-post').toArray();
  const verifiedDivs = elem.find('.extend-verified-post').toArray();

  authors.each((i, author) => { checkIfUsernameVerifiedMessage(author, i, 'post'); });

  $('.sitetable.linklisting .thing:not(.added)').addClass('added');

  return { tipDivs, goldDivs, verifiedDivs, authors, ids };
};

const insertComponentsToComments = () => {
  const elem = $(".commentarea .comment:not(.added) .flat-list:contains('permalink')");

  elem.append(`
    <li class="extend-tip-comment"></li>
    <li class="extend-gold-comment"></li>
    <li class="extend-verified-comment"></li>
  `);

  const authors = $('.commentarea .comment:not(.added) .tagline .author').map((i, el) => (el.textContent));
  const idElements = authors.map((key, val) => ($('.commentarea').find(`[data-author='${val}']`)));
  const ids = idElements.map((key, val) => val.attr('id').substring(6));

  const tipDivs = elem.find('.extend-tip-comment').toArray();
  const goldDivs = elem.find('.extend-gold-comment').toArray();
  const verifiedDivs = elem.find('.extend-verified-comment').toArray();

  $('.commentarea .comment:not(.added)').addClass('added');

  authors.each((i, author) => { checkIfUsernameVerifiedMessage(author, i, 'comment'); });

  return { tipDivs, goldDivs, verifiedDivs, authors, ids };
};

export default () => {
  const postDivs = insertComponentsToPosts();
  const commentDivs = insertComponentsToComments();

  const cb = (message) => {
    if (message.type !== 'checkIfUsernameVerified') return;

    const { index, isVerified, type } = message.payload;

    if (type === 'post' && postDivs.tipDivs.length > 0) {
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

    if (type === 'comment' && commentDivs.tipDivs.length > 0) {
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
  };

  chrome.runtime.onMessage.removeListener(cb);
  chrome.runtime.onMessage.addListener(cb);
};
