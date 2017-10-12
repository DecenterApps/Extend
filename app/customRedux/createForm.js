import React, { Component } from 'react';

const createForm = (formName, WrappedComponent) => (
  class Connect extends Component {
    constructor(props) {
      super(props);

      this.state = {};
    }

    componentDidMount() {
      console.log('WRAPPED COMPONENT', WrappedComponent);
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

export default createForm;
