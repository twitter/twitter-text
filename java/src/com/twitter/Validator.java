package com.twitter;

import java.text.Normalizer;

/**
 * A class for validating Tweet texts.
 */
public class Validator {
  public static final int MAX_TWEET_LENGTH = 140;

  protected int shortUrlLength = 22;
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
    if (text == null || text.length() == 0) {
      return false;
    }

    for (char c : text.toCharArray()) {
      if (c == '\uFFFE' || c == '\uuFEFF' ||   // BOM
          c == '\uFFFF' ||                     // Special
          (c >= '\u202A' && c <= '\u202E')) {  // Direction change
        return false;
      }
    }

    return getTweetLength(text) <= MAX_TWEET_LENGTH;
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
