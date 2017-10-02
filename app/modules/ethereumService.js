import contract from './config.json';

let ethPixelContract;

window.onload = () => {
  window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  ethPixelContract = window.web3.eth.contract(contract.abi).at(contract.contractAddress);
};

export const getBlockNumber = () =>
  new Promise((resolve, reject) => {
    window.web3.eth.getBlockNumber((error, latestBlock) => {
      if (error) {
        return reject(error);
      }

      return resolve(latestBlock);
    });
  });

export const createUser = () => {

};
