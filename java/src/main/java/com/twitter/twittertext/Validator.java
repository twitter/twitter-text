// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

package com.twitter.twittertext;

import java.util.List;

/**
 * A class for validating Tweet texts.
 */
public class Validator {
  public static final int MAX_TWEET_LENGTH = 280;

  protected int shortUrlLength = 23;
  protected int shortUrlLengthHttps = 23;

  private Extractor extractor = new Extractor();

  /**
   * Returns the weighted length of a given tweet text
   *
   * @param tweetText the source to mark as modified.
   * @return length of a tweet
   * @deprecated Use TwitterTextParser
   */
  @Deprecated
  public int getTweetLength(String tweetText) {
    return TwitterTextParser.parseTweet(tweetText).weightedLength;
  }

  /**
   * Checks if a given tweet text is valid.
   * @deprecated Use TwitterTextParser
   */
  @Deprecated
  public boolean isValidTweet(String text) {
    return TwitterTextParser.parseTweet(text).isValid;
  }

  /**
   * Checks if a given text is a valid hashtag.
   *
   * @param text text to validate
   * @return whether the text is a valid hashtag or not
   */
  public boolean isValidHashtag(String text) {
    if (text == null) {
      return false;
    }

    Extractor extractor = new Extractor();
    List<String> extracted = extractor.extractHashtags(text);

    // Should extract the hashtag minus the # sign, hence the .substring(1)
    return extracted.size() == 1 && extracted.get(0).equals(text.substring(1));
  }

  public static boolean hasInvalidCharacters(String text) {
    return Regex.INVALID_CHARACTERS_PATTERN.matcher(text).matches();
  }

  public int getShortUrlLength() {
    return shortUrlLength;
  }

  public void setShortUrlLength(int shortUrlLength) {
    this.shortUrlLength = shortUrlLength;
  }

  public int getShortUrlLengthHttps() {
    return shortUrlLengthHttps;
  }

  public void setShortUrlLengthHttps(int shortUrlLengthHttps) {
    this.shortUrlLengthHttps = shortUrlLengthHttps;
  }
}
