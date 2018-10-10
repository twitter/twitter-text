// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import clone from './lib/clone';
import htmlEscape from './htmlEscape';
import rtlChars from './regexp/rtlChars';
import linkToTextWithSymbol from './linkToTextWithSymbol';

export default function(entity, text, options) {
  const hash = text.substring(entity.indices[0], entity.indices[0] + 1);
  const hashtag = htmlEscape(entity.hashtag);
  const attrs = clone(options.htmlAttrs || {});
  attrs.href = options.hashtagUrlBase + hashtag;
  attrs.title = `#${hashtag}`;
  attrs['class'] = options.hashtagClass;
  if (hashtag.charAt(0).match(rtlChars)) {
    attrs['class'] += ' rtl';
  }
  if (options.targetBlank) {
    attrs.target = '_blank';
  }

  return linkToTextWithSymbol(entity, hash, hashtag, attrs, options);
}
