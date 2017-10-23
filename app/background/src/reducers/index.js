import * as userReducer from './userReducer';
import * as dropdownReducer from './dropdownReducer';
import * as formsReducer from './formsReducer';
import * as accountReducer from './accountReducer';
import * as modalsReducer from './modalsReducer';

const combinedReducers = [
  formsReducer.data,
  userReducer.data,
  dropdownReducer.data,
  accountReducer.data,
  modalsReducer.data
];

export default combinedReducers;
