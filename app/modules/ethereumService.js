import contractConfig from './config.json';

let contract;

window.onload = () => {
  window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  contract = window.web3.eth.contract(contractConfig.abi).at(contractConfig.contractAddress);
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

export const checkIfUserVerified = () =>
  new Promise((resolve, reject) => {
    contract.checkIfUserVerified((error, result) => {
      if (error) return reject({ message: error, });

      return resolve(result);
    });
  });


export const _createUser = (username, token, address) =>
  new Promise(async (resolve, reject) => {
    try {
      const oreclizeResponse = await fetch('https://api.oraclize.it/v1/platform/info?_pretty=1');
      const oreclizeData = await oreclizeResponse.json();
      const price = oreclizeData.result.quotes.ETH;

      const oreclizeEncryptResponse = await fetch('https://api.oraclize.it/v1/utils/encryption/encrypt', {
        method: 'post',
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify({"message": token})
      });
      const oreclizeEnecrypt = await oreclizeEncryptResponse.json();
      const encryptedToken = oreclizeEnecrypt.result;

      contract.createUser(
        username,
        encryptedToken,
        { value: web3.toWei(price, 'ether') },
        (error, result) => {
          if (error) return reject({ message: error });

          return resolve(result);
        });
    } catch (err) {
      return reject({ message: err });
    }
  });
