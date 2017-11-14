import React from 'react';
import PropTypes from 'prop-types';
import {
  switchToNextUnverifiedStepMessage, skipUnVerifiedOnboardingMessage
} from '../../../../messages/onboardingActionsMessages';
import { onboardingComponents } from './onboardingComponents';

import './onboarding.scss';

const Onboarding = ({ onboardingUnVerified, onboardingUnVerifiedStep }) => (
  <div styleName="onboarding-wrapper">
    {
      onboardingUnVerified &&
      <div styleName="overlay">
        <div styleName="overlay-hole" style={onboardingUnVerifiedStep.hole} />

        <div styleName="content" style={onboardingUnVerifiedStep.contentStyle}>
          { onboardingComponents[onboardingUnVerifiedStep.slug]() }
        </div>

        <div styleName="buttons-wrapper">
          <button styleName="skip-button" onClick={skipUnVerifiedOnboardingMessage}>SKIP</button>
          <button styleName="next-step-button" onClick={switchToNextUnverifiedStepMessage}>NEXT</button>
        </div>
      </div>
    }
  </div>
);

Onboarding.propTypes = {
  onboardingUnVerified: PropTypes.bool.isRequired,
  onboardingUnVerifiedStep: PropTypes.object.isRequired,
};

export default Onboarding;
