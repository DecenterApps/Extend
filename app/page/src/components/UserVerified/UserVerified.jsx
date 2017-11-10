import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '../../../../commonComponents/Tooltip/Tooltip';
import VerifiedIcon from '../../../../commonComponents/Decorative/VerifiedIcon';

import '../../../../commonComponents/pageIcons.scss';

const UserVerified = ({ isVerified }) => (
  <span styleName="icon-wrapper verify-icon">
    <Tooltip
      content={`User is ${isVerified ? 'verified' : 'not verified'} in Extend`}
      useDefaultStyles
    >
      <VerifiedIcon isVerified={isVerified} />
    </Tooltip>
  </span>
);

UserVerified.propTypes = {
  isVerified: PropTypes.bool.isRequired,
};

export default UserVerified;
