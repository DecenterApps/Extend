import EthereumTx from 'ethereumjs-tx';
import { getPwDerivedKey, getPrivateKey } from '../actions/accountActions';

/**
 *
 */
const getOreclizeTransactionCost = () =>
  new Promise(async (resolve, reject) => {
    try {
      const oreclizeResponse = await fetch('https://api.oraclize.it/v1/platform/info?_pretty=1');
      const oreclizeData = await oreclizeResponse.json();

      const pricePerUnit = oreclizeData.result.quotes.ETH;
      const dataSources = oreclizeData.result.pricing.datasources;
      const numOfComputationUnits = dataSources.find((dataSource) => dataSource.name === 'computation').units;
      resolve(pricePerUnit * numOfComputationUnits);
    } catch(err) {
      reject(err);
    }
  });

const encryptTokenOreclize = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const oreclizeEncryptResponse = await fetch('https://api.oraclize.it/v1/utils/encryption/encrypt', {
        method: 'post',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({ 'message': token })
      });

      const oreclizeEnecrypt = await oreclizeEncryptResponse.json();
      resolve(oreclizeEnecrypt.result);
    } catch (err) {
      reject(err);
    }
  });

const getGasPrice = (web3) =>
  new Promise((resolve, reject) => {
    web3.eth.getGasPrice((error, gasPrice) => {
      if (error) reject(error);

      resolve(gasPrice);
    });
  });

const getNonceForAddress = (web3, address) =>
  new Promise((resolve, reject) => {
    web3.eth.getTransactionCount(address, (error, nonce) => {
      if (error) reject(error);

      resolve(nonce);
    });
  });

/**
 *
 *
 * @param {Object} web3
 * @param {Object} contractMethod
 * @param {Object} ks
 * @param {String} address
 * @param {String} password
 * @param {Array} params
 * @param {Number} value - amount of wei to send
 * @return {Promise.<void>}
 */
export const sendTransaction = async (web3, contractMethod, ks, address, password, params, value = 0) => // eslint-disable-line
  new Promise(async (resolve, reject) => {
    try {
      // get private key from key store and password
      const pwDerivedKey = await getPwDerivedKey(ks, password);
      const privateKey = new Buffer(getPrivateKey(ks, address, pwDerivedKey), 'hex');

      // encode params to contract method
      let encodedTransaction = contractMethod.request.apply(contractMethod, params); // eslint-disable-line
      let encodedParams = encodedTransaction.params[0];

      // determine gas and gasPrice
      const gasPrice = await getGasPrice(web3);
      const gas = web3.eth.estimateGas({
        to: encodedParams.to,
        data: encodedParams.data
      });

      // get nonce
      const nonce = web3.toHex(await getNonceForAddress(web3, address));

      let transactionParams = {
        from: address,
        to: encodedParams.to,
        data: encodedParams.data,
        gas: web3.toHex(gas),
        gasPrice: web3.toHex(gasPrice),
        value: web3.toHex(value),
        nonce
      };

      console.log('TRANSACTION PARAMS', transactionParams);
      console.log('VALUE', value, web3.toHex(value));

      const tx = new EthereumTx(transactionParams);

      tx.sign(privateKey);

      const serializedTx = tx.serialize();

      web3.eth.sendRawTransaction(`0x${serializedTx.toString('hex')}`, (error, transactionHash) => {
        if (error) {
          console.log('SIGNED TRANSACTION ERROR', error);
          reject(error);
        }

        console.log(`transaction #${transactionHash} sent`);
        resolve(transactionHash);
      });
    } catch (err) {
      reject(err);
    }
  });

export const getBlockNumber = () =>
  new Promise((resolve, reject) => {
    window.web3.eth.getBlockNumber((error, latestBlock) => {
      if (error) {
        return reject(error);
      }

      return resolve(latestBlock);
    });
  });

export const checkIfUserVerified = (contract) =>
  new Promise((resolve, reject) => {
    contract.checkIfUserVerified((error, result) => {
      if (error) return reject({ message: error, });

      return resolve(result);
    });
  });


export const _createUser = (contract, web3, username, token, ks, address, password) =>
  new Promise(async (resolve, reject) => {
    try {
      const oreclizeTransactionCost = await getOreclizeTransactionCost();
      const value = Math.round(web3.toWei(oreclizeTransactionCost, 'ether'));
      const encryptedToken = await encryptTokenOreclize(token);
      const params = [username, encryptedToken];

      const hash = await sendTransaction(web3, contract.createUser, ks, address, password, params, value); // eslint-disable-line
      resolve(hash);
    } catch (err) {
      reject({ message: err });
    }
  });
