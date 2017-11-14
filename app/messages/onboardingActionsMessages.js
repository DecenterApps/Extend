const pm = (actionParam) => {
  let action = actionParam;
  action.handler = 'onboarding';
  chrome.runtime.sendMessage(action);
};

export const switchToNextUnverifiedStepMessage = () => { pm({ action: 'switchToNextUnverifiedStep' }); };

export const skipUnVerifiedOnboardingMessage = () => { pm({ action: 'skipUnVerifiedOnboarding' }); };
