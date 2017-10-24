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

      const contract = web3.eth.contract(contractConfig.abi).at(contractConfig.contractAddress);

      const isVeriied = await accountActions.checkAddressVerified(web3, contract, getState);

      if (isVeriied) {
        userActions.verifiedUser(dispatch);
      } else if (!isVeriied && state.user.registering && !state.user.verifiedUsername) {
        userActions.listenForVerifiedUser(web3, contract, dispatch, getState);
      }

      await userActions.setNetwork(web3, dispatch); // TODO remove this

      accountActions.pollForGasPrice(web3, dispatch);
      accountActions.pollPendingTxs(web3, dispatch, getState);

      if (state.account.address) accountActions.pollForBalance(web3, dispatch, state.account.address);
      if (state.account.password) accountActions.passwordReloader(dispatch);

      resolve({ web3, contract });
    } catch(err) {
      reject(err);
    }
  });

export default handleChangeNetwork;
