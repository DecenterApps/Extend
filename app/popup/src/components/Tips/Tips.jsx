import React from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import { changeViewMessage } from '../../../../messages/userActionsMessages';
import { createRedditLink, getEtherScanLinkByNetwork } from '../../../../actions/utils';

import './tips.scss';

const Tips = ({ gettingTips, gettingTipsError, sentTips, receivedTips, tipsType }) => (
  <div styleName="tips-wrapper">
    {
      tipsType === 'sent' &&
      <div styleName="refund-btn" onClick={() => { changeViewMessage('refund'); }}>
        Refund tip
      </div>
    }

    {
      gettingTips &&
      <div>Getting tips</div>
    }

    {
      !gettingTips &&
      <div>
        {
          gettingTipsError &&
          <div>{ gettingTipsError }</div>
        }

        {
          !gettingTipsError &&
          <span>
            {
              tipsType === 'sent' &&
              <div>
                {
                  sentTips.length > 0 &&
                  sentTips.map((tip) => (
                    <div styleName="single-tip" key={tip.to + Math.random()}>
                      <span>
                        <a
                          href={createRedditLink(tip.to)}
                          target="_blank"
                          rel="noopener"
                        >
                          /u/{ tip.to }
                        </a>
                      </span>
                      <span>{ tip.val } ETH</span>
                    </div>
                  ))
                }

                {
                  sentTips.length === 0 &&
                  <div>You did not send any tips yet</div>
                }
              </div>
            }
            {
              tipsType === 'received' &&
              <div>
                {
                  receivedTips.length > 0 &&
                  receivedTips.map((tip) => (
                    <div styleName="single-tip" key={tip.from + Math.random()}>
                      <span>
                        <a
                          href={getEtherScanLinkByNetwork('kovan', tip.from)}
                          target="_blank"
                          rel="noopener"
                        >
                          { tip.from }
                        </a>
                      </span>
                      <span>{ tip.val } ETH</span>
                    </div>
                  ))
                }

                {
                  receivedTips.length === 0 &&
                  <div>You did not send any tips yet</div>
                }
              </div>

            }
          </span>
        }
      </div>
    }
  </div>
);

Tips.propTypes = {
  receivedTips: PropTypes.array.isRequired,
  sentTips: PropTypes.array.isRequired,
  gettingTips: PropTypes.bool.isRequired,
  gettingTipsError: PropTypes.string.isRequired,
  tipsType: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  receivedTips: state.user.receivedTips,
  sentTips: state.user.sentTips,
  gettingTips: state.user.gettingTips,
  gettingTipsError: state.user.gettingTipsError
});

export default connect(Tips, mapStateToProps);
