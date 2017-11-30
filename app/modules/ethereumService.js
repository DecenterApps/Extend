import EthereumTx from 'ethereumjs-tx';
import { getPwDerivedKey, getPrivateKey } from '../actions/keyStoreActions';
import { GAS_LIMIT_MODIFIER } from '../constants/general';
import AbstractWatcher from '../modules/AbstractWatcher';
import { CONTRACTS } from '../constants/config';
import { formatLargeNumber } from '../actions/utils';

/* STANDARD FUNCTIONS REQUIRED TO SEND TRANSACTIONS */
/**
 * Gets balance for an address
 *
 * @param {Object} web3
 * @param {String} address
 * @return {Promise}
 */
export const getBalanceForAddress = (web3, address) =>
  new Promise((resolve) => {
    web3.eth.getBalance(address, (err, balance) => {
      resolve(balance.toString());
    });
  });

/**
 * Gets the current block number
 *
 * @param {Object} web3
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
 * Gets the current block
 *
 * @param {Object} web3
 * @param {Number} blockNum
 * @return {Promise}
 */
export const getBlock = (web3, blockNum) =>
  new Promise((resolve, reject) => {
    web3.eth.getBlock(blockNum, (error, latestBlock) => {
      if (error) reject(error);

      resolve(latestBlock);
    });
  });

/**
 * Gets te current average gas price for the current network
 *
 * @param {Object} web3
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
 * Returns the "to" and "data" properties required for sendRawTransaction
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
 * Sends raw transaction based on a tx params and private key
 *
 * @param {Object} web3
 * @param {Object} transactionParams
 * @param {String} privateKey
 * @return {Promise}
 */
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

/**
 * Sends raw transaction to transfer ETH from the users address to another specified address
 *
 * @param {Object} web3
 * @param {String} from - sender address
 * @param {String} to - receiver address
 * @param {Number} valueParam - amount of wei to send
 * @param {String} gasPriceParam - gas price in wei
 * @param {Object} ks
 * @param {String} password
 * @param {String} nonceParam
 * @return {Promise}
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
 * Estimates gas for transaction
 *
 * @param {Object} web3
 * @param {Object} contractMethod
 * @param {Array} params
 * @param {Number} valueParam - amount of wei to send
 * @return {Number} gas
 */
