import React from 'react';

import pageComponent from './page-components.png';

export const onboardingComponents = {
  'intro': () => (
    <div><h3>Welcome aboard!</h3><div>Now we will tell you a little about how EXTEND works</div></div>
  ),
  'description': () => (
    <div>
      Short description that goes over what the app does. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Maecenas venenatis purus urna, in iaculis nisl venenatis in. Pellentesque id velit turpis. Nunc ultricies, nisi
      a sagittis accumsan, quam urna tempus eros, vitae iaculis turpis urna quis est. Vivamus a augue ut diam
      hendrerit vulputate. Donec metus mi, condime
    </div>
  ),
  'address': () => (
    <div>This is your address, other users need it to send you a tip, gold, ethereum etc.</div>
  ),
  'component': () => (
    <div>
      <img src={pageComponent} alt="Page components info" />
      Desciption of tip/gold icons that are inserted + image
    </div>
  ),
  'verified': () => (
    <div>Description about Reddit username verification + link to blog post</div>
  ),
  'balance': () => (
    <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum pharetra metus id nisl</div>
  ),
  'formDescription': () => (
    <div>Desciption on what Max transaction cost means and that you can change gas price</div>
  ),
  'final': () => (
    <h3>Now you are all set to go, enjoy the app!</h3>
  )
};
