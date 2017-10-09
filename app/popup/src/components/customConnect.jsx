import React, { Component } from 'react';
import { getState } from '../../../actions/storageActions';

const connect = (mapStateToProps) =>
  (WrappedComponent) =>
    class Connect extends Component {
      constructor(props) {
        super(props);

        this.updateComponent = this.updateComponent.bind(this);
        this.listenForStateChanges = this.listenForStateChanges.bind(this);
      }

      componentDidMount() {
        this.updateComponent();
        this.listenForStateChanges();
      }

      async listenForStateChanges() {
        chrome.storage.onChanged.addListener(async (changes) => {
          if (changes[Object.keys(changes)[0]].newValue === undefined) return;

          this.updateComponent();
        });
      }

      async updateComponent() {
        this.componentProps = mapStateToProps(await getState());
        this.forceUpdate();
      }

      render() {
        return (
          <WrappedComponent
            {...this.componentProps}
          />
        );
      }
    };

export default connect;
