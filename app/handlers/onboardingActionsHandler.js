import * as onboardingActions from '../actions/onboardingActions';

const onboardingActionsHandler = (web3, engine, contracts, getState, dispatch, funcName, payload) => {
  switch (funcName) {
    case 'switchToNextUnverifiedStep':
    case 'skipUnVerifiedOnboarding':
      return onboardingActions[funcName](dispatch);

    default:
      throw Error('Function in handler not defined', funcName);
  }
};

export default onboardingActionsHandler;