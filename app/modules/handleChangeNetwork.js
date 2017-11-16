import { _checkAddressVerified, _getUsernameForAddress } from './ethereumService';
import * as userActions from '../actions/userActions';
import * as accountActions from '../actions/accountActions';
import * as keyStoreActions from '../actions/keyStoreActions';
import * as zeroClientProvider from './ZeroClientProvider';

const getProviderSpecs = (url) => (
  zeroClientProvider({
    static: {
      eth_syncing: false,
      web3_clientVersion: 'ZeroClientProvider',
    },
    pollingInterval: 1,
    rpcUrl: url,
    getAccounts: () => {}
  })
);

const handleUserVerification = (web3, dispatch, getState, state, contracts) =>
  new Promise(async (resolve, reject) => {
    try {
      if (!state.keyStore.address) {
        resolve();
        return;
      }

      const verified = await _checkAddressVerified(web3, contracts.func);

      if (verified) {
        const verifiedUsername = await _getUsernameForAddress(web3, contracts.func, state.keyStore.address);
        userActions.verifiedUser(web3, contracts, getState, dispatch, web3.toUtf8(verifiedUsername));
      }

      if (!verified && state.permanent.registeringUsername) {
        userActions.listenForVerifiedUser(web3, contracts, dispatch, getState);
      }

      resolve();
    } catch(err) {
      reject(err);
    }
  });

const handleChangeNetwork = (Web3, contractConfig, dispatch, getState) =>
  new Promise(async (resolve, reject) => {
    const state = getState();

    try {
      const engine = getProviderSpecs(state.user.networkUrl);
      let web3 = new Web3(engine);

      const eventsContract = web3.eth.contract(contractConfig.events.abi).at(contractConfig.events.contractAddress);
      const funcContract = web3.eth.contract(contractConfig.func.abi).at(contractConfig.func.contractAddress);

      const contracts = { events: eventsContract, func: funcContract };

      web3.eth.defaultAccount = state.keyStore.address; //eslint-disable-line

      await handleUserVerification(web3, dispatch, getState, state, contracts);

      accountActions.pollForGasPrice(web3, engine, dispatch, getState);

      if (state.keyStore.address) accountActions.pollForBalance(web3, engine, dispatch, getState);
      if (state.keyStore.password) keyStoreActions.passwordReloader(dispatch, getState);

      resolve({ web3, contracts, engine });
    } catch(err) {
      reject(err);
    }
  });

export default handleChangeNetwork;
