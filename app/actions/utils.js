const swap = (arr, i, j) => {
  let temp = arr[i];
  arr[i] = arr[j]; // eslint-disable-line
  arr[j] = temp; // eslint-disable-line
};

const partition = (arr, pivot, left, right) => {
  let pivotValue = arr[pivot];
  let partitionIndex = left;

  for (let i = left; i < right; i++) {
    if (arr[i] < pivotValue) {
      swap(arr, i, partitionIndex);
      partitionIndex++;
    }
  }
  swap(arr, right, partitionIndex);
  return partitionIndex;
};


export const quickSort = (arr, left, right) => {
  let pivot;
  let partitionIndex;

  if (left < right) {
    pivot = right;
    partitionIndex = partition(arr, pivot, left, right);

    quickSort(arr, left, partitionIndex - 1);
    quickSort(arr, partitionIndex + 1, right);
  }

  return arr;
};

export const isJson = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const getEtherScanLinkByNetwork = (network, address) => {
  if (network === 'unknown') return '';
  if (network === 'mainnet') return `https://etherscan.io/address/${address}`;

  return `https://${network}.etherscan.io/address/${address}`;
};

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
