import React, { Component } from 'react';
import {
  addFormMessage, updateFieldMetaMessage, updateFieldErrorMessage }
  from '../messages/formsActionsMessages';
import { generateDataForFormValidator } from '../actions/utils';

const createForm = (formName, WrappedComponent, validator) => (
  class Connect extends Component {
    constructor(props) {
      super(props);

      this.fields = {};
      this.formMeta = {
        invalid: false,
        pristine: true
      };

      this.registerField = this.registerField.bind(this);
      this.checkFormMeta = this.checkFormMeta.bind(this);
      this.updateMergedProps = this.updateMergedProps.bind(this);
      this.handleFieldChange = this.handleFieldChange.bind(this);
      this.updateRestOfErrors = this.updateRestOfErrors.bind(this);
      this.getFiledVal = this.getFiledVal.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);

      this.updateMergedProps();
    }

    componentDidMount() {
      addFormMessage({ name: formName, state: this.fields });
      this.updateMergedProps();
    }

    componentWillReceiveProps(nextProps) {
      this.mergedProps = { ...this.mergedProps, ...nextProps };
    }

    getFiledVal(field) {
      if (this.fields[field] === undefined) return false;

      return this.fields[field].value;
    }

    updateMergedProps() {
      const formData = {
        registerField: this.registerField,
        handleFieldChange: this.handleFieldChange,
        getFiledVal: this.getFiledVal
      };

      this.mergedProps = {
        ...this.props,
        formData,
        ...this.formMeta,
        handleSubmit: this.handleSubmit
      };
    }

    registerField(field) {
      this.fields[field.name] = field;
      this.updateMergedProps();
    }

    checkFormMeta() {
      let invalid = false;
      let pristine = true;
      let hasValue = 0;

      const fields = Object.keys(this.fields);

      fields.forEach((fieldName) => {
        if (this.fields[fieldName].error) invalid = true;
        if (this.fields[fieldName].touched) pristine = false;
        if (this.fields[fieldName].value) hasValue++;
      });

      if (hasValue !== fields.length) invalid = true;

      this.formMeta = { pristine, invalid };

      this.updateMergedProps();
    }

    updateRestOfErrors(errorsParam) {
      const errors = Object.keys(errorsParam);

      if (!errors.length) return;

      errors.forEach((field) => {
        updateFieldErrorMessage({
          formName,
          name: field,
          error: errorsParam[field]
        });

        this.fields[field].error = errorsParam[field];
      });
    }

    handleFieldChange(fieldData) {
      const field = this.fields[fieldData.name];

      let dataForMessage = fieldData;
      dataForMessage.formName = formName;

      const dataForValidator = generateDataForFormValidator(this.fields);
      const errors = validator(dataForValidator);

      if (field.touched && errors[fieldData.name]) {
        dataForMessage.meta.error = errors[fieldData.name];
      } else {
        dataForMessage.meta.error = '';
      }

      this.fields[fieldData.name] = dataForMessage.meta;

      updateFieldMetaMessage(dataForMessage);
      this.updateRestOfErrors(errors);
      this.checkFormMeta();
    }

    handleSubmit(e, customSubmitFunction) {
      e.preventDefault();
      customSubmitFunction(this.fields);
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
