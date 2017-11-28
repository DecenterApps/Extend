import React from 'react';
import TypeInPasswordForm from '../../../../commonComponents/TypeInPasswordForm';
import { changeViewMessage } from '../../../../messages/permanentActionsMessages';

import './type-in-password.scss';

const TypeInPassword = () => (
  <div styleName="type-in-password-wrapper">
    <TypeInPasswordForm />

    <div styleName="import-wrapper">
      <span styleName="import" onClick={() => { changeViewMessage('importAccount'); }}>
        Unlock from recovery phrase
      </span>
    </div>
  </div>
);

export default TypeInPassword;
