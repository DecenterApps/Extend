import { createStore } from 'redux';
import rootReducer from './reducers/index';
import { wrapStore } from 'react-chrome-redux';
import { SET_ADDRESS, SET_NETWORK } from '../../constants/actionTypes';
import { STORE_PORT } from '../../constants/general';

const store = createStore(rootReducer, {});
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

wrapStore(store, { portName: STORE_PORT });

web3.version.getNetwork((err, netId) => {
  switch (netId) {
    case "1":
      store.dispatch({ type: SET_NETWORK, payload: 'mainnet' });
      break;
    case "2":
      store.dispatch({ type: SET_NETWORK, payload: 'morden' });
      break;
    case "3":
      store.dispatch({ type: SET_NETWORK, payload: 'ropsten' });
      break;
    case "4":
      store.dispatch({ type: SET_NETWORK, payload: 'rinkeby' });
      break;
    case "42":
      store.dispatch({ type: SET_NETWORK, payload: 'kovan' });
      break;
    default:
      store.dispatch({ type: SET_NETWORK, payload: 'unknown' });
  }
});

/**
 * Listens for posible user change of metaMask account/address
 *
 */
const pollForAddressChange = () => {
  setInterval(() => {

    if (!web3.eth.accounts[0]) {
      store.dispatch({ type: SET_ADDRESS, payload: '' });
      return;
    }

    if (web3.eth.accounts[0] === store.getState().user.address) return;

    store.dispatch({ type: SET_ADDRESS, payload: web3.eth.accounts[0] });

  }, 100);
};

var redirectUri = chrome.identity.getRedirectURL("oauth2");

console.log("REDIRECT URI", redirectUri);

chrome.identity.launchWebAuthFlow({
  url: `https://www.reddit.com/api/v1/authorize?client_id=AFH0yVxKuLUlVQ&response_type=token&state=asdf&redirect_uri=${redirectUri}&scope=identity`,
  interactive: true
}, (response) => {
  response = response.replace(/#/g, "?");
  const accessToken = getParameterByName('access_token', response);

  console.log(accessToken);

  const request = new Request('https://oauth.reddit.com/api/v1/me', {
    headers: new Headers({
      "Authorization": `bearer ${accessToken}`
    })
  });

  fetch(request)
    .then(function(response) {
        console.log('RESPONSE', response);
        response.json().then((user) => {
          const username = user.name;
          console.log(username);
        })
    })
    .catch((err) => {
      console.log('ERROR reading user', err)
    });
});
