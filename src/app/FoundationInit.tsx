'use client';

import { useEffect } from 'react';

const FoundationInit = () => {
  useEffect(() => {
    // Use dynamic import to ensure jQuery and Foundation JS are loaded only on the client side.
    import('jquery').then(($) => {
      const jQuery = $.default as any;
      // @ts-ignore
      window.jQuery = jQuery;
      // require() is needed for modules that are not ES6 compatible.
      require('foundation-sites/dist/js/foundation.min.js');
      // Initialize Foundation
      jQuery(document).foundation();
    });
  }, []);

  return null;
};

export default FoundationInit;
