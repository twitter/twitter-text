// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import configs from './configs';
import extractUrlsWithIndices from './extractUrlsWithIndices';
import getCharacterWeight from './lib/getCharacterWeight';
import modifyIndicesFromUTF16ToUnicode from './modifyIndicesFromUTF16ToUnicode';
import nonBmpCodePairs from './regexp/nonBmpCodePairs';
import parseTweet from './parseTweet';
import urlHasHttps from './regexp/urlHasHttps';

const getTweetLength = function(text, options = configs.defaults) {
  return parseTweet(text, options).weightedLength;
};

export default getTweetLength;
