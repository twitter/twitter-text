/**
 * Copied from https://github.com/twitter/twitter-text/blob/master/js/twitter-text.js
 */
import nonBmpCodePairs from './regexp/nonBmpCodePairs';

export default function (text) {
  return text.replace(nonBmpCodePairs, ' ').length;
}
