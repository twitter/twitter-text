// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

package com.twitter.twittertext;

import java.util.List;

import junit.framework.TestCase;

public class TwitterTextConfigurationTest extends TestCase {

  public void testDefaultVersion() {
    final TwitterTextConfiguration configuration =
        TwitterTextConfiguration.getDefaultConfig();
    assertEquals(configuration.getVersion(), 3);
    assertEquals(configuration.getMaxWeightedTweetLength(), 280);
    assertEquals(configuration.getScale(), 100);
    assertEquals(configuration.getDefaultWeight(), 200);
    assertTrue(configuration.getEmojiParsingEnabled());
    assertEquals(configuration.getTransformedURLLength(), 23);
    final List<TwitterTextConfiguration.TwitterTextWeightedRange> ranges =
        configuration.getRanges();
    assertNotNull(ranges);
    assertEquals(ranges.size(), 4);
    final TwitterTextConfiguration.TwitterTextWeightedRange latinCharRange = ranges.get(0);
    assertEquals(latinCharRange.getRange(), new Range(0, 4351));
    assertEquals(latinCharRange.getWeight(), 100);
    final TwitterTextConfiguration.TwitterTextWeightedRange spacesGeneralPunctuationBlock =
        ranges.get(1);
    assertEquals(spacesGeneralPunctuationBlock.getRange(), new Range(8192, 8205));
    assertEquals(spacesGeneralPunctuationBlock.getWeight(), 100);
    final TwitterTextConfiguration.TwitterTextWeightedRange visibleGeneralPunctuationBlock1 =
        ranges.get(2);
    assertEquals(visibleGeneralPunctuationBlock1.getRange(), new Range(8208, 8223));
    assertEquals(visibleGeneralPunctuationBlock1.getWeight(), 100);
    final TwitterTextConfiguration.TwitterTextWeightedRange visibleGeneralPunctuationBlock2 =
        ranges.get(3);
    assertEquals(visibleGeneralPunctuationBlock2.getRange(), new Range(8242, 8247));
    assertEquals(visibleGeneralPunctuationBlock2.getWeight(), 100);
  }
}
