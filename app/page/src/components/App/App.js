import React, { Component } from 'react';
import connect from '../../../../customRedux/connect';
import ModalRoot from '../Modals/ModalRoot';
import insertPageComponents from './insertPageComponents';
import addEventListenersToMoreComments from './addEventListenersToMoreComments';
import { addTabIdMessage } from '../../../../messages/userActionsMessages';

class App extends Component {
  constructor() {
    super();

    this.addComponents = true;

    this.loadComponents = this.loadComponents.bind(this);
    this.loadComponentsCallback = this.loadComponentsCallback.bind(this);
  }

  componentWillMount() {
    this.loadComponents(this.props);

    addEventListenersToMoreComments(this.loadComponentsCallback);
  }

  componentWillReceiveProps(newProps) {
    this.loadComponents(newProps);
  }

  loadComponentsCallback() {
    this.addComponents = true;
    this.loadComponents(this.props);
  }

  loadComponents(newProps) {
    if (!window.location.pathname.includes('/comments/')) return;

    addTabIdMessage();

    if (newProps.generatedVault && newProps.copiedSeed && this.addComponents) {
      insertPageComponents();
      this.addComponents = false;
    }
  }

  render() {
    return(
      <ModalRoot />
    );
  }
}

const mapStateToProps = (state) => ({
  generatedVault: state.keyStore.created,
  password: state.keyStore.password,
  copiedSeed: state.permanent.copiedSeed,
});

export default connect(App, mapStateToProps);
