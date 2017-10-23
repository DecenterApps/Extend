export const LOCK_INTERVAL = 1800000; // miliseconds
export const weiPerEth = 1000000000000000000;

export const NETWORKS = [
  {
    name: 'Main Ethereum Network',
    displayName: 'Main Network',
    url: 'https://mainnet.decenter.com',
    color: '#038789'
  },
  {
    name: 'Ropsten Test Network',
    displayName: 'Ropsten Test Net',
    url: 'https://ropsten.infura.io/nGIfOm1FglutIhKxiq6T',
    color: '#E91550'
  },
  {
    name: 'Kovan Test Network',
    displayName: 'Kovan Test Net',
    url: 'https://kovan.decenter.com',
    color: '#690496'
  },
  {
    name: 'Rinkeby Test Network',
    displayName: 'Rinkeby Test Net',
    url: 'https://rinkeby.decenter.com',
    color: '#EBB33F'
  },
  {
    name: 'Localhost 8545',
    displayName: 'Private Network',
    url: 'http://localhost:8545',
    color: '#777'
  }
];
