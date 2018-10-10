// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

package com.twitter.twittertext;

import java.util.List;

import junit.framework.TestCase;

public class TwitterTextConfigurationTest extends TestCase {

  public void testDefaultVersion() {
    assertEquals(TwitterTextConfiguration.configurationFromJson("", false),
        TwitterTextConfiguration.configurationFromJson("v2.json", true));
  }

  public void testInvalidJsonPathDoesntCrash() {
    assertEquals(TwitterTextConfiguration.configurationFromJson("unknown", true),
        TwitterTextConfiguration.configurationFromJson("v2.json", true));
  }

  public void testJsonAsString() {
    final TwitterTextConfiguration configuration =
        TwitterTextConfiguration.configurationFromJson("{\"version\": 1, " +
            "\"maxWeightedTweetLength\": 30, \"scale\": 1, \"defaultWeight\": 1, " +
            "\"transformedURLLength\": 14, \"ranges\": [{\"start\": 0, \"end\": 4351, " +
            "\"weight\": 2}]}", false);
    assertEquals(configuration.getVersion(), 1);
    assertEquals(configuration.getMaxWeightedTweetLength(), 30);
    assertEquals(configuration.getScale(), 1);
    assertEquals(configuration.getDefaultWeight(), 1);
    assertEquals(configuration.getTransformedURLLength(), 14);
    final List<TwitterTextConfiguration.TwitterTextWeightedRange> ranges =
        configuration.getRanges();
    assertNotNull(ranges);
    assertEquals(ranges.size(), 1);
    final TwitterTextConfiguration.TwitterTextWeightedRange latinCharRange = ranges.get(0);
    assertEquals(latinCharRange.getRange(), new Range(0, 4351));
    assertEquals(latinCharRange.getWeight(), 2);
  }

  public void testVersion1() {
    final TwitterTextConfiguration configuration =
        TwitterTextConfiguration.configurationFromJson("v1.json", true);
    assertEquals(configuration.getVersion(), 1);
    assertEquals(configuration.getMaxWeightedTweetLength(), 140);
    assertEquals(configuration.getScale(), 1);
    assertEquals(configuration.getDefaultWeight(), 1);
    assertEquals(configuration.getTransformedURLLength(), 23);
    assertEquals(configuration.getRanges().size(), 0);
  }

  public void testVersion2() {
    final TwitterTextConfiguration configuration =
        TwitterTextConfiguration.configurationFromJson("v2.json", true);
    assertEquals(configuration.getVersion(), 2);
    assertEquals(configuration.getMaxWeightedTweetLength(), 280);
    assertEquals(configuration.getScale(), 100);
    assertEquals(configuration.getDefaultWeight(), 200);
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
