import React from 'react';

import pageComponentsUnveried from './page-components-unverified.png';
import pageComponentVerified from './page-components-verified.png';

export const onboardingComponents = {
  'intro': () => (
    <div>
      <h3>Welcome aboard!</h3>
      <div>Let us give you a quick tour and demonstrate how ΞXTΞND works.</div>
    </div>
  ),
  'description': () => (
    <div>
      ΞXTΞND is a Chrome extension that aims to build a bridge between Ethereum blockchain and popular social websites
      such as Reddit. We accomplish this by incorporating Ethereum light client into the extension while making slight
      modifications to certain web pages (such as Reddit posts) in order to make extra features available to the users.
      In this initial release, the extension allows you to send one-click tips to other Reddit users or buy them gold
      with ETH directly.
    </div>
  ),
  'address': () => (
    <div>This is an address associeted with the Ethereum wallet that we have created for you. You can load it by
      sending Eher to it.</div>
  ),
  'component': () => (
    <div>
      <img src={pageComponentsUnveried} alt="Page components info" />
      <p>
        As you can see in the image above, ΞXTΞND will add some extra options to Reddit posts. This example shows a
        post from a user that has not installed ΞXTΞND yet, but whom you can still tip. He will then be notified about
        the tip via Reddit private message and able to claim the tip after installing the extension and verifying his
        username
      </p>

      <img src={pageComponentVerified} alt="Page components info" />
      <p>
        This image shows a post from verified ΞXTΞND user. The tips send to this user will go to his wallet directly.
      </p>
    </div>
  ),
  'verified': () => (
    <p>
      Although you can start sending tips as soon as you load your ΞXTΞND wallet, in order to receive tips you will
      need to link your Reddit username to your wallet&apos;s Ethereum address. This is somewhat complex but safe
      process which combines Reddit OAuth, Ethereum smart contract and Oraclize service in order to ensure that you are
      the true owner of your Reddit username. If you want to read more details, our [blog post] goes in depth on this
      procedure.
    </p>
  ),
  'formDescription': () => (
    <div>
      We made gas price flexible, so that if you are not in a rush you can pay smaller fee and wait a bit longer for
      your transactions to get confirmed. Maximum transaction cost show the full amount that will be deducted from your
      wallet. This includes tip amount or gold price and transaction fee (potentially including Oraclize fee as well).
    </div>
  ),
  'final': () => (
    <h2>Now that you have seen how everything works, you can try it out for yourself. Happy tipping! :)</h2>
  )
};
