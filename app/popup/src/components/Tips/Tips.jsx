import React from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import SentIcon from '../../../../commonComponents/Decorative/SentIcon';
import ReceivedIcon from '../../../../commonComponents/Decorative/ReceivedIcon';
import { changeViewMessage } from '../../../../messages/userActionsMessages';
import { createRedditLink, getEtherScanLinkByNetwork } from '../../../../actions/utils';

import './tips.scss';

// {
//   tipsType === 'sent' &&
//   <div styleName="refund-btn" onClick={() => { changeViewMessage('refund'); }}>
//     Refund tip
//   </div>
// }

const Tips = ({ gettingTips, gettingTipsError, tips }) => (
  <div styleName="tips-wrapper">
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
          <div>
            {
              tips.length > 0 &&
              tips.map((tip, i) => (
                <div
                  styleName={`single-tip ${(tips.length - 1) === i ? 'last' : ''}`}
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
                          rel="noopener"
                        >
                          /u/{ tip.to }
                        </a>
                      </span>
                      <span>{ tip.val } ETH</span>
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
                          rel="noopener"
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
              tips.length === 0 &&
              <div>You did not send or receive any tips yet</div>
            }
          </div>
        }
      </div>
    }
  </div>
);

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
