import { _checkAddressVerified } from './ethereumService';
import * as userActions from '../actions/userActions';
import * as accountActions from '../actions/accountActions';
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
      const alreadyVerified = state.user.verified;

      if (alreadyVerified) {
        userActions.handleTips(web3, contracts, getState, dispatch);
        userActions.handleGold(web3, contracts, getState, dispatch);
      };

      if (!alreadyVerified && state.account.address) {
        const isVerified = await _checkAddressVerified(web3, contracts.func);

        if (isVerified) {
          userActions.verifiedUser(web3, contracts, getState, dispatch);
        } else if (!isVerified && state.user.registering && !state.user.verifiedUsername) {
          userActions.listenForVerifiedUser(web3, contracts, dispatch, getState);
        }
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
      let web3 = new Web3(getProviderSpecs(state.user.networkUrl));

      const eventsContract = web3.eth.contract(contractConfig.events.abi).at(contractConfig.events.contractAddress);
      const funcContract = web3.eth.contract(contractConfig.func.abi).at(contractConfig.func.contractAddress);

      const contracts = { events: eventsContract, func: funcContract };

      web3.eth.defaultAccount = state.account.address; //eslint-disable-line

      await handleUserVerification(web3, dispatch, getState, state, contracts);

      accountActions.pollForGasPrice(web3, dispatch);

      if (state.account.transactions.length > 0) accountActions.pollPendingTxs(web3, dispatch, getState);
      if (state.account.address) accountActions.pollForBalance(web3, dispatch, state.account.address);
      if (state.account.password) accountActions.passwordReloader(dispatch);

      resolve({ web3, contracts });
    } catch(err) {
      reject(err);
    }
  });

export default handleChangeNetwork;
