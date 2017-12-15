import punycode from 'punycode';
import validAsciiDomain from '../regexp/validAsciiDomain';

const MAX_DOMAIN_LABEL_LENGTH = 63;

// This is an extremely lightweight implementation of domain name validation according to RFC 3490
// Our regexes handle most of the cases well enough
// See https://tools.ietf.org/html/rfc3490#section-4.1 for details
const idna = {
  toAscii: function(domain) {
    if (domain.startsWith('xn--') && !domain.match(validAsciiDomain)) {
      // Punycode encoded url cannot contain non ASCII characters
      return;
    }

    const labels = domain.split('.');
    const asciiLabels = [];
    for (const label of labels) {
      const punycodeEncodedLabel = punycode.toASCII(label);
      if (punycodeEncodedLabel.length < 1 || punycodeEncodedLabel.length > MAX_DOMAIN_LABEL_LENGTH) {
        // DNS label has invalid length
        return;
      }
    }
    return labels.join('.');
  }
}

export default idna;
