import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'react-tooltip-lite';
import connect from '../../../../customRedux/connect';
import SentIcon from '../../../../commonComponents/Decorative/SentIcon';
import ReceivedIcon from '../../../../commonComponents/Decorative/ReceivedIcon';
import RefundIcon from '../../../../commonComponents/Decorative/RefundIcon';
import { checkRefundForSentTipsMessage, changeViewMessage } from '../../../../messages/userActionsMessages';
import { createRedditLink, getEtherScanLinkByNetwork } from '../../../../actions/utils';

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
                                  changeViewMessage('refund', { refundTipIndex: i, refundTipUsername: tip.to });
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
                              href={getEtherScanLinkByNetwork('kovan', tip.from)}
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
                    You did not send or receive any tips yet <br />
                    (It might take a minute or two until new transactions are displayed)
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
};

const mapStateToProps = (state) => ({
  tips: state.user.tips,
  gettingTips: state.user.gettingTips,
  gettingTipsError: state.user.gettingTipsError
});

export default connect(Tips, mapStateToProps);
