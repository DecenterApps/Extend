import lightwallet from '../modules/eth-lightwallet/lightwallet';
import { CREATE_WALLET, COPIED_SEED } from '../constants/actionTypes';

const keyStore = lightwallet.keystore;

/**
 * Returns a pw derived key from key store and password
 *
 * @param {Object} ks
 * @param {String} password
 * @return {Promise} pwDerivedKey
 */
const getPwDerivedKey = (ks, password) =>
  new Promise((resolve, reject) => {
    ks.keyFromPassword(password, (err, pwDerivedKey) => {
      if (err) reject(err);
      resolve(pwDerivedKey);
    });
  });

/**
 * Create a new key store with the users password
 *
 * @param {Function} dispatch
 * @param {String} password
 */
export const createWallet = (dispatch, password) => {
  keyStore.createVault({
    password,
  }, async (err, ks) => {
    const pwDerivedKey = await getPwDerivedKey(ks, password);
    const seed = ks.getSeed(pwDerivedKey);
    ks.generateNewAddress(pwDerivedKey, 1);
    const addresses = ks.getAddresses();
    const address = addresses[0];
    const privateKey = ks.exportPrivateKey(addresses[0], pwDerivedKey);
    const searializedKeyStore = ks.serialize();

    const payload = { seed, address, privateKey, keyStore: searializedKeyStore };

    dispatch({ type: CREATE_WALLET, payload });
  });
};

/**
 * Dispatches action that the user has copied the seed
 *
 * @param {Function} dispatch
 */
export const copiedSeed = (dispatch) => {
  dispatch({ type: COPIED_SEED });
};