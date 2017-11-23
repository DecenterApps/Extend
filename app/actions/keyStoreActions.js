import lightwallet from 'eth-lightwallet';
import { isJson } from '../actions/utils';
import {
  CREATE_WALLET, CLEAR_PASSWORD, UNLOCK_ERROR, UNLOCK, CLEAR_UNLOCK_ERROR, CLEAR_SEEN_DASH
} from '../constants/actionTypes';
import { pollForBalance } from './accountActions';
import { skipUnVerifiedOnboarding } from './onboardingActions';
import { handleUserVerification } from './userActions';
import { changeView, copiedSeed } from './permanentActions';
import { LOCK_INTERVAL } from '../constants/general';

let lockTimeout = null;
let reloaderActive = false;

const keyStore = lightwallet.keystore;

/**
 * Returns a private key for a given address
 *
 * @param {JSON} keyStoreParam
 * @param {String} address
 * @param {Uint8Array} pwDerivedKey
 *
 * @return {String}
 */
export const getPrivateKey = (keyStoreParam, address, pwDerivedKey) => {
  let ks = keyStoreParam;

  if (isJson()) ks = keyStore.deserialize(ks);

  return ks.exportPrivateKey(address, pwDerivedKey);
};


/**
 * Returns a pw derived key from key store and password
 *
 * @param {Object} ks
 * @param {String} password
 * @return {Promise} pwDerivedKey
 */
export const getPwDerivedKey = (ks, password) =>
  new Promise((resolve, reject) => {
    ks.keyFromPassword(password, (err, pwDerivedKey) => {
      if (err) reject(err);
      resolve(pwDerivedKey);
    });
  });

/**
 * Clears password timeout and dispatches action to clear password
 *
 * @param {Function} dispatch
 * @param {Function} getState
 */
export const clearPassword = (dispatch, getState) => {
  clearTimeout(lockTimeout);
  dispatch({ type: CLEAR_PASSWORD });
  changeView(dispatch, getState, { viewName: 'unlockAccount' });
};

/**
 *  Sets timeout to clear password after the user has created or unlocked the account
 *
 * @param {Function} dispatch
 * @param {Function} getState
 */
export const passwordReloader = (dispatch, getState) => {
  if (reloaderActive) return;

  reloaderActive = true;

  lockTimeout = setTimeout(() => {
    reloaderActive = false;
    dispatch({ type: CLEAR_PASSWORD });
    changeView(dispatch, getState, { viewName: 'unlockAccount' });
  }, LOCK_INTERVAL);
};

/**
 * Create a new key store with the users password
 *
 * @param {Object} web3
 * @param {Object} engine
 * @param {Function} dispatch
 * @param {Function} getState
 * @param {String} payload
 * @param {Object} contracts
 * @param {Boolean} [getSeed = false] - is the user creating a new account or importing one
 */
export const createWallet = (web3, engine, dispatch, getState, payload, contracts, getSeed = false) => {
  const { password } = payload;

  keyStore.createVault({
    password,
    hdPathString: 'm/44\'/60\'/0\'/0',
    seedPhrase: getSeed ? payload.seed : keyStore.generateRandomSeed()
  }, async (err, ks) => {
    const pwDerivedKey = await getPwDerivedKey(ks, password);
    const seed = ks.getSeed(pwDerivedKey);

    ks.generateNewAddress(pwDerivedKey, 1);

    const addresses = ks.getAddresses();
    const address = addresses[0];
    const searializedKeyStore = ks.serialize();

    web3.eth.defaultAccount = address; // eslint-disable-line

    await dispatch({
      type: CREATE_WALLET,
      payload: { seed, password, address, keyStore: searializedKeyStore }
    });

    // when the user has already typed in the seed to recover the account there is no need
    // to show him the seed words again
    if (getSeed) {
      await dispatch({ type: CLEAR_SEEN_DASH });
      await handleUserVerification(web3, dispatch, getState, contracts);
      await skipUnVerifiedOnboarding(dispatch);
      copiedSeed(dispatch, getState);
    } else {
      changeView(dispatch, getState, { viewName: 'copySeed' });
    }

    if (!payload.generatedVault) {
      pollForBalance(web3, engine, dispatch, getState);
    }
  });
};

/**
 *  Checks if the unlock account password matches the key store and dispatches action to unlock
 *  it if it is
 *
 *  @param {Function} getState
 *  @param {Function} dispatch
 *  @param {String} password
 */
export const checkIfPasswordValid = async (getState, dispatch, password) => {
  const ks = keyStore.deserialize(getState().keyStore.keyStore);

  try {
    const pwDerivedKey = await getPwDerivedKey(ks, password);
    getPrivateKey(ks, getState().keyStore.address, pwDerivedKey);

    await dispatch({ type: UNLOCK, payload: password });
    await dispatch({ type: CLEAR_UNLOCK_ERROR });
    changeView(dispatch, getState, { viewName: 'dashboard' });
    passwordReloader(dispatch, getState);
  } catch(err) {
    dispatch({ type: UNLOCK_ERROR });
  }
};
