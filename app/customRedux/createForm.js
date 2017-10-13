import React, { Component } from 'react';
import { addFormMessage, updateFieldMetaMessage } from '../messages/formsActionsMessages';
import { generateDataForFormValidator } from '../actions/utils';

const createForm = (formName, WrappedComponent, validator) => (
  class Connect extends Component {
    constructor(props) {
      super(props);

      this.fields = {};
      this.registerField = this.registerField.bind(this);
      this.updateMergedProps = this.updateMergedProps.bind(this);
      this.handleFieldChange = this.handleFieldChange.bind(this);

      this.updateMergedProps();
    }

    componentDidMount() {
      addFormMessage({ name: formName, state: this.fields });
      this.updateMergedProps();
    }

    updateMergedProps() {
      const formData = {
        registerField: this.registerField,
        handleFieldChange: this.handleFieldChange
      };

      this.mergedProps = { ...this.props, formData };
    }

    registerField(field) {
      this.fields[field.name] = field;
    }

    handleFieldChange(fieldData) {
      const field = this.fields[fieldData.name];

      this.fields[fieldData.name] = fieldData.meta;

      let dataForMessage = fieldData;
      dataForMessage.formName = formName;

      const dataForValidator = generateDataForFormValidator(this.fields);
      const errors = validator(dataForValidator);

      if (field.touched && errors[fieldData.name]) {
        dataForMessage.meta.error = errors[fieldData.name];
      } else {
        dataForMessage.meta.error = '';
      }

      updateFieldMetaMessage(dataForMessage);
    }

    render() {
      return (
        <WrappedComponent
          {...this.mergedProps}
        />
      );
    }
  }
);

export default createForm;
