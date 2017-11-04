export const LOCK_INTERVAL = 1800000; // miliseconds 1800000
export const weiPerEth = 1000000000000000000;

export const NETWORK_URL = 'https://kovan.decenter.com'; // https://kovan.infura.io/9yl24EhEjqjMG3uAR0oR

export const VIEWS = [
  'privacyNotice', 'changePassword', 'copySeed', 'unlockAccount', 'send', 'withdraw', 'networkUnavailable',
  'refund'
];

export const OPTIONS_DROPDOWN_ITEMS = [
  {
    id: 'lock_acc',
    text: 'locc acc'
  },
  {
    id: 'show_terms',
    text: 'show terms'
  },
  {
    id: 'show_seed',
    text: 'show seed'
  },
  {
    id: 'app_info',
    text: 'app info'
  }
];

export const TABS = [
  { slug: 'sentTips', name: 'Sent tips' },
  { slug: 'receivedTips', name: 'Received tips' },
  { slug: 'sentGold', name: 'Sent gold' },
  { slug: 'receivedGold', name: 'Received gold' }
];
