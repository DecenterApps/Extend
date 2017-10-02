import { Store } from '../../modules/react-chrome-redux/index';
import { STORE_PORT } from '../../constants/general';
import insertUpvoteDownvote from './components/UpvoteDownvote/insertUpvoteDownvote';

const proxyStore = new Store({portName: STORE_PORT});

insertUpvoteDownvote(proxyStore);

$('.flat-list.buttons').append('<li class="tip">Tip</li>');
