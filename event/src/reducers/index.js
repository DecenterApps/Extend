import {combineReducers} from 'redux';

import count from './count';
import user from './userReducer';

export default combineReducers({
  count, user
});
