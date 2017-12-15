import configs from './configs/index';
import getTweetLength from './getTweetLength';
import hasInvalidCharacters from './hasInvalidCharacters';

export default function (text, options=configs.defaults) {
  if (!text) {
    return 'empty';
  }

  const mergedOptions = { ...configs.defaults, ...options };
  const maxLength = mergedOptions.maxWeightedTweetLength;

  // Determine max length independent of URL length
  if (getTweetLength(text, mergedOptions) > maxLength) {
    return 'too_long';
  }

  if (hasInvalidCharacters(text)) {
    return 'invalid_characters';
  }

  return false;
}
