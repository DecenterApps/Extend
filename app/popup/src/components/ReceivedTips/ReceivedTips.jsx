import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import { getReceivedTipsMessage } from '../../../../messages/userActionsMessages';

import '../SentTips/tips.scss';

class SentTips extends Component {
  componentWillMount() {
    getReceivedTipsMessage();
  }

  render() {
    return(
      <div styleName="tips-wrapper">
        {
          this.props.gettingReceivedTips &&
          <div>Getting received tips</div>
        }

        {
          !this.props.gettingReceivedTips &&
          <div>
            {
              this.props.gettingReceivedTipsError &&
              <div>{ this.props.gettingReceivedTipsError }</div>
            }

            {
              !this.props.gettingReceivedTipsError &&
              <div>
                {
                  this.props.receivedTips.length > 0 &&
                  this.props.receivedTips.map((tip) => (
                    <div styleName="single-tip" key={tip.to + Math.random()}>
                      <span>{ tip.from }</span>
                      <span>{ tip.val } ETH</span>
                    </div>
                  ))
                }

                {
                  this.props.receivedTips.length === 0 &&
                  <div>You did not send any tips yet</div>
                }
              </div>
            }
          </div>
        }
      </div>
    );
  }
}

SentTips.propTypes = {
  receivedTips: PropTypes.array.isRequired,
  gettingReceivedTips: PropTypes.bool.isRequired,
  gettingReceivedTipsError: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  receivedTips: state.user.sentTips,
  gettingReceivedTips: state.user.gettingSentTips,
  gettingReceivedTipsError: state.user.gettingSentTipsError
});

export default connect(SentTips, mapStateToProps);
