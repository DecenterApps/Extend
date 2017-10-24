import * as userActions from '../actions/userActions';
import * as accountActions from '../actions/accountActions';
import * as zeroClientProvider from './ZeroClientProvider';

const handleChangeNetwork = (Web3, contractConfig, dispatch, getState) =>
  new Promise(async (resolve, reject) => {
    const state = getState();

    try {
      let web3 = new Web3(
        zeroClientProvider({
          static: {
            eth_syncing: false,
            web3_clientVersion: 'ZeroClientProvider',
          },
          pollingInterval: 1,
          rpcUrl: getState().user.selectedNetwork.url,
          getAccounts: () => {}
        })
      );

      const eventsContract = web3.eth.contract(contractConfig.events.abi).at(contractConfig.events.contractAddress);
      const funcContract = web3.eth.contract(contractConfig.func.abi).at(contractConfig.func.contractAddress);

      const contracts = { events: eventsContract, func: funcContract };

      const isVerified = await accountActions.checkAddressVerified(web3, contracts.func, getState);

      if (isVerified) {
        userActions.verifiedUser(dispatch);
      } else if (!isVerified && state.user.registering && !state.user.verifiedUsername) {
        userActions.listenForVerifiedUser(web3, contracts.events, dispatch, getState);
      }

      await userActions.setNetwork(web3, dispatch); // TODO remove this

      accountActions.pollForGasPrice(web3, dispatch);
      accountActions.pollPendingTxs(web3, dispatch, getState);

      if (state.account.address) accountActions.pollForBalance(web3, dispatch, state.account.address);
      if (state.account.password) accountActions.passwordReloader(dispatch);

      resolve({ web3, contracts });
    } catch(err) {
      reject(err);
    }
  });

export default handleChangeNetwork;
