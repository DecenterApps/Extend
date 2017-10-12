import lightwallet from '../modules/eth-lightwallet/lightwallet';


const keyStore = lightwallet.keystore;

const getPwDerivedKey = (ks, password) =>
  new Promise((resolve, reject) => {
    ks.keyFromPassword(password, (err, pwDerivedKey) => {
      if (err) reject(err);
      resolve(pwDerivedKey);
    });
  });

export const createWallet = () => {
// the seed is stored encrypted by a user-defined password
  const password = prompt('Enter password for encryption', 'password');

  keyStore.createVault({
    password,
    // salt: fixture.salt,     // Optionally provide a salt.
    // A unique salt will be generated otherwise.
    // hdPathString: hdPath    // Optional custom HD Path String
  }, async (err, ks) => {
    const pwDerivedKey = await getPwDerivedKey(ks, password);
    const seed = ks.getSeed(pwDerivedKey);
    ks.generateNewAddress(pwDerivedKey, 1);
    const addresses = ks.getAddresses();
    const address = addresses[0];
    const privateKey = ks.exportPrivateKey(addresses[0], pwDerivedKey);
    console.log('KEYSTORE', ks.serialize());

    // ks.keyFromPassword method to get pwDerivedKey
    // keystore.serialize() Serializes the current keystore object into a JSON-encoded string
    // keystore.deserialize(serialized_keystore)
  });
};

export const test = () => {
  console.log('test');
};

