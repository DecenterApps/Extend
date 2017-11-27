/**
 * Adds event listeners to "load more comments" buttons in order to add
 * page components to new comments that are going to rendered
 *
 * @param {Function} insertPageComponents
 */
const addEventListenersToMoreComments = (insertPageComponents) => {
  $('.morecomments').each((key, val) => {
    const elem = $(val);

    if (elem.hasClass('listening')) return;

    elem.addClass('listening');

    elem.on('DOMNodeRemovedFromDocument', () => {
      addEventListenersToMoreComments(insertPageComponents);
      //  slight delay for page components to render
      setTimeout(() => { insertPageComponents(); }, 500);
    });
  });
};

export default addEventListenersToMoreComments;
