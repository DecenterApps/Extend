import React from 'react';
import PropTypes from 'prop-types';
import { copiedSeedMessage } from '../../../../messages/accountActionMessages';

import './copy-seed.scss';

const CopySeed = ({ seed }) => (
  <div styleName="copy-seed-wrapper">
    <div styleName="copy-seed-content">
      <textarea name="seed" value={seed} readOnly />

      <button onClick={copiedSeedMessage}>
        I have saved the recovery phrase
      </button>
    </div>
  </div>
);

CopySeed.propTypes = {
  seed: PropTypes.string.isRequired
};

export default CopySeed;
