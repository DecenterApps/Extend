import { SWITCH_UNVERIFIED_STEP, SKIP_UNVERIFIED_ONBOARDING } from '../constants/actionTypes';

/**
 * Dispatches action to switch to the next onboarding step
 *
 * @param {Function} dispatch
 */
export const switchToNextUnverifiedStep = (dispatch) => { dispatch({ type: SWITCH_UNVERIFIED_STEP }); };

/**
 * Dispatches action to end the onboarding process
 *
 * @param {Function} dispatch
 * @return {Promise}
 */
export const skipUnVerifiedOnboarding = (dispatch) =>
  new Promise(async (resolve) => {
    await dispatch({ type: SKIP_UNVERIFIED_ONBOARDING });
    resolve();
  });
