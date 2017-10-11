import React from 'react';
import { acceptPrivacyNoticeMessage } from '../../../../messages/userActionsMessages';

import './privacy-notice.scss';

const PrivacyNotice = () => (
  <div styleName="privacy-notice-wrapper">
    <div styleName="privacy-notice-header">
      <div>Privacy Notice</div>
      <div>Release Date</div>
    </div>

    <div styleName="privacy-notice-body">
      <div>Reddapp is beta software.</div>

      <div>
        When you log in to Reddapp, your current account is visible to every new site you visit.
      </div>
      <div>
        For your privacy, for now, please sign out of Reddapp when you are done using a site.
      </div>
      <div>
        Also, by default, you will be signed in to a test network. To use real Ether,
        you must connect to the main network manually in the top left network menu.
      </div>
    </div>

    <span styleName="privacy-notice-submit">
      <button onClick={acceptPrivacyNoticeMessage}>
        Accept
      </button>
    </span>
  </div>
);

export default PrivacyNotice;
