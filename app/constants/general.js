// Reddit app client_id
export const CLIENT_ID = 'AFH0yVxKuLUlVQ';

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

export const ONBOARDING_UNVERIFIED_STEPS = [
  {
    slug: 'intro',
    contentStyle: { top: 150 },
    hole: { width: 0, height: 0, top: 0, left: 0, }
  },
  {
    slug: 'description',
    contentStyle: { top: 50 },
    hole: { width: 0, height: 0, top: 0, left: 0, }
  },
  {
    slug: 'address',
    contentStyle: { top: 220 },
    hole: { width: 455, height: 60, top: 63, left: 20 }
  },
  {
    slug: 'component',
    contentStyle: { top: 50 },
    hole: { width: 0, height: 0, top: 0, left: 0 }
  },
  {
    slug: 'verified',
    contentStyle: { top: 205 },
    hole: { width: 455, height: 58, top: 122, left: 20 }
  },
  {
    slug: 'balance',
    contentStyle: { top: 55 },
    hole: { width: 455, height: 62, top: 179, left: 20 }
  },
  {
    slug: 'formDescription',
    contentStyle: { top: 150 },
    hole: { width: 455, height: 100, top: 266, left: 20 }
  },
  {
    slug: 'final',
    contentStyle: { top: 170 },
    hole: { width: 0, height: 0, top: 0, left: 0 }
  }
];
