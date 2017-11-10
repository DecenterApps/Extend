export const LOCK_INTERVAL = 1800000; // 30 minutes miliseconds
export const weiPerEth = 1000000000000000000;

export const NETWORK_URL = 'https://kovan.infura.io/9yl24EhEjqjMG3uAR0oR';

export const GAS_LIMIT_MODIFIER = 1.1;

export const VIEWS = [
  'privacyNotice', 'changePassword', 'copySeed', 'unlockAccount', 'send', 'networkUnavailable',
  'refund'
];

export const OPTIONS_DROPDOWN_ITEMS = [
  {
    id: 'app_info',
    text: 'App info'
  },
  {
    id: 'show_seed',
    text: 'Show seed'
  },
  {
    id: 'show_terms',
    text: 'Terms'
  },
  {
    id: 'lock_acc',
    text: 'Lock'
  },
];

export const TABS = [
  { slug: 'tips', name: 'Tips' },
  { slug: 'gold', name: 'Gold' }
];
