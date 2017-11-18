import React, { Component } from 'react';
import connect from '../../../../customRedux/connect';
import ModalRoot from '../Modals/ModalRoot';
import insertPageComponents from './insertPageComponents';
import { addTabIdMessage } from '../../../../messages/userActionsMessages';

class App extends Component {
  constructor() {
    super();

    this.added = false;

    this.loadComponents = this.loadComponents.bind(this);
  }

  componentWillMount() {
    this.loadComponents(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.loadComponents(newProps);
  }

  loadComponents(newProps) {
    if (!window.location.pathname.includes('/comments/')) return;

    addTabIdMessage();

    if (newProps.generatedVault && newProps.copiedSeed && !this.added) {
      insertPageComponents();
      this.added = true;
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
