package com.twitter.twittertext;

import java.text.Normalizer;

/**
 * A class for validating Tweet texts.
 */
public class Validator {
  public static final int MAX_TWEET_LENGTH = 140;

  protected int shortUrlLength = 23;
  protected int shortUrlLengthHttps = 23;

  private Extractor extractor = new Extractor();

  public int getTweetLength(String text) {
    text = Normalizer.normalize(text, Normalizer.Form.NFC);
    int length = text.codePointCount(0, text.length());

    for (Extractor.Entity urlEntity : extractor.extractURLsWithIndices(text)) {
      length += urlEntity.start - urlEntity.end;
      length += urlEntity.value.toLowerCase().startsWith("https://") ? shortUrlLengthHttps : shortUrlLength;
    }

    return length;
  }

  public boolean isValidTweet(String text) {
    return text != null && text.length() != 0 && !hasInvalidCharacters(text) &&
        getTweetLength(text) <= MAX_TWEET_LENGTH;
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