export const estimateGasForTx = async (web3, contractMethod, params = null, valueParam = 0) => {
  const value = web3.toHex(valueParam);

  let encParamsData = null;

  if (params !== null) {
    encParamsData = getEncodedParams(contractMethod, params);
  } else {
    encParamsData = getEncodedParams(contractMethod);
  }

  const to = encParamsData.to;
  const data = encParamsData.data;

  const gas = await estimateGas(web3, { to, data, value });

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

        const pwDerivedKey = await getPwDerivedKey(ks, password);
        const privateKey = new Buffer(getPrivateKey(ks, from, pwDerivedKey), 'hex');

        if (params !== null) {
          encParamsData = getEncodedParams(contractMethod, params);
        } else {
          encParamsData = getEncodedParams(contractMethod);
        }

        const to = encParamsData.to;
        const data = encParamsData.data;

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
/**
 * Gets the oreclize verification cost in wei
 *
 * @return {Promise}
 */
export const _getOraclizePrice = (contract) =>
  new Promise((resolve, reject) => {
    contract.getOraclizePrice({}, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });

/**
 * Checks if the users address is verified
 *
 * @param {Object} web3
 * @param {Object} contract
 * @return {Promise}
 */
export const _checkAddressVerified = (web3, contract) =>
  new Promise((resolve, reject) => {
    contract.checkAddressVerified((error, result) => {
      if (error) return reject(error);

      return resolve(result);
    });
  });

/**
 * Checks if a certain username is verified
 *
 * @param {Object} web3
 * @param {Object} contract
 * @param {String} username
 * @return {Promise}
 */
export const _checkUsernameVerified = (web3, contract, username) =>
  new Promise((resolve, reject) => {
    contract.checkUsernameVerified(web3.toHex(username), (error, result) => {
      if (error) return reject(error);

      return resolve(result);
    });
  });

/**
 * Gets a username for a scpecific address. Will return an empty address if the provided
 * is not verified
 *
 * @param {Object} web3
 * @param {Object} contract
 * @param {String} address
 * @return {Promise}
 */
export const _getUsernameForAddress = (web3, contract, address) =>
  new Promise((resolve, reject) => {
    contract.getUsernameForAddress(address, (error, result) => {
      if (error) return reject(error);

      return resolve(result);
    });
  });

/**
 * Checks if a certain username has not been verified in 2 weeks
 *
 * @param {Object} web3
 * @param {Object} contract
 * @param {String} username
 * @return {Promise}
 */
export const _checkIfRefundAvailable = (web3, contract, username) =>
  new Promise((resolve, reject) => {
    contract.checkIfRefundAvailable(username, (error, result) => {
      if (error) return reject(error);

      return resolve(result);
    });
  });

/**
 * Checks if the current users address was verified on the old contract
 *
 * @param {Object} web3
 * @param {Object} contract
 * @return {Promise}
 */
export const _checkIfOldUser = (web3, contract) =>
  new Promise((resolve, reject) => {
    contract.checkIfOldUser({}, (error, result) => {
      if (error) return reject(error);

      return resolve(result);
    });
  });

/* FUNCTIONS THAT GET DATA/LISTEN FROM/TO EVENTS */
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

export const getTipsFromEvent = (web3, contracts, address, hexUsername) =>
  new Promise((resolve, reject) => {
    contracts.events.UserTipped(
      [{ from: address }, { to: hexUsername }],
      { fromBlock: CONTRACTS.events.startingBlock, toBlock: 'latest' })
      .get(async (error, result) => {
        if (error) reject(error);

        const tips = await Promise.all(result.map(async (tx) => {
          const username = web3.toUtf8(await _getUsernameForAddress(web3, contracts.func, tx.args.from));

          return {
            to: web3.toUtf8(tx.args.username),
            val: web3.fromWei(tx.args.val.toString()),
            from: username || tx.args.from,
            block: tx.blockNumber
          };
        }));

        resolve(tips.reverse());
      });
  });

export const listenForTips = async (web3, contracts, dispatch, address, hexUsername, callback) => {
  try {
    const fromBlock = await getBlockNumber(web3);

    const UserTipped =
      contracts.events.UserTipped([{ from: address }, { to: hexUsername }], { fromBlock, toBlock: 'latest' });

    const UserTippedWatcherCb = async (error, event) => {
      if (error) {
        callback(error);
        return;
      }

      const tip = event.args;
      const to = web3.toUtf8(tip.username);
      const val = web3.fromWei(tip.val.toString());

      let from = web3.toUtf8(await _getUsernameForAddress(web3, contracts.func, tip.from));
      from = from || tip.from;

      callback({ to, val, from });
    };

    const UserTippedInstance = new AbstractWatcher(UserTipped, UserTippedWatcherCb);

    UserTippedInstance.watch();
  } catch (err) {
    callback(err);
  }
};

export const getGoldFromEvent = (web3, contracts, address, hexUsername) =>
  new Promise((resolve, reject) => {
    contracts.events.GoldBought([{ from: address }, { to: hexUsername }],
      { fromBlock: CONTRACTS.events.startingBlock, toBlock: 'latest' })
      .get(async (error, result) => {
        if (error) reject(error);

        const allGold = await Promise.all(result.map(async (tx) => {
          const username = web3.toUtf8(await _getUsernameForAddress(web3, contracts.func, tx.args.from));

          return {
            to: web3.toUtf8(tx.args.to),
            val: web3.fromWei(tx.args.price.toString()),
            from: username || tx.args.from,
            months: tx.args.months,
            block: tx.blockNumber
          };
        }));

        resolve(allGold.reverse());
      });
  });

export const listenForGold = async (web3, contracts, dispatch, address, hexUsername, callback) => {
  try {
    const fromBlock = await getBlockNumber(web3);

    const GoldBought =
      contracts.events.GoldBought([{ from: address }, { to: hexUsername }], { fromBlock, toBlock: 'latest' });

    const GoldBoughtdWatcherCb = async (error, event) => {
      if (error) {
        callback(error);
        return;
      }

      const gold = event.args;
      const to = web3.toUtf8(gold.to);
      const val = web3.fromWei(gold.price.toString());
      const months = gold.months;

      let from = web3.toUtf8(await _getUsernameForAddress(web3, contracts.func, gold.from));
      from = from || gold.from;

      callback({ to, val, from, months });
    };

    const GoldBoughtInstance = new AbstractWatcher(GoldBought, GoldBoughtdWatcherCb);

    GoldBoughtInstance.watch();
  } catch (err) {
    callback(err);
  }
};

/**
 * Gets every tipped event and returns an array of formatted Objects { id, txVal }
 * based on if the event has a commentId that matches one of the provided componentIds
 *
 * @param {Object} web3
 * @param {Object} contract
 * @param {Array} componentIds - array of component Ids
 * @return {Promise}
 */
export const getReceivedEthForComponents = (web3, contract, componentIds) =>
  new Promise(async (resolve, reject) => {
    contract.UserTipped({}, { fromBlock: CONTRACTS.events.startingBlock, toBlock: 'latest' })
      .get(async (error, result) => {
        if (error) reject(error);

        resolve(result.reduce((arr, tx) => {
          const id = web3.toUtf8(tx.args.commentId);

          if (componentIds.includes(id)) {
            const duplicateIndex = arr.findIndex((data) => id === data.id);

            if (duplicateIndex !== -1) {
              let existingElem = arr[duplicateIndex];
              existingElem.val =
                formatLargeNumber(Number(web3.fromWei(parseFloat(existingElem.val) + parseFloat(tx.args.val))));
              arr.splice(duplicateIndex, 1, existingElem);
            } else {
              arr.push({ id, val: formatLargeNumber(Number(web3.fromWei(tx.args.val))) });
            }
          }

          return arr;
        }, []));
      });
  });
