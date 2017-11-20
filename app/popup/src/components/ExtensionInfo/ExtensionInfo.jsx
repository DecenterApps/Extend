import React from 'react';

import './extension-info.scss';

const ExtensionInfo = () => (
  <div styleName="extension-info-wrapper">
    ΞXTΞND is a Chrome extension that aims to build a bridge between Ethereum blockchain and popular social websites
    such as reddit. We accomplish this by incorporating Ethereum light client into the extension while making slight
    modifications to certain web pages (such as reddit posts) in order to make extra features available to the users.
    The extension is completely open source and free to use - we don&apos;t charge any fees when you send tips or do
    anything else through ΞXTΞND.

    <div styleName="middle-section">
      ΞXTΞND has been developed by
      <a href="https://decenter.com/" target="_blank" rel="noopener noreferrer">Decenter</a>
      , a group of developers passionate about blockchain and all things decentralized.
    </div>

    <div styleName="bottom-section">
      If you notice any bugs, feel free submit an issue on our
      <a href="https://github.com/DecenterApps/Extend" target="_blank" rel="noopener noreferrer">Github repo</a>.
      If you want to get in touch for some other reason, you can drop us an email at extend@decenter.com
    </div>
  </div>
);

export default ExtensionInfo;
