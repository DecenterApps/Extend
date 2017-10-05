import lightwallet from '../modules/eth-lightwallet/lightwallet';

export const createWallet = () => {
// the seed is stored encrypted by a user-defined password
  var password = prompt('Enter password for encryption', 'password');

  keyStore.createVault({
    password: password,
    // seedPhrase: seedPhrase, // Optionally provide a 12-word seed phrase
    // salt: fixture.salt,     // Optionally provide a salt.
    // A unique salt will be generated otherwise.
    // hdPathString: hdPath    // Optional custom HD Path String
  }, function (err, ks) {

    // Some methods will require providing the `pwDerivedKey`,
    // Allowing you to only decrypt private keys on an as-needed basis.
    // You can generate that value with this convenient method:
    ks.keyFromPassword(password, function (err, pwDerivedKey) {
      if (err) throw err;

      // generate five new address/private key pairs
      // the corresponding private keys are also encrypted
      ks.generateNewAddress(pwDerivedKey, 1);
      var addr = ks.getAddresses();

      ks.passwordProvider = function (callback) {
        var pw = prompt("Please enter password", "Password");
        callback(null, pw);
      };

      // Now set ks as transaction_signer in the hooked web3 provider
      // and you can start using web3 using the keys/addresses in ks!
    });
  });
};

export const test = () => {
  console.log('test');
};
