import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tooltip from '../../../../commonComponents/Tooltip/Tooltip';
import connect from '../../../../customRedux/connect';
import SentIcon from '../../../../commonComponents/Decorative/SentIcon';
import ReceivedIcon from '../../../../commonComponents/Decorative/ReceivedIcon';
import RefundIcon from '../../../../commonComponents/Decorative/RefundIcon';
import { checkRefundForSentTipsMessage } from '../../../../messages/userActionsMessages';
import { changeViewMessage } from '../../../../messages/permanentActionsMessages';
import { setRefundFormValuesMessage } from '../../../../messages/accountActionMessages';
import { createRedditLink, getLinkForFrom } from '../../../../actions/utils';

import './tips.scss';

class Tips extends Component {
  componentWillMount() {
    if (!this.props.gettingTips) {
      checkRefundForSentTipsMessage();
    }
  }

  render() {
    return (
      <div styleName="tips-wrapper">
        {
          this.props.gettingTips &&
          <div>Getting tips</div>
        }

        {
          !this.props.gettingTips &&
          <div>
            {
              this.props.gettingTipsError &&
              <div>{ this.props.gettingTipsError }</div>
            }

            {
              !this.props.gettingTipsError &&
              <div>
                {
                  this.props.tips.length > 0 &&
                  !this.props.seenDash &&
                  <div styleName="info-box">
                    These are are tips you received so far. They have now been added to your balance.
                  </div>
                }

                {
                  this.props.tips.length > 0 &&
                  this.props.tips.map((tip, i) => (
                    <div
                      styleName={`single-tip ${(this.props.tips.length - 1) === i ? 'last' : ''}`}
                      key={tip.to + Math.random()}
                    >
                      {
                        (tip.type === 'sent') &&
                        <span styleName="content-wrapper">
                          <span styleName="info">
                            <SentIcon />
                            <a
                              href={createRedditLink(tip.to)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              /u/{ tip.to }
                            </a>
                          </span>
                          <span styleName="val-section">
                            { tip.val } ETH
                            {
                              tip.refund &&
                              <span
                                styleName="refund-btn"
                                onClick={() => {
                                  changeViewMessage('refund');
                                  setRefundFormValuesMessage(tip.to);
                                }}
                              >
                                <Tooltip
                                  content="You can reclaim this tip because
                                      the recipient has not claimed it for more than two weeks."
                                  useDefaultStyles
                                >
                                  <RefundIcon />
                                </Tooltip>
                              </span>
                            }
                          </span>
                        </span>
                      }
                      {
                        (tip.type === 'received') &&
                        <span styleName="content-wrapper">
                          <span styleName="info">
                            <ReceivedIcon />
                            <a
                              href={getLinkForFrom(tip.from)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              { tip.from }
                            </a>
                          </span>
                          <span>{ tip.val } ETH</span>
                        </span>
                      }
                    </div>
                  ))
                }

                {
                  this.props.tips.length === 0 &&
                  <div>
                    <div styleName="info-line">You did not send or receive any tips yet.</div>
                    It might take a minute or two until new transactions are displayed.
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>
    );
  }
}

Tips.propTypes = {
  tips: PropTypes.array.isRequired,
  gettingTips: PropTypes.bool.isRequired,
  gettingTipsError: PropTypes.string.isRequired,
  seenDash: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  tips: state.user.tips,
  gettingTips: state.user.gettingTips,
  gettingTipsError: state.user.gettingTipsError,
  seenDash: state.permanent.seenDash
});

export default connect(Tips, mapStateToProps);
