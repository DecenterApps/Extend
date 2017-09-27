import contract from './config.json';

let ethPixelContract;

window.onload = () => {
  ethPixelContract = web3.eth.contract(contract.abi).at(contract.contractAddress);
};


export const getAccount = () => {
  if (!web3.eth.accounts || !web3.eth.accounts.length) return false;

  return web3.eth.accounts[0];
};

export const getBlockNumber = () =>
  new Promise((resolve, reject) => {
    web3.eth.getBlockNumber((error, latestBlock) => {
      if (error) {
        return reject(error);
      }

      return resolve(latestBlock);
    });
  });