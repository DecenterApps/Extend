import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);

    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', () => {
      this.props.dispatch(count());
    });

    $('.flat-list.buttons')
      .css({
        cursor: 'pointer'
      })
      .on('click', this.sendMessage);
  }

  sendMessage() {
    console.log('TIP');
  }

  render() {
    return (
      <div>
        Count: {this.props.count}
      </div>
    );
  }
}

export default App;
