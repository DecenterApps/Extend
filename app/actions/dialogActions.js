import lightwallet from 'eth-lightwallet';
import { REGISTER_USER, REGISTER_USER_ERROR } from '../constants/actionTypes';
import { CLIENT_ID } from '../constants/config.local';
import { getParameterByName, encryptTokenOreclize } from '../actions/utils';
import { sendTransaction, getOraclizePrice } from '../modules/ethereumService';
import { listenForVerifiedUser, clearRegisteringError } from './userActions';

const keyStore = lightwallet.keystore;

/**
 * Opens Reddit oauth window and receives user access_token. Access_token and
 * user address are sent to the contract
 *
 * @param {Array} contracts
 * @param {Object} web3
 * @param {Function} getState
 * @param {Function} dispatch
 */
export const handleUserAuthentication = (contracts, web3, getState, dispatch) => {
  const redirectUri = chrome.identity.getRedirectURL('oauth2');
  const keyStoreState = getState().keyStore;
  const ks = keyStore.deserialize(keyStoreState.keyStore);
  const address = keyStoreState.address;
  const password = keyStoreState.password;

  chrome.identity.launchWebAuthFlow({
    url: `https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=token&state=asdf&redirect_uri=${redirectUri}&scope=identity`, // eslint-disable-line
    interactive: true
  }, async (authResponse) => {
    if (!authResponse) return;

    const response = authResponse.replace(/#/g, '?');
    const accessToken = getParameterByName('access_token', response);

    const request = new Request('https://oauth.reddit.com/api/v1/me', {
      headers: new Headers({
        'Authorization': `bearer ${accessToken}`
      })
    });

    try {
      const redditMeResponse = await fetch(request);
      const me = await redditMeResponse.json();

      if (me.error) {
        await dispatch({ type: REGISTER_USER_ERROR, message: 'Canceled verification' });
        return;
      }

      const gasPrice = web3.toWei(getState().forms.registerForm.gasPrice.value, 'gwei');
      const contracMethod = contracts.func.createUser;
      const oreclizeTransactionCost = await getOraclizePrice(contracts.func);
      const value = oreclizeTransactionCost.toString();
      const encryptedToken = await encryptTokenOreclize(accessToken);
      const params = [web3.toHex(me.name), encryptedToken];

      await sendTransaction(web3, contracMethod, ks, address, password, params, value, gasPrice);

      await clearRegisteringError(dispatch);
      await dispatch({
        type: REGISTER_USER,
        payload: { username: me.name }
      });

      listenForVerifiedUser(web3, contracts, dispatch, getState);
    } catch (err) {
      dispatch({ type: REGISTER_USER_ERROR, message: 'Error sending transaction.' });
    }
  });
};
