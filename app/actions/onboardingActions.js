import { SWITCH_UNVERIFIED_STEP, SKIP_UNVERIFIED_ONBOARDING } from '../constants/actionTypes';

export const switchToNextUnverifiedStep = (dispatch) => { dispatch({ type: SWITCH_UNVERIFIED_STEP }); };

export const skipUnVerifiedOnboarding = (dispatch) => { dispatch({ type: SKIP_UNVERIFIED_ONBOARDING }); };
