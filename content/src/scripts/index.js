import {Store} from 'react-chrome-redux';
import insertUpvoteDownvote from './components/UpvoteDownvote/insertUpvoteDownvote';

const proxyStore = new Store({portName: 'example'});

insertUpvoteDownvote(proxyStore);

$('.flat-list.buttons').append('<li class="tip">Tip</li>');
