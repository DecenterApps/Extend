import { subscribe, unsubscribe } from '../customRedux/store';

// Replace this abstract poller with web3.subscribe when web3 1.0.0 is stable
class AbstractPoller {
  constructor(functionToPoll, engine, ...functionParams) {
    this.newBlockHandler = null;
    this.engine = engine;
    this.functionParams = functionParams;
    this.functionToPoll = functionToPoll;
    this.instanceDissconected = false;

    this.listenForStateChanges = this.listenForStateChanges.bind(this);
    this.stopPoller = this.stopPoller.bind(this);
  }

  stopPoller() {
    this.instanceDissconected = true;
    this.engine.removeListener('block', this.newBlockHandler);
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

    this.newBlockHandler = () => {
      this.functionToPoll(...this.functionParams, this.stopPoller);
    };

    this.engine.on('block', this.newBlockHandler);
  }
}

export default AbstractPoller;
