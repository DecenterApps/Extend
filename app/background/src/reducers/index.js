import { combineReducers } from 'redux';

import * as userReducer from './userReducer';
import * as dropdownReducer from './dropdownReducer';

export const reducersData = [
  userReducer.reducerData,
  dropdownReducer.reducerData
];

export const combinedReducer = () => combineReducers({
  [userReducer.reducerName]: userReducer.reducer,
  [dropdownReducer.reducerName]: dropdownReducer.reducer,
});
