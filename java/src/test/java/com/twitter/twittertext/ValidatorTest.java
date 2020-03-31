// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

package com.twitter.twittertext;

import junit.framework.TestCase;

@SuppressWarnings("deprecation")
public class ValidatorTest extends TestCase {
  protected Validator validator = new Validator();

  public void testBOMCharacter() {
    assertFalse(validator.isValidTweet("test \uFFFE"));
    assertFalse(validator.isValidTweet("test \uFEFF"));
  }

  public void testInvalidCharacter() {
    assertFalse(validator.isValidTweet("test \uFFFF"));
    assertFalse(validator.isValidTweet("test \uFEFF"));
  }

  public void testDirectionChangeCharacters() {
    assertTrue(validator.isValidTweet("test \u202A test"));
    assertTrue(validator.isValidTweet("test \u202B test"));
    assertTrue(validator.isValidTweet("test \u202C test"));
    assertTrue(validator.isValidTweet("test \u202D test"));
    assertTrue(validator.isValidTweet("test \u202E test"));
    assertTrue(validator.isValidTweet("test \u202F test"));
  }

  public void testAccentCharacters() {
    String c = "\u0065\u0301";
    StringBuilder builder = new StringBuilder();
    for (int i = 0; i < 279; i++) {
      builder.append(c);
    }
    assertTrue(validator.isValidTweet(builder.toString()));
    assertTrue(validator.isValidTweet(builder.append(c).toString()));
    assertFalse(validator.isValidTweet(builder.append(c).toString()));
  }

  public void testMutiByteCharacters() {
    String c = "\ud83d\ude02";
    StringBuilder builder = new StringBuilder();
    for (int i = 0; i < 139; i++) {
      builder.append(c);
    }
    assertTrue(validator.isValidTweet(builder.toString()));
    assertTrue(validator.isValidTweet(builder.append(c).toString()));
    assertFalse(validator.isValidTweet(builder.append(c).toString()));
  }

  public void testValidHashtags() {
    assertTrue(validator.isValidHashtag("#test"));
    assertTrue(validator.isValidHashtag("#\u53F0\u7063"));
  }

  public void testInvalidHashtags() {
    assertFalse(validator.isValidHashtag("#test #test"));
    assertFalse(validator.isValidHashtag("#test test"));
    assertFalse(validator.isValidHashtag("#test,test"));
    assertFalse(validator.isValidHashtag("test"));
    assertFalse(validator.isValidHashtag(null));
  }
}
