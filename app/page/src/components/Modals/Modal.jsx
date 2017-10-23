import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './modals.scss';

class Modal extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { children: null, show: null };
  }

  componentWillMount() {
    document.addEventListener('keydown', (event) => {
      if (event.keyCode === 27) this.props.closeModal();
    });
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.modalOpen && (this.state.children !== null)) {
      setTimeout(() => { this.setState({ show: null }); }, 300);
      return setTimeout(() => { this.setState({ children: null }); }, 450);
    }

    return this.setState({ children: newProps.children, show: true });
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.props.closeModal);
  }

  render() {
    return (
      <div
        styleName={`modal-backdrop ${this.state.show ? 'open' : ''}`}
        role="button"
        tabIndex={0}
        onClick={() => { this.props.closeModal(); }}
      >
        <div
          role="dialog"
          styleName="modal"
          onClick={(e) => { e.stopPropagation(); }}
        >
          {this.state.children}
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  closeModal: PropTypes.func.isRequired
};

export default Modal;
