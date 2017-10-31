import EthereumTx from 'ethereumjs-tx';
import { getPwDerivedKey, getPrivateKey } from '../actions/accountActions';
import { encryptTokenOreclize } from '../actions/utils';
import { CHANGE_TX_STATE } from '../constants/actionTypes';
import config from './config.json';

/* STANDARD FUNCTIONS REQUIRED TO SEND TRANSACTIONS */

export const getBalanceForAddress = (web3, address) =>
  new Promise((resolve) => {
    web3.eth.getBalance(address, (err, balance) => {
      resolve(balance.toString());
    });
  });

/**
 * Gets te current block number
 *
 * @return {Promise}
 */
export const getBlockNumber = (web3) =>
  new Promise((resolve, reject) => {
    web3.eth.getBlockNumber((error, latestBlock) => {
      if (error) reject(error);

      resolve(latestBlock);
    });
  });

/**
 * Gets te current average gas price for the current network
 *
 * @return {Promise}
 */
export const getGasPrice = (web3) =>
  new Promise((resolve, reject) => {
    web3.eth.getGasPrice((error, gasPrice) => {
      if (error) reject(error);

      resolve(gasPrice);
    });
  });

/**
 * Gets the address nonce (number of outgoing transactions that happened on an address)
 *
 * @param {Object} web3
 * @param {String} address
 * @return {Promise}
 */
export const getNonceForAddress = (web3, address) =>
  new Promise((resolve, reject) => {
    web3.eth.getTransactionCount(address, (error, nonce) => {
      if (error) reject(error);

      resolve(nonce);
    });
  });

/**
 * Returns the to and data properties required for sendRawTransaction
 *
 * @param {Object} contractMethod - Function defined on the smart contract
 * @param {Array} params - smart contract function parameters
 * @return {Object}
 */
const getEncodedParams = (contractMethod, params = null) => {
  let encodedTransaction = null;
  if (!params) {
    encodedTransaction = contractMethod.request.apply(contractMethod); // eslint-disable-line
  } else {
    encodedTransaction = contractMethod.request.apply(contractMethod, params); // eslint-disable-line
  }
  return encodedTransaction.params[0];
};

/**
 * Calculates gas needed to execute a contract function
 *
 * @param {Object} web3
 * @param {Object} paramsObj - to, data, value
 * @return {Promise}
 */
const estimateGas = (web3, paramsObj) =>
  new Promise((resolve, reject) => {
    web3.eth.estimateGas(paramsObj, (err, gas) => {
      if (err) reject(err);

      resolve(gas);
    });
  });

/**
 * Gets transaction receipt for transaction hash
 *
 * @param {Object} web3
 * @param {String} txHash
 * @return {Promise}
 */
const getTransactionReceipt = (web3, txHash) =>
  new Promise((resolve) => {
    web3.eth.getTransactionReceipt(txHash, (err, result) => {
      resolve(result);
    });
  });

/**
 * Polls for Tx receipt and then dispatches action to change tx state
 *
 * @param {Function} dispatch
 * @param {Function} getState
 * @param {Null/Object} result - return value from getTransactionReceipt
 * @param {String} txHash
 * @param {Number} intervalId
 */
const handleTransactionReceipt = (dispatch, getState, result, txHash, intervalId = null) => {
  if (!result) return;
  if (intervalId) clearInterval(intervalId);

  const transactions = getState().account.transactions;
  const txIndex = transactions.findIndex((tx) => tx.hash === txHash);

  dispatch({ type: CHANGE_TX_STATE, payload: txIndex });
};

/**
 * Polls for Tx receipt and then dispatches action to change tx state
 *
 * @param {Object} web3
 * @param {Function} dispatch
 * @param {Function} getState
 * @param {String} txHash
 */
export const pollForReceipt = async (web3, dispatch, getState, txHash) => {
  const result = await getTransactionReceipt(web3, txHash);
  handleTransactionReceipt(dispatch, getState, result, txHash);

  if (result) return;

  const interval = setInterval(async () => {
    const intervalResult = await getTransactionReceipt(web3, txHash);

    handleTransactionReceipt(dispatch, getState, intervalResult, txHash, interval);
  }, 1000);
};

const sendRawTransaction = (web3, transactionParams, privateKey) =>
  new Promise((resolve, reject) => {
    const tx = new EthereumTx(transactionParams);

    tx.sign(privateKey);

    const serializedTx = `0x${tx.serialize().toString('hex')}`;

    web3.eth.sendRawTransaction(serializedTx, (error, transactionHash) => {
      if (error) reject(error);

      resolve(transactionHash);
    });
  });

