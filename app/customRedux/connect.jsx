import React, { Component } from 'react';
import { getState, subscribe, unsubscribe } from './store';

const connect = (WrappedComponent, mapStateToProps) => (
  class Connect extends Component {
    constructor(props) {
      super(props);

      this.willUnmount = false;
      this.updateComponent = this.updateComponent.bind(this);
      this.listenForStateChanges = this.listenForStateChanges.bind(this);
    }

    async componentDidMount() {
      this.updateComponent(this.props);
      subscribe(this.listenForStateChanges);
    }

    componentWillReceiveProps(nextProps) {
      this.updateComponent(nextProps);
    }

    componentWillUnmount() {
      this.willUnmount = true;
      unsubscribe(this.listenForStateChanges);
    }

    async listenForStateChanges(changes) {
      if (changes[Object.keys(changes)[0]].newValue === undefined) return;

      this.updateComponent(this.props);
    }

    async updateComponent(ownProps) {
      // TODO remove await get state if it happens to be a bottleneck
      const mappedStateProps = mapStateToProps(await getState());
      this.componentProps = { ...mappedStateProps, ...ownProps };

      if (!this.willUnmount) this.forceUpdate();
    }

    render() {
      if (!this.componentProps) return <div />;

      return (
        <WrappedComponent
          {...this.componentProps}
        />
      );
    }
  }
);

export default connect;
