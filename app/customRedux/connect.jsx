import React, { Component } from 'react';

const connect = (WrappedComponent, mapStateToProps) => (
  class Connect extends Component {
    constructor(props) {
      super(props);

      this.willUnmount = false;
      this.handleGetState = this.handleGetState.bind(this);
      this.handleChangeOfState = this.handleChangeOfState.bind(this);
      this.updateComponent = this.updateComponent.bind(this);
      this.handleWillReceiveProps = this.handleWillReceiveProps.bind(this);
    }

    async componentWillMount() {
      chrome.runtime.sendMessage({ type: 'getState' }, this.handleGetState);

      chrome.runtime.onMessage.addListener(this.handleChangeOfState);
    }

    componentWillReceiveProps(nextProps) {
      if ((Object.keys(nextProps).length === 0) || this.willUnmount) return;

      this.componentProps = { ...nextProps, ...this.componentProps };
      this.forceUpdate();
    }

    componentWillUnmount() {
      this.willUnmount = true;

      chrome.runtime.onMessage.removeListener(this.handleChangeOfState);
    }

    handleGetState(state) {
      this.updateComponent(this.props, state);
    }

    handleWillReceiveProps(nextProps, state) {
      this.updateComponent(nextProps, state);
    }

    handleChangeOfState(request) {
      if (request.type !== 'dispatch') return;

      this.updateComponent(this.props, request.state);
    }

    async updateComponent(ownProps, state) {
      const mappedStateProps = mapStateToProps(state);
      const newProps = { ...mappedStateProps, ...ownProps };

      if (this.willUnmount || (JSON.stringify(newProps) === JSON.stringify(this.componentProps))) return;

      this.componentProps = newProps;
      this.forceUpdate();
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
