import React from 'react';
import PropTypes from 'prop-types';
import SentIcon from '../../../../commonComponents/Decorative/SentIcon';
import ReceivedIcon from '../../../../commonComponents/Decorative/ReceivedIcon';
import connect from '../../../../customRedux/connect';
import { createRedditLink, getLinkForFrom } from '../../../../actions/utils';

import './gold.scss';

const Gold = ({ gettingGold, gettingGoldError, golds }) => (
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
          <div>
            {
              golds.length > 0 &&
              golds.map((gold, i) => (
                <div
                  styleName={`single-gold ${(golds.length - 1) === i ? 'last' : ''}`}
                  key={gold.to + Math.random()}
                >
                  {
                    (gold.type === 'sent') &&
                    <span styleName="content-wrapper">
                      <div styleName="info">
                        <SentIcon />
                        <a
                          href={createRedditLink(gold.to)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          /u/{ gold.to }
                        </a>
                      </div>

                      <div styleName="val-section">{ gold.months } { gold.months === '1' ? 'Month' : 'Months' }</div>
                    </span>
                  }
                  {
                    (gold.type === 'received') &&
                    <span styleName="content-wrapper">
                      <div styleName="info">
                        <ReceivedIcon />
                        <a
                          href={getLinkForFrom(gold.to)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          /u/{ gold.from }
                        </a>
                      </div>

                      <div styleName="val-section">{ gold.months } { gold.months === '1' ? 'Month' : 'Months' }</div>
                    </span>
                  }
                </div>
              ))
            }

            {
              golds.length === 0 &&
              <div>
                <div styleName="info-line">You did not send or receive any gold yet.</div>
                It might take a minute or two until new transactions are displayed.
              </div>
            }
          </div>
        }
      </div>
    }
  </div>
);

Gold.propTypes = {
  golds: PropTypes.array.isRequired,
  gettingGold: PropTypes.bool.isRequired,
  gettingGoldError: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  golds: state.user.golds,
  gettingGold: state.user.gettingGold,
  gettingGoldError: state.user.gettingGoldError
});

export default connect(Gold, mapStateToProps);
