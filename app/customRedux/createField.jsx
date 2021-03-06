import React, { Component } from 'react';
import PropTypes from 'prop-types';

const createField = (WrappedComponent, formData, optional = false) => {
  class Field extends Component {
    constructor(props) {
      super(props);

      this.handleChange = this.handleChange.bind(this);
      this.handleBlur = this.handleBlur.bind(this);

      this.meta = {
        value: '',
        error: '',
        touched: false,
        optional
      };

      this.input = {
        onBlur: this.handleBlur,
        onChange: this.handleChange
      };

      this.updateMergedProps = this.updateMergedProps.bind(this);
      this.updateMergedProps();
    }

    componentWillMount() {
      if (this.props.value !== '') {
        this.meta.value = this.props.value;
        this.meta.touched = true;
      }

      this.meta.name = this.props.name;
      formData.registerField(this.meta);
      delete this.meta.name;

      this.updateMergedProps();
    }

    updateMergedProps() {
      this.mergedProps = { ...this.props, input: this.input, meta: this.meta };
    }

    handleBlur() {
      this.meta.touched = true;
      this.updateMergedProps();

      formData.handleFieldChange({
        name: this.props.name,
        meta: this.meta
      });
    }

    handleChange(input) {
      if (input.target.type === 'checkbox') {
        this.meta.value = input.target.checked;
      } else {
        this.meta.value = input.target.value;
      }

      this.updateMergedProps();

      formData.handleFieldChange({
        name: this.props.name,
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

  Field.defaultProps = {
    value: '',
  };

  Field.propTypes = {
    value: PropTypes.any,
    name: PropTypes.string.isRequired,
  };

  return Field;
};

export default createField;
