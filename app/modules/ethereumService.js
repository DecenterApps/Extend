import EthereumTx from 'ethereumjs-tx';
import { getPwDerivedKey, getPrivateKey } from '../actions/accountActions';
import { encryptTokenOreclize, getOreclizeTransactionCost } from '../actions/utils';

/* STANDARD FUNCTIONS REQUIRED TO SEND TRANSACTIONS */

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
const getGasPrice = (web3) =>
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
const getNonceForAddress = (web3, address) =>
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
const getEncodedParams = (contractMethod, params) => {
  const encodedTransaction = contractMethod.request.apply(contractMethod, params); // eslint-disable-line
  return encodedTransaction.params[0];
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
 * @param {Number} valueParam - amount of wei to send
 * @return {Promise.<void>}
 */
export const sendTransaction =
  async (web3, contractMethod, ks, from, password, params, valueParam = 0) =>
    new Promise(async (resolve, reject) => {
      try {
        const value = web3.toHex(valueParam);

        const pwDerivedKey = await getPwDerivedKey(ks, password);
        const privateKey = new Buffer(getPrivateKey(ks, from, pwDerivedKey), 'hex');

        const { to, data } = getEncodedParams(contractMethod, params);
        const nonce = web3.toHex(await getNonceForAddress(web3, from));

        const gasPrice = web3.toHex(await getGasPrice(web3));
        const gas = web3.toHex(web3.eth.estimateGas({ to, data, value }));

        let transactionParams = { from, to, data, gas, gasPrice, value, nonce };

        const tx = new EthereumTx(transactionParams);

        tx.sign(privateKey);

        const serializedTx = `0x${tx.serialize().toString('hex')}`;

        web3.eth.sendRawTransaction(serializedTx, (error, transactionHash) => {
          if (error) reject(error);

          resolve(transactionHash);
        });
      } catch (err) {
        reject(err);
      }
    });

/* CONTRACT SPECIFIC FUNCTIONS */

/**
 * Initiates the createUser method on the contract
 *
 * @param {Object} contract
 * @param {Object} web3
 * @param {String} username
 * @param {String} token
 * @param {Object} ks
 * @param {String} address
 * @param {String} password
 * @return {Promise} transaction hash once finished
 */
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

// TODO convert to sendTransaction
export const checkIfUserVerified = (contract) =>
  new Promise((resolve, reject) => {
    contract.checkIfUserVerified((error, result) => {
      if (error) return reject({ message: error, });

      return resolve(result);
    });
  });
