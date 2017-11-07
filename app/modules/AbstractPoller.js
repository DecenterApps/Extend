import { subscribe, unsubscribe } from '../customRedux/store';

// Replace this abstract poller web3.subscribe when web3 1.0.0 is stable
class AbstractPoller {
  constructor(functionToPoll, pollerInterval, ...functionParams) {
    this.clearIntervalInstance = null;
    this.pollerInterval = pollerInterval;
    this.functionParams = functionParams;
    this.functionToPoll = functionToPoll;
    this.instanceDissconected = false;

    this.listenForStateChanges = this.listenForStateChanges.bind(this);
    this.stopPoller = this.stopPoller.bind(this);
  }

  stopPoller() {
    this.instanceDissconected = true;
    clearInterval(this.clearIntervalInstance);
    unsubscribe(this.listenForStateChanges);
  }

  async listenForStateChanges(changes) {
    if (changes.hasOwnProperty('user') && changes.user.hasOwnProperty('newValue')) {
      const disconnected = changes.user.newValue.disconnected;

      if (disconnected && !this.instanceDissconected) {
        this.stopPoller();
      }
    }
  }

  poll() {
    subscribe(this.listenForStateChanges);

    this.functionToPoll(...this.functionParams, this.stopPoller);

    this.clearIntervalInstance = setInterval(() => {
      this.functionToPoll(...this.functionParams, this.stopPoller);
    }, this.pollerInterval);
  }
}

export default AbstractPoller;
