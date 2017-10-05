import { combineReducers } from 'redux';

import user from './userReducer';
import dropdown from './dropdownReducer';

export default combineReducers({
  user,
  dropdown
});
