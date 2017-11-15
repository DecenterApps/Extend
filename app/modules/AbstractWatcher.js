import { subscribe, unsubscribe } from '../customRedux/store';

// Replace this abstract watcher with web3.reset() when they fix it in
// this ZeroClientProvider
class AbstractWatcher {
  constructor(contractMethodInstance, callback) {
    this.contractMethodInstance = contractMethodInstance;
    this.callback = callback;
    this.instanceDissconected = false;

    this.listenForStateChanges = this.listenForStateChanges.bind(this);
  }

  async listenForStateChanges(changes) {
    if (changes.hasOwnProperty('permanent') && changes.permanent.hasOwnProperty('newValue')) {
      if (changes.user.newValue.disconnected && !this.instanceDissconected) {
        this.instanceDissconected = true;
        this.contractMethodInstance.stopWatching(() => {});
        unsubscribe(this.listenForStateChanges);
      }
    }
  }

  watch() {
    subscribe(this.listenForStateChanges);

    this.contractMethodInstance.watch((error, event) => {
      if (error) {
        this.callback(error);
      } else {
        this.callback(null, event);
      }
    });
  }
}

export default AbstractWatcher;
