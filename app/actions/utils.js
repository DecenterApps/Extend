import { NETWORK } from '../constants/config';

let cryptoSha3 = require('crypto-js/sha3');

const sha3 = (value) => (cryptoSha3(value, { outputLength: 256 }).toString());

/**
 * Gets the price of ETH in USD from the server
 *
 * @return {Promise}
 */
export const getValOfEthInUsd = () =>
  new Promise(async (resolve) => {
    const res = await fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&e=Coinbase');
    const data = await res.json();

    resolve(parseFloat(data.USD));
  });

/**
 * Checks if a address checksum is valid
 *
 * @param {String} addressParam
 * @return {boolean}
 */
const isValidChecksumAddress = (addressParam) => {
  if (addressParam.length < 42) return false;

  const address = addressParam.replace('0x', '');
  let addressHash = sha3(address.toLowerCase());

  for (let i = 0; i < 40; i++) {
    if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) ||
      (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
      return false;
    }
  }
  return true;
};

/**
 * Checks if a address is valid
 *
 * @param {String} address
 * @return {boolean}
 */
export const isValidAddress = (address) => {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    return false;
  } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
    return true;
  }

  return isValidChecksumAddress(address);
};

/**
 * Checks whether a string is a JSON
 *
 * @param {String} str
 * @return {boolean}
 */
export const isJson = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

/**
 * Return a link to the address on a correct network on etherscan
 *
 * @param {String} address
 * @return {String} link to the address on a correct network on etherscan
 */
export const getEtherScanLink = (address) => {
  if (NETWORK === 'main') {
    return `https://etherscan.io/address/${address}`;
  }

  return `https://${NETWORK}.etherscan.io/address/${address}`;
};

/**
 * Return a link to the reddit based on the username given
 *
 * @param {String} user
 * @return {String}
 */
export const createRedditLink = ((user) => (`https://www.reddit.com/user/${user}`));

/**
 * Returns a reddit link if receiver is an username (verified) or returns etherscan link if it is an address
 *
 * @param {String} from
 * @return {String}
 */
export const getLinkForFrom = (from) => {
  if (isValidAddress(from)) {
    return getEtherScanLink(from);
  }

  return createRedditLink(from);
};

/**
 * Gets specified parameter from url
 *
 * @param {String} nameParam
 * @param {String} urlParam
 *
 * @returns {Object} An object with keys: hashBuffer, type
 */
export const getParameterByName = (nameParam, urlParam) => {
  let url = urlParam;
  if (!url) url = window.location.href;
  let name = nameParam.replace(/[\[\]]/g, '\\$&'); // eslint-disable-line

  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

/**
 * Creates An structured object required for validator out of filed meta data
 *
 * @param {Object} fieldsMeta
 *
 * @returns {Object} An structured object required for validator
 */
export const generateDataForFormValidator = (fieldsMeta) => {
  const validatorObj = {};

  for (let key in fieldsMeta) { // eslint-disable-line
    validatorObj[key] = fieldsMeta[key].value;
  }

  return validatorObj;
};

/**
 * Sends the token to Oreclize servers for encryption and returns the encrypted access token
 *
 * @param {String} token
 * @return {Promise}
 */
export const encryptTokenOreclize = (token) =>
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

/**
 * Formats small numbers example: 0.0000000001 number to 0.0000000001 string instead of the
 * usual JS conversion to 1e-9
 *
 * @param {Number} incomingOutput
 * @return {String}
 */
export const formatLargeNumber = (incomingOutput) => {
  if (!incomingOutput) return incomingOutput.toString();

  let output = incomingOutput;
  let n = Math.log(output) / Math.LN10;
  let decimalPoints = 0;
  let m = 10 ** decimalPoints;

  n = (n >= 0 ? Math.ceil(n * m) : Math.floor(n * m)) / m;

  let x = 0 - Math.ceil(n);
  if (x < 0) x = 0;

  return output.toFixed(x);
};

/**
 * Formats block timestamp to readable time string
 *
 * @param {Number} timestamp
 * @return {String}
 */
export const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours %= 12;
  hours = hours || 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  let strTime = hours + ':' + minutes + ' ' + ampm;
  return date.getMonth() + 1 + '-' + date.getDate() + '-' + date.getFullYear() + ' ' + strTime;
}
