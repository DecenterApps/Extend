import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { updateFieldMetaMessage } from '../messages/formsActionsMessages';

const createField = (WrappedComponent, parentForm, registerField) => {
  class Field extends Component {
    constructor(props) {
      super(props);

      this.handleChange = this.handleChange.bind(this);

      this.meta = {
        value: '',
        error: '',
        touched: false
      };

      this.input = {
        onInput: this.handleChange
      };

      this.updateMergedProps = this.updateMergedProps.bind(this);
      this.updateMergedProps();
    }

    componentDidMount() {
      this.updateMergedProps();

      this.meta.name = this.props.name;
      registerField(this.meta);
      delete this.meta.name;
    }

    updateMergedProps() {
      this.mergedProps = { ...this.props, input: this.input, meta: this.meta };
    }

    handleChange(input) {
      if (!this.meta.touched) this.meta.touched = true;

      this.meta.value = input.target.value;

      this.updateMergedProps();
      updateFieldMetaMessage({
        name: this.props.name,
        formName: parentForm,
        meta: this.meta
      });
    }

    render() {
      return (
        <WrappedComponent
          {...this.mergedProps}
        />
      );
    }
  }

  Field.propTypes = {
    name: PropTypes.string.isRequired
  };

  return Field;
};

export default createField;
