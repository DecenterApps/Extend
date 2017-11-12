import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  addFormMessage, updateFieldMetaMessage, updateFieldErrorMessage }
  from '../messages/formsActionsMessages';
import { generateDataForFormValidator } from '../actions/utils';
import connect from '../customRedux/connect';

const createForm = (formName, WrappedComponent, validator) => {
  class Connect extends Component {
    constructor(props) {
      super(props);

      this.fields = {};
      this.formMeta = {
        invalid: false,
        pristine: true
      };

      this.state = {
        mergedProps: null
      };

      this.pendingChanges = [];

      this.registerField = this.registerField.bind(this);
      this.checkFormMeta = this.checkFormMeta.bind(this);
      this.updateMergedProps = this.updateMergedProps.bind(this);
      this.handleFieldChange = this.handleFieldChange.bind(this);
      this.updateRestOfErrors = this.updateRestOfErrors.bind(this);
      this.getFiledVal = this.getFiledVal.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.setNumOfFields = this.setNumOfFields.bind(this);
    }

    componentWillMount() {
      this.updateMergedProps();
    }

    componentWillReceiveProps(nextProps) {
      this.mergedProps = { ...this.mergedProps, ...nextProps };
      this.setState({ mergedProps: this.mergedProps });
    }

    componentDidUpdate(props) {
      if (props.forms[formName] !== undefined && this.pendingChanges.length > 0) {
        this.pendingChanges.forEach((fieldData) => {
          this.handleFieldChange(fieldData, true);
        });
        this.pendingChanges = [];
      }
    }

    getFiledVal(field) {
      if (this.fields[field] === undefined) return false;

      return this.fields[field].value;
    }

    setNumOfFields(num) {
      this.numFields = num;
    }

    updateMergedProps() {
      const formData = {
        registerField: this.registerField,
        handleFieldChange: this.handleFieldChange,
        getFiledVal: this.getFiledVal,
        setNumOfFields: this.setNumOfFields
      };

      this.mergedProps = {
        ...this.props,
        formData,
        ...this.formMeta,
        handleSubmit: this.handleSubmit
      };

      this.setState({ mergedProps: this.mergedProps });
    }

    registerField(fieldParam) {
      const field = fieldParam;

      this.fields[field.name] = field;

      if (Object.keys(this.fields).length === this.numFields) {
        addFormMessage({ name: formName, state: this.fields });
      }

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
      // Current solution for when input is loaded before the form
      if (!this.props.forms[formName]) {
        this.pendingChanges.push(fieldData);
        return;
      }

      const field = this.fields[fieldData.name];

      const dataForValidator = generateDataForFormValidator(this.fields);
      const errors = validator(dataForValidator);

      let dataForMessage = fieldData;
      dataForMessage.formName = formName;

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

    handleSubmit(e, customSubmitFunction, ...otherParams) {
      e.preventDefault();
      customSubmitFunction(this.fields, ...otherParams);
    }

    render() {
      if (this.state.mergedProps === null) {
        return <div />;
      }

      return (
        <WrappedComponent
          {...this.mergedProps}
        />
      );
    }
  }

  Connect.defaultProps = {
    forms: {}
  };

  Connect.propTypes = {
    forms: PropTypes.object
  };

  const mapStateToProps = (state) => ({
    forms: state.forms
  });

  return connect(Connect, mapStateToProps);
};

export default createForm;
