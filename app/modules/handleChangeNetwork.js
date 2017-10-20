import * as userActions from '../actions/userActions';
import * as accountActions from '../actions/accountActions';
import * as ZeroClientProvider from './ZeroClientProvider';

const handleChangeNetwork = (Web3, contractConfig, dispatch, getState) =>
  new Promise(async (resolve, reject) => {
    const state = getState();

    let web3 = new Web3(
        ZeroClientProvider({
            static: {
                eth_syncing: false,
                web3_clientVersion: 'ZeroClientProvider',
            },
            pollingInterval: 1,
            rpcUrl: getState().user.selectedNetwork.url,
            getAccounts: (cb) => new Promise((resolve) => { resolve(cb) })
        })
    );

    const contract = web3.eth.contract(contractConfig.abi).at(contractConfig.contractAddress);

    try {
      const isVeriied = await accountActions.checkAddressVerified(web3, contract, getState);

      // This is in case the user has closed their browser or if he switched networks
      // while the user was being verified
      if (!isVeriied && state.user.registering && !state.user.verifiedUsername) {
        userActions.listenForVerifiedUser(web3, contract);
      } else {
        // Change if he has never registerd
        userActions.verifiedUser(dispatch);
      }

      await userActions.setNetwork(web3, dispatch);

      if (state.account.address) await accountActions.setBalance(web3, getState, dispatch);
      if (state.account.password) accountActions.passwordReloader(dispatch);

      resolve({ web3, contract });
    } catch(err) {
      reject(err);
    }
  });


export default handleChangeNetwork;