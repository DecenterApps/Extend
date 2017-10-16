export const STORE_PORT = 'eth_extension';
export const LOCK_INTERVAL = 10000; // miliseconds

export const NETWORKS = [
  {
    name: 'Main Ethereum Network',
    displayName: 'Main Network',
    url: 'https://mainnet.infura.io/9yl24EhEjqjMG3uAR0oR',
    color: '#038789'
  },
  {
    name: 'Ropsten Test Network',
    displayName: 'Ropsten Test Net',
    url: 'https://ropsten.infura.io/9yl24EhEjqjMG3uAR0oR',
    color: '#E91550'
  },
  {
    name: 'Kovan Test Network',
    displayName: 'Kovan Test Net',
    url: 'https://kovan.infura.io/9yl24EhEjqjMG3uAR0oR',
    color: '#690496'
  },
  {
    name: 'Rinkeby Test Network',
    displayName: 'Rinkeby Test Net',
    url: 'https://ropsten.infura.io/9yl24EhEjqjMG3uAR0oR',
    color: '#EBB33F'
  },
  {
    name: 'Localhost 8545',
    displayName: 'Private Network',
    url: 'http://localhost:8545',
    color: '#777'
  }
];