export const getOraclizePrice = (contract) =>
  new Promise((resolve, reject) => {
    contract.getOraclizePrice({}, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });

/**
 * Sends raw transaction to transfer ETH to another address
 *
 * @param {Object} web3
 * @param {String} from - sender address
 * @param {String} to - receiver address
 * @param {Number} valueParam - amount of wei to send
 * @param {String} gasPriceParam - gas price in wei
 * @param {Object} ks
 * @param {String} password
 * @param {String} nonceParam
 * @return {Promise.<void>}
 */
export const transfer = (web3, from, to, valueParam, gasPriceParam, ks, password, nonceParam) =>
  new Promise(async (resolve, reject) => {
    try {
      const value = web3.toHex(valueParam);
      let gasPrice = web3.toHex(gasPriceParam);

      const pwDerivedKey = await getPwDerivedKey(ks, password);
      const privateKey = new Buffer(getPrivateKey(ks, from, pwDerivedKey), 'hex');

      const gas = web3.toHex(Math.round(await estimateGas(web3, { to, value })));
      const nonce = web3.toHex(nonceParam);

      let transactionParams = { from, to, gas, gasPrice, value, nonce };

      const txHash = await sendRawTransaction(web3, transactionParams, privateKey);
      resolve(txHash);
    } catch (err) {
      reject(err);
    }
  });

/**
 * Sends a transaction to a contract
 *
 * @param {Object} web3
 * @param {Object} contractMethod
 * @param {Object} ks
 * @param {String} from - sender address
 * @param {String} password
 * @param {Array} params
 * @param {Number|String} valueParam - amount of wei to send
 * @param {Number} gasPriceParam
 * @return {Promise.<void>}
 */
export const sendTransaction =
  async (web3, contractMethod, ks, from, password, params = null, valueParam = 0, gasPriceParam = 0) =>
    new Promise(async (resolve, reject) => {
      try {
        const value = web3.toHex(valueParam);
        let gasPrice = null;
        let gas = null;
        let encParamsData = null;
        let to = null;
        let data = null;

        const pwDerivedKey = await getPwDerivedKey(ks, password);
        const privateKey = new Buffer(getPrivateKey(ks, from, pwDerivedKey), 'hex');

        if (params !== null) {
          encParamsData = getEncodedParams(contractMethod, params);
        } else {
          encParamsData = getEncodedParams(contractMethod);
        }

        to = encParamsData.to;
        data = encParamsData.data;

        const nonce = web3.toHex(await getNonceForAddress(web3, from));

        if (gasPriceParam === 0) {
          gasPrice = web3.toHex((await getGasPrice(web3)).toString());
        } else {
          gasPrice = web3.toHex(gasPriceParam);
        }

        if (valueParam === 0 || valueParam === '0') {
          gas = await estimateGas(web3, { to, data });
        } else {
          gas = await estimateGas(web3, { to, data, value });
        }

        // Have to take in account that sometimes the default gas limit is wrong
        let gasLimit = web3.toHex(Math.round((gas *= 1.1)));
        gas = web3.toHex(Math.round(gas));

        let transactionParams = { from, to, data, gas, gasPrice, value, nonce, gasLimit };

        const txHash = await sendRawTransaction(web3, transactionParams, privateKey);
        resolve(txHash);
      } catch (err) {
        reject(err);
      }
    });

/* CONTRACT SPECIFIC FUNCTIONS */

/**
 * Initiates the createUser method on the contract
 *
 * @param {Object} contract - func contract
 * @param {Object} web3
 * @param {String} username
 * @param {String} token
 * @param {Object} ks
 * @param {String} address
 * @param {String} password
 * @param {String} gasPrice
 * @return {Promise} transaction hash once finished
 */
export const _createUser = (contract, web3, username, token, ks, address, password, gasPrice) =>
  new Promise(async (resolve, reject) => {
    try {
      const oreclizeTransactionCost = await getOraclizePrice(contract);
      const value = oreclizeTransactionCost.toString();

      const encryptedToken = await encryptTokenOreclize(token);
      const params = [web3.toHex(username), encryptedToken];

      const hash = await sendTransaction(web3, contract.createUser, ks, address, password, params, value, gasPrice);
      resolve(hash);
    } catch (err) {
      reject({ message: err });
    }
  });

export const _getTipBalance = (web3, contractMethod, from) =>
  new Promise(async (resolve, reject) => {
    try {
      let { to, data } = getEncodedParams(contractMethod);

      const nonce = await getNonceForAddress(web3, from);
      const gasPrice = (await getGasPrice(web3)).toString();
      const gas = await estimateGas(web3, { to, data });

      contractMethod.call({ to, from, data, nonce, gas, gasPrice }, (err, result) => {
        if (err) reject(err);

        resolve(web3.fromWei(result.toString()));
      });
    } catch(err) {
      reject(err);
    }
  });

export const _checkAddressVerified = (web3, contract) =>
  new Promise((resolve, reject) => {
    contract.checkAddressVerified((error, result) => {
      if (error) return reject(error);

      return resolve(result);
    });
  });

export const _checkUsernameVerified = (web3, contract, username) =>
  new Promise((resolve, reject) => {
    contract.checkUsernameVerified(username, (error, result) => {
      if (error) return reject(error);

      return resolve(result);
    });
  });

/* EVENT LISTENERS */
export const verifiedUserEvent = async (web3, contract, callback) => {
  let latestBlock = 0;

  try {
    latestBlock = await getBlockNumber(web3);
  } catch (err) {
    callback(err, null);
    return;
  }

  contract.VerifiedUser({}, { fromBlock: latestBlock, toBlock: 'latest' })
    .watch((error, event) => {
      if (error) return callback(error);

      return callback(null, event);
    });
};

export const getSentTipsFromEvent = (web3, contract, address) =>
  new Promise((resolve, reject) => {
    contract.UserTipped({ from: address }, { fromBlock: 4447379, toBlock: 'latest' })
      .get((error, result) => {
        if (error) reject(error);

        const sentTips = result.map((tx) => {
          return { to: web3.toUtf8(tx.args.username), val: web3.fromWei(tx.args.val.toString()) };
        });

        resolve(sentTips);
      });
  });

export const getReceivedTipsFromEvent = (web3, contract, hexUsername) =>
  new Promise((resolve, reject) => {
    contract.UserTipped({ to: hexUsername }, { fromBlock: 4447379, toBlock: 'latest' })
      .get((error, result) => {
        if (error) reject(error);

        const sentTips = result.map((tx) => ({
          from: web3.toUtf8(tx.args.username), val: web3.fromWei(tx.args.val.toString())
        }));

        resolve(sentTips);
      });
  });
