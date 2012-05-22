package com.twitter;

import junit.framework.TestCase;

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
    assertFalse(validator.isValidTweet("test \u202A test"));
    assertFalse(validator.isValidTweet("test \u202B test"));
    assertFalse(validator.isValidTweet("test \u202C test"));
    assertFalse(validator.isValidTweet("test \u202D test"));
    assertFalse(validator.isValidTweet("test \u202E test"));
  }

  public void testAccentCharacters() {
    String c = "\u0065\u0301";
    StringBuilder builder = new StringBuilder();
    for (int i = 0; i < 139; i++) {
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
}
