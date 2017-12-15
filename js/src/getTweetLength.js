import configs from './configs/index';
import extractUrlsWithIndices from './extractUrlsWithIndices';
import getCharacterWeight from './lib/getCharacterWeight';
import modifyIndicesFromUTF16ToUnicode from './modifyIndicesFromUTF16ToUnicode';
import nonBmpCodePairs from './regexp/nonBmpCodePairs';
import parseTweet from './parseTweet';
import urlHasHttps from './regexp/urlHasHttps';

const getTweetLength = function (text, options = configs.defaults) {
  return parseTweet(text, options).weightedLength;
};

export default getTweetLength;
