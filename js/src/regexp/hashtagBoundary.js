import codePoint from './codePoint';
import hashtagAlphaNumeric from './hashtagAlphaNumeric';
import regexSupplant from '../lib/regexSupplant';

const hashtagBoundary = regexSupplant(
  /(?:^|\uFE0E|\uFE0F|$|(?!#{hashtagAlphaNumeric}|&)#{codePoint})/,
  { codePoint, hashtagAlphaNumeric }
);

export default hashtagBoundary;
