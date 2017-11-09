import EthereumTx from 'ethereumjs-tx';
import { getPwDerivedKey, getPrivateKey } from '../actions/accountActions';
import { CHANGE_TX_STATE } from '../constants/actionTypes';
import { GAS_LIMIT_MODIFIER } from '../constants/general';
import AbstractWatcher from '../modules/AbstractWatcher';
import AbstractPoller from '../modules/AbstractPoller';
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
export const estimateGas = (web3, paramsObj) =>
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
 */
const handleTransactionReceipt = async (web3, dispatch, getState, txHash, stopPollerFunc) => {
  const result = await getTransactionReceipt(web3, txHash);

  if (!result) return;
  stopPollerFunc();

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
export const pollForReceipt = async (web3, engine, dispatch, getState, txHash) => {
  const poller = new AbstractPoller(handleTransactionReceipt, engine, web3, dispatch, getState, txHash);
  poller.poll();
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

export const estimateGasForTx = async (web3, contractMethod, params = null, valueParam = 0) => {
  const value = web3.toHex(valueParam);
  let gas = null;
  let encParamsData = null;
  let to = null;
  let data = null;

  if (params !== null) {
    encParamsData = getEncodedParams(contractMethod, params);
  } else {
    encParamsData = getEncodedParams(contractMethod);
  }

  to = encParamsData.to;
  data = encParamsData.data;

  gas = await estimateGas(web3, { to, data, value });

  return gas;
};

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
        let gasLimit = web3.toHex(Math.round((gas *= GAS_LIMIT_MODIFIER)));
        gas = web3.toHex(Math.round(gas));

        let transactionParams = { from, to, data, gas, gasPrice, value, nonce, gasLimit };

        const txHash = await sendRawTransaction(web3, transactionParams, privateKey);
        resolve(txHash);
      } catch (err) {
        reject(err);
      }
    });

/* CONTRACT SPECIFIC FUNCTIONS */

export const _getTipBalance = (web3, contract) =>
  new Promise(async (resolve, reject) => {
    try {
      contract.checkBalance({}, (error, result) => {
        if (error) {
          reject(error);
          return;
        }

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

export const _checkIfRefundAvailable = (web3, contract, username) =>
  new Promise((resolve, reject) => {
    contract.checkIfRefundAvailable(username, (error, result) => {
      if (error) return reject(error);

      return resolve(result);
    });
  });

/* EVENT LISTENERS */
export const verifiedUserEvent = async (web3, contract, verifiedCallback, noMatchCallback) => {
  let latestBlock = 0;

  try {
    latestBlock = await getBlockNumber(web3);
  } catch (err) {
    return;
  }

  const VerifiedUser = contract.VerifiedUser({}, { fromBlock: latestBlock, toBlock: 'latest' });
  const UsernameDoesNotMatch = contract.UsernameDoesNotMatch({}, { fromBlock: latestBlock, toBlock: 'latest' });

  const verifiedUserWatcherCb = (error, event) => {
    if (error) return verifiedCallback(error);

    return verifiedCallback(null, event, VerifiedUser, UsernameDoesNotMatch);
  };

  const UsernameDoesNotMatchWatcherCb = (error, event) => {
    if (error) return noMatchCallback(error);

    return noMatchCallback(null, event, VerifiedUser, UsernameDoesNotMatch);
  };

  const VerifiedUserWatcherInstance = new AbstractWatcher(VerifiedUser, verifiedUserWatcherCb);
  const UsernameDoesNotMatchWatcherInstance = new AbstractWatcher(UsernameDoesNotMatch, UsernameDoesNotMatchWatcherCb);

  VerifiedUserWatcherInstance.watch();
  UsernameDoesNotMatchWatcherInstance.watch();
};

export const listenForRefundSuccessful = async (web3, contract, username, callback) => {
  let latestBlock = 0;

  try {
    latestBlock = await getBlockNumber(web3);
  } catch (err) {
    callback(err, null);
    return;
  }

  const RefundSuccessful = contract.RefundSuccessful({ username }, { fromBlock: latestBlock, toBlock: 'latest' });

  const RefundSuccessfulWatcherCb = (error, event) => {
    if (error) return callback(error);

    return callback(null, event, RefundSuccessful);
  };

  const RefundSuccessfulInstance = new AbstractWatcher(RefundSuccessful, RefundSuccessfulWatcherCb);

  RefundSuccessfulInstance.watch();
};

export const getTipsFromEvent = (web3, contract, address, hexUsername) =>
  new Promise((resolve, reject) => {
    contract.UserTipped([{ from: address }, { to: hexUsername }], { fromBlock: 4447379, toBlock: 'latest' })
      .get((error, result) => {
        if (error) reject(error);

        const tips = result.map((tx) => ({
          to: web3.toUtf8(tx.args.username), val: web3.fromWei(tx.args.val.toString()), from: tx.args.from
        }));

        resolve(tips.reverse());
      });
  });

export const listenForTips = async (web3, contract, dispatch, address, hexUsername, callback) => {
  try {
    const fromBlock = await getBlockNumber(web3);

    const UserTipped = contract.UserTipped([{ from: address }, { to: hexUsername }], { fromBlock, toBlock: 'latest' });

    const UserTippedWatcherCb = (error, event) => {
      if (error) {
        callback(error);
        return;
      }

      const tip = event.args;
      const to = web3.toUtf8(tip.username);
      const val = web3.fromWei(tip.val.toString());
      const from = tip.from;

      callback({ to, val, from });
    };

    const UserTippedInstance = new AbstractWatcher(UserTipped, UserTippedWatcherCb);

    UserTippedInstance.watch();
  } catch (err) {
    callback(err);
  }
};

export const getGoldFromEvent = (web3, contract, address, hexUsername) =>
  new Promise((resolve, reject) => {
    contract.GoldBought([{ from: address }, { to: hexUsername }], { fromBlock: 4447379, toBlock: 'latest' })
      .get((error, result) => {
        if (error) reject(error);

        const allGold = result.map((tx) => ({
          to: web3.toUtf8(tx.args._to),
          val: web3.fromWei(tx.args._price.toString()),
          from: tx.args._from,
          months: tx.args._months
        }));

        resolve(allGold.reverse());
      });
  });

export const listenForGold = async (web3, contract, dispatch, address, hexUsername, callback) => {
  try {
    const fromBlock = await getBlockNumber(web3);

    const GoldBought = contract.GoldBought([{ from: address }, { to: hexUsername }], { fromBlock, toBlock: 'latest' });

    const GoldBoughtdWatcherCb = (error, event) => {
      if (error) {
        callback(error);
        return;
      }

      const gold = event.args;
      const to = web3.toUtf8(gold._to);
      const val = web3.fromWei(gold._price.toString());
      const from = gold._from;
      const months = gold._months;

      callback({ to, val, from, months });
    };

    const GoldBoughtInstance = new AbstractWatcher(GoldBought, GoldBoughtdWatcherCb);

    GoldBoughtInstance.watch();
  } catch (err) {
    callback(err);
  }
};
