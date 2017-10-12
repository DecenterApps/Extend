import React, { Component } from 'react';
// import PropTypes from 'prop-types';

const createField = (WrappedComponent, fieldOptions) => (
  class Connect extends Component {
    constructor(props) {
      super(props);

      this.state = {};
    }

    componentDidMount() {
      console.log('FIELD', WrappedComponent);
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
        />
      );
    }
  }
);

export default createField;
