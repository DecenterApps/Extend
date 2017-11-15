import * as userReducer from './userReducer';
import * as dropdownReducer from './dropdownReducer';
import * as formsReducer from './formsReducer';
import * as accountReducer from './accountReducer';
import * as modalsReducer from './modalsReducer';
import * as onboardingReducer from './onboardingReducer';
import * as keyStoreReducer from './keystoreReducer';
import * as permanentReducer from './permanentReducer';

const combinedReducers = [
  formsReducer.data,
  userReducer.data,
  dropdownReducer.data,
  accountReducer.data,
  modalsReducer.data,
  onboardingReducer.data,
  keyStoreReducer.data,
  permanentReducer.data
];

export default combinedReducers;
