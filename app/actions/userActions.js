import { createUser } from '../modules/ethereumService';
import { getParameterByName } from './utils';
import { SET_NETWORK, SET_ADDRESS, REGISTER_USER, REGISTER_USER_SUCCESS, REGISTER_USER_ERROR } from '../constants/actionTypes';

/**
 * Sets Ethereum network if it found it
 */
export const setNetwork = (web3, dispatch) => {
  web3.version.getNetwork((err, netId) => {
    if (err) {
      dispatch({ type: SET_NETWORK, payload: '' });
      return;
    }


    let networkName = '';

    switch (netId) {
      case "1":
        networkName = 'mainnet';
        break;
      case "2":
        networkName= 'morden';
        break;
      case "3":
        networkName = 'ropsten';
        break;
      case "4":
        networkName = 'rinkeby';
        break;
      case "42":
        networkName = 'kovan';
        break;
      default:
        networkName = 'unknown';
    }

    dispatch({ type: SET_NETWORK, payload: networkName });
  });
};

/**
 * Checks if the current user has an address and sets
 * @return {String|Boolean} address
 */
export const setAddress = (currentAddress, dispatch, web3) => {
  if (!web3.eth.accounts[0]) {
    dispatch({ type: SET_ADDRESS, payload: '' });
    return false;
  }

  const newAddress = web3.eth.accounts[0];

  if (newAddress === currentAddress) return currentAddress;

  dispatch({ type: SET_ADDRESS, payload: newAddress });
};


/**
 * Opens Reddit oauth window and receives user access_token. Access_token and user address are sent to the contract
 */
export const createUserAuth = (address, dispatch) => {
  const redirectUri = chrome.identity.getRedirectURL("oauth2");

  dispatch({ type: REGISTER_USER });

  chrome.identity.launchWebAuthFlow({
    url: `https://www.reddit.com/api/v1/authorize?client_id=AFH0yVxKuLUlVQ&response_type=token&state=asdf&redirect_uri=${redirectUri}&scope=identity`,
    interactive: true
  }, async (response) => {
    console.log('RESPONSE AUTH', response);
    response = response.replace(/#/g, "?");
    const accessToken = getParameterByName('access_token', response);

    const request = new Request('https://oauth.reddit.com/api/v1/me', {
      headers: new Headers({
        "Authorization": `bearer ${accessToken}`
      })
    });

    try {
      const redditMeResponse = await fetch(request);
      const me = await redditMeResponse.json();

      if (me.error) return dispatch({ type: REGISTER_USER_ERROR });
      console.log('USERNAME', me.name);
      dispatch({ type: REGISTER_USER_SUCCESS, payload: me.name });

    } catch (err) {
      return dispatch({ type: REGISTER_USER_ERROR });
    }
  });
};
