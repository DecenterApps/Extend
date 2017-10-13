import React, { Component } from 'react';
import { addFormMessage } from '../messages/formsActionsMessages';

const createForm = (formName, WrappedComponent) => (
  class Connect extends Component {
    constructor(props) {
      super(props);

      this.fields = {};
      this.mergedProps = { ...this.props, formName };
      this.registerField = this.registerField.bind(this);
    }

    componentDidMount() {
      addFormMessage({ name: formName, state: this.fields });
      this.mergedProps = { ...this.props, formName };
    }

    registerField(field) {
      this.fields[field.name] = field;
    }

    render() {
      return (
        <WrappedComponent
          registerField={this.registerField}
          {...this.mergedProps}
        />
      );
    }
  }
);

export default createForm;
