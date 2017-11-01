import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import { getReceivedTipsMessage } from '../../../../messages/userActionsMessages';
import { createRedditLink } from '../../../../actions/utils';

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
                    <div styleName="single-tip" key={tip.from + Math.random()}>
                      <span>
                        <a
                          href={createRedditLink(tip.from)}
                          target="_blank"
                          rel="noopener"
                        >
                          /u/{ tip.from }
                        </a>
                      </span>
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
  receivedTips: state.user.receivedTips,
  gettingReceivedTips: state.user.gettingReceivedTips,
  gettingReceivedTipsError: state.user.gettingReceivedTipsError
});

export default connect(SentTips, mapStateToProps);
