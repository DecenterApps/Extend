import React from 'react';
import { changeViewMessage } from '../../../../messages/userActionsMessages';

import './privacy-notice.scss';

const PrivacyNotice = () => (
  <div styleName="privacy-notice-wrapper">
    <div styleName="privacy-notice-body">
      <h2>Subtitle</h2>

      <div>
        Information You Provide. We receive and store information you enter. For example, when you search for or buy a
        product or service, or when you supply information such as your address, phone number or credit card. You can
        choose not to provide certain information, but then you might not be able to take advantage of some of our
        features. We use the information that you provide for such purposes as responding to your requests, customizing
        future shopping for you, improving our website, and communicating with you. In addition, if you opt-in, we may
        share your information with other companies who provide goods or services that you are interested in.
      </div>

      <div>
        Cookies. Like many websites, we use cookies. Cookies are small programs that we transfer to your hard drive
        that allow us to recognize you and to provide you with a customized shopping experience. If you doyou and to
        provide you with a customized shopping experience. If you do not want us to use cookies, you can easily disable
        them by going to the toolbar of your web browser, and clicking on the “help” button. Follow the instructions
        that will ide you with a browser from accepting cookies, or set the browser to inform you visit this and other
        websites anonymously through the use of utilities provided by other private companies.
      </div>
    </div>

    <button onClick={() => { changeViewMessage('createAccount', { acceptedNotice: true }); }}>
      Accept
    </button>
  </div>
);

export default PrivacyNotice;
