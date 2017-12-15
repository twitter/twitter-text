import isInvalidTweet from './isInvalidTweet';

export default function (text, options) {
  return !isInvalidTweet(text, options);
}
