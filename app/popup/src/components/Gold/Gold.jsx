import React from 'react';
import PropTypes from 'prop-types';
import connect from '../../../../customRedux/connect';
import { createRedditLink, getEtherScanLinkByNetwork } from '../../../../actions/utils';

import './gold.scss';

const Gold = ({ gettingGold, gettingGoldError, sentGold, receivedGold, goldType }) => (
  <div styleName="gold-wrapper">
    {
      gettingGold &&
      <div>Getting gold</div>
    }

    {
      !gettingGold &&
      <div>
        {
          gettingGoldError &&
          <div>{ gettingGoldError }</div>
        }

        {
          !gettingGoldError &&
          <span>
            {
              goldType === 'sent' &&
              <div>
                {
                  sentGold.length > 0 &&
                  sentGold.map((gold) => (
                    <div styleName="single-gold" key={gold.to + Math.random()}>
                      <span>
                        <a
                          href={createRedditLink(gold.to)}
                          target="_blank"
                          rel="noopener"
                        >
                          /u/{ gold.to }
                        </a>
                      </span>
                      <span>{ gold.val } ETH</span>
                    </div>
                  ))
                }

                {
                  sentGold.length === 0 &&
                  <div>You did not send any gold yet</div>
                }
              </div>
            }
            {
              goldType === 'received' &&
              <div>
                {
                  receivedGold.length > 0 &&
                  receivedGold.map((gold) => (
                    <div styleName="single-gold" key={gold.from + Math.random()}>
                      <span>
                        <a
                          href={getEtherScanLinkByNetwork('kovan', gold.from)}
                          target="_blank"
                          rel="noopener"
                        >
                          { gold.from }
                        </a>
                      </span>
                      <span>{ gold.val } ETH</span>
                    </div>
                  ))
                }

                {
                  receivedGold.length === 0 &&
                  <div>You did not receive any gold yet</div>
                }
              </div>

            }
          </span>
        }
      </div>
    }
  </div>
);

Gold.propTypes = {
  receivedGold: PropTypes.array.isRequired,
  sentGold: PropTypes.array.isRequired,
  gettingGold: PropTypes.bool.isRequired,
  gettingGoldError: PropTypes.string.isRequired,
  goldType: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  receivedGold: state.user.receivedGold,
  sentGold: state.user.sentGold,
  gettingGold: state.user.gettingGold,
  gettingGoldError: state.user.gettingGoldError
});

export default connect(Gold, mapStateToProps);
