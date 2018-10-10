// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

package com.twitter.twittertext;

import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;

import junit.framework.TestCase;

public class TwitterTextEmojiRegexTest extends TestCase {
  public void testEmojiUnicode10() {
    final Matcher matcher = TwitterTextEmojiRegex.VALID_EMOJI_PATTERN
        .matcher("Unicode 10.0; grinning face with one large and one small eye: 🤪;" +
            " woman with headscarf: 🧕;" +
            " (fitzpatrick) woman with headscarf + medium-dark skin tone: 🧕🏾;" +
            " flag (England): 🏴󠁧󠁢󠁥󠁮󠁧󠁿");
    final List<String> expected = Arrays.asList("🤪", "🧕", "🧕🏾", "🏴󠁧󠁢󠁥󠁮󠁧󠁿");

    int count = 0;
    while (matcher.find()) {
      assertEquals(expected.get(count), matcher.group());
      count++;
    }
    assertEquals(expected.size(), count);
  }

  public void testEmojiUnicode9() {
    final Matcher matcher = TwitterTextEmojiRegex.VALID_EMOJI_PATTERN
        .matcher("Unicode 9.0; face with cowboy hat: 🤠;" +
            "woman dancing: 💃, woman dancing + medium-dark skin tone: 💃🏾");
    final List<String> expected = Arrays.asList("🤠", "💃", "💃🏾");

    int count = 0;
    while (matcher.find()) {
      assertEquals(expected.get(count), matcher.group());
      count++;
    }
    assertEquals(expected.size(), count);
  }
}
