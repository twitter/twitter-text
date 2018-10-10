// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import punycode from 'punycode';
import validAsciiDomain from '../regexp/validAsciiDomain';

const MAX_DOMAIN_LABEL_LENGTH = 63;
const PUNYCODE_ENCODED_DOMAIN_PREFIX = 'xn--';
// This is an extremely lightweight implementation of domain name validation according to RFC 3490
// Our regexes handle most of the cases well enough
// See https://tools.ietf.org/html/rfc3490#section-4.1 for details
const idna = {
  toAscii: function(domain) {
    if (domain.substring(0, 4) === PUNYCODE_ENCODED_DOMAIN_PREFIX && !domain.match(validAsciiDomain)) {
      // Punycode encoded url cannot contain non ASCII characters
      return;
    }

    const labels = domain.split('.');
    for (let i = 0; i < labels.length; i++) {
      const label = labels[i];
      const punycodeEncodedLabel = punycode.toASCII(label);
      if (punycodeEncodedLabel.length < 1 || punycodeEncodedLabel.length > MAX_DOMAIN_LABEL_LENGTH) {
        // DNS label has invalid length
        return;
      }
    }
    return labels.join('.');
  }
};

export default idna;
