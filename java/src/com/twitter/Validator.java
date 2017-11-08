package com.twitter;

import java.text.Normalizer;

/**
 * A class for validating Tweet texts.
 */
public class Validator {
  @Deprecated
  public static final int MAX_TWEET_LENGTH = 140;
  public static final int MAX_WEIGHTED_TWEET_LENGTH = 280;

  protected int shortUrlLength = 23;
  protected int shortUrlLengthHttps = 23;

  protected int defaultWeight = 200;

  private Extractor extractor = new Extractor();
  private WeightRange[] weightRanges = {
          new WeightRange(0,4351,100),
          new WeightRange(8192,8205,100),
          new WeightRange(8208,8223,100),
          new WeightRange(8242,8247,100),
  };

  public int getTweetLength(String text) {
    text = Normalizer.normalize(text, Normalizer.Form.NFC);
    int weightedLength = 0;

    for(int charOffset = 0, textLength = text.length(); charOffset < textLength; ) {
      final int codePoint = Character.codePointAt(text, charOffset);
      weightedLength += weightForCodePoint(codePoint);
      charOffset += Character.charCount(codePoint);
    }

    int length = weightedLength / 100;

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
      if (c == '\uFFFE' || c == '\uFEFF' ||   // BOM
          c == '\uFFFF' ||                     // Special
          (c >= '\u202A' && c <= '\u202E')) {  // Direction change
        return false;
      }
    }

    return getTweetLength(text) <= MAX_WEIGHTED_TWEET_LENGTH;
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

  public int getDefaultWeight() {
    return defaultWeight;
  }

  public void setDefaultWeight(int defaultWeight) {
    this.defaultWeight = defaultWeight;
  }

  private int weightForCodePoint(int codePoint) {
    for (WeightRange range : weightRanges) {
      if (range.contains(codePoint)) return range.weight;
    }
    return defaultWeight;
  }

  public static class WeightRange {

    public final int start;
    public final int end;
    public final int weight;

    public WeightRange(int start, int end, int weight) {
      this.start = start;
      this.end = end;
      this.weight = weight;
    }

    public boolean contains(int codePoint) {
      return codePoint >= start && codePoint <= end;
    }
  }
}
