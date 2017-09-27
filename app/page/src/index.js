import { Store } from 'react-chrome-redux';
import { STORE_PORT } from '../../constants/general';
import insertUpvoteDownvote from './components/UpvoteDownvote/insertUpvoteDownvote';

const proxyStore = new Store({portName: STORE_PORT});

insertUpvoteDownvote(proxyStore);

$('.flat-list.buttons').append('<li class="tip">Tip</li>');
