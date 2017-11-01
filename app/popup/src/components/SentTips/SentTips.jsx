import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import { getSentTipsMessage, changeViewMessage } from '../../../../messages/userActionsMessages';

import './tips.scss';

class SentTips extends Component {
  componentWillMount() {
    getSentTipsMessage();
  }

  render() {
    return(
      <div styleName="tips-wrapper">
        <div styleName="refund-btn" onClick={() => { changeViewMessage('refund'); }}>
          Refund tip
        </div>
        {
          this.props.gettingSentTips &&
          <div>Getting sent tips</div>
        }

        {
          !this.props.gettingSentTips &&
          <div>
            {
              this.props.gettingSentTipsError &&
              <div>{ this.props.gettingSentTipsError }</div>
            }

            {
              !this.props.gettingSentTipsError &&
              <div>
                {
                  this.props.sentTips.length > 0 &&
                  this.props.sentTips.map((tip) => (
                    <div styleName="single-tip" key={tip.to + Math.random()}>
                      <span>{ tip.to }</span>
                      <span>{ tip.val } ETH</span>
                    </div>
                  ))
                }

                {
                  this.props.sentTips.length === 0 &&
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
  sentTips: PropTypes.array.isRequired,
  gettingSentTips: PropTypes.bool.isRequired,
  gettingSentTipsError: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  sentTips: state.user.sentTips,
  gettingSentTips: state.user.gettingSentTips,
  gettingSentTipsError: state.user.gettingSentTipsError
});

export default connect(SentTips, mapStateToProps);
