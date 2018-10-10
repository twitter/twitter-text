// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

package com.twitter.twittertext;

import junit.framework.TestCase;

public class TwitterTextParserTest extends TestCase {
  public void testparseTweetWithoutUrlExtraction() {
    assertEquals("Handle null input", 0,
        TwitterTextParser.parseTweetWithoutUrlExtraction(null).weightedLength);
    assertEquals("Handle empty input", 0,
        TwitterTextParser.parseTweetWithoutUrlExtraction("").weightedLength);
    assertEquals("Count Latin chars normally", 11,
        TwitterTextParser.parseTweetWithoutUrlExtraction("Normal Text").weightedLength);
    assertEquals("Count hashtags, @mentions and cashtags normally", 38,
        TwitterTextParser.parseTweetWithoutUrlExtraction("Text with #hashtag, @mention and $CASH")
            .weightedLength);
    assertEquals("Count CJK chars with their appropriate weights", 94,
        TwitterTextParser.parseTweetWithoutUrlExtraction("CJK Weighted chars: " +
            "あいうえおかきくけこあいうえおかきくけこあいうえおかきくけこあいうえおかき").weightedLength);
    assertEquals("URLs should be counted without transformation", 69,
        TwitterTextParser.parseTweetWithoutUrlExtraction("Text with url: " +
            "a.com http://abc.com https://longurllongurllongurl.com").weightedLength);
    assertEquals("t.co URLs should be counted without transformation", 39,
        TwitterTextParser.parseTweetWithoutUrlExtraction("Text with t.co url: https://t.co/foobar")
            .weightedLength);
  }
}
