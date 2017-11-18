import React from 'react';
import PropTypes from 'prop-types';
import { copiedSeedMessage } from '../../../../messages/permanentActionsMessages';

import './copy-seed.scss';

const CopySeed = ({ seed, copiedSeed }) => (
  <div styleName="copy-seed-wrapper">
    <div styleName="copy-seed-content">
      <textarea name="seed" value={seed} readOnly />

      {
        !copiedSeed &&
        <button onClick={copiedSeedMessage}>
          I have saved the recovery phrase
        </button>
      }
    </div>
  </div>
);

CopySeed.propTypes = {
  seed: PropTypes.string.isRequired,
  copiedSeed: PropTypes.bool.isRequired
};

export default CopySeed;
