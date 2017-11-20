import { ONBOARDING_UNVERIFIED_STEPS } from '../../../constants/general';
import { SWITCH_UNVERIFIED_STEP, SKIP_UNVERIFIED_ONBOARDING } from '../../../constants/actionTypes';

const reducerName = 'onboarding';

const INITIAL_STATE = {
  onboardingUnVerified: true,
  onboardingUnVerifiedStep: ONBOARDING_UNVERIFIED_STEPS[0],
  onboardingUnVerifiedIndex: 0
};

export const reducer = (state, action) => {
  switch (action.type) {
    case SWITCH_UNVERIFIED_STEP: {
      const nextStepIndex = state.onboardingUnVerifiedIndex + 1;

      if (nextStepIndex === ONBOARDING_UNVERIFIED_STEPS.length) {
        return { ...state, onboardingUnVerified: false };
      }

      return {
        ...state,
        onboardingUnVerifiedStep: ONBOARDING_UNVERIFIED_STEPS[nextStepIndex],
        onboardingUnVerifiedIndex: nextStepIndex
      };
    }

    case SKIP_UNVERIFIED_ONBOARDING:
      return { ...state, onboardingUnVerified: false };

    default:
      return false;
  }
};

export const data = {
  name: reducerName,
  initialState: INITIAL_STATE,
  handle: reducer,
  async: true
};
