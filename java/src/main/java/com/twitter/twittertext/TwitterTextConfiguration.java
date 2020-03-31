// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

package com.twitter.twittertext;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * A class that represents the different configurations used by {@link TwitterTextParser}
 * to parse a tweet.
 */
public final class TwitterTextConfiguration {

  /**
   * The following unicode code point blocks are defined:
   * 0x0000 (0)    - 0x10FF (4351) Basic Latin to Georgian block: Weight 100
   * 0x2000 (8192) - 0x200D (8205) Spaces in the General Punctuation Block: Weight 100
   * 0x2010 (8208) - 0x201F (8223) Hyphens &amp; Quotes in the General Punctuation Block: Weight 100
   * 0x2032 (8242) - 0x2037 (8247) Quotes in the General Punctuation Block: Weight 100
   * supports counting emoji as one weighted character
   */
  private static final int DEFAULT_VERSION = 3;
  private static final int DEFAULT_WEIGHTED_LENGTH = 280;
  private static final int DEFAULT_SCALE = 100;
  private static final int DEFAULT_WEIGHT = 200;
  private static final boolean DEFAULT_EMOJI_PARSING_ENABLED = true;
  private static final int DEFAULT_TRANSFORMED_URL_LENGTH = 23;
  private static final List<TwitterTextWeightedRange> DEFAULT_RANGES = new ArrayList<>();

  static {
    DEFAULT_RANGES.add(new TwitterTextWeightedRange().setStart(0).setEnd(4351).setWeight(100));
    DEFAULT_RANGES.add(new TwitterTextWeightedRange().setStart(8192).setEnd(8205).setWeight(100));
    DEFAULT_RANGES.add(new TwitterTextWeightedRange().setStart(8208).setEnd(8223).setWeight(100));
    DEFAULT_RANGES.add(new TwitterTextWeightedRange().setStart(8242).setEnd(8247).setWeight(100));
  }

  private final int version;
  private final int maxWeightedTweetLength;
  private final int scale;
  private final int defaultWeight;
  private final boolean emojiParsingEnabled;
  private final int transformedURLLength;
  @Nonnull
  private final List<TwitterTextWeightedRange> ranges;

  public static TwitterTextConfiguration getDefaultConfig() {
    return new TwitterTextConfiguration.Builder()
        .setVersion(DEFAULT_VERSION)
        .setMaxWeightedTweetLength(DEFAULT_WEIGHTED_LENGTH)
        .setScale(DEFAULT_SCALE)
        .setDefaultWeight(DEFAULT_WEIGHT)
        .setEmojiParsingEnabled(DEFAULT_EMOJI_PARSING_ENABLED)
        .setRanges(DEFAULT_RANGES)
        .setTransformedURLLength(DEFAULT_TRANSFORMED_URL_LENGTH)
        .build();
  }

  private TwitterTextConfiguration(@Nonnull Builder builder) {
    version = builder.version;
    maxWeightedTweetLength = builder.maxWeightedTweetLength;
    scale = builder.scale;
    defaultWeight = builder.defaultWeight;
    emojiParsingEnabled = builder.emojiParsingEnabled;
    transformedURLLength = builder.transformedURLLength;
    ranges = builder.ranges;
  }

  public static final class Builder {
    private int version;
    private int maxWeightedTweetLength;
    private int scale;
    private int defaultWeight;
    private boolean emojiParsingEnabled;
    private int transformedURLLength;
    @Nonnull
    private List<TwitterTextWeightedRange> ranges = new ArrayList<>();

    public Builder setVersion(int version) {
      this.version = version;
      return this;
    }

    public Builder setMaxWeightedTweetLength(int maxWeightedTweetLength) {
      this.maxWeightedTweetLength = maxWeightedTweetLength;
      return this;
    }

    public Builder setScale(int scale) {
      this.scale = scale;
      return this;
    }

    public Builder setDefaultWeight(int defaultWeight) {
      this.defaultWeight = defaultWeight;
      return this;
    }

    public Builder setEmojiParsingEnabled(boolean emojiParsingEnabled) {
      this.emojiParsingEnabled = emojiParsingEnabled;
      return this;
    }

    public Builder setTransformedURLLength(int urlLength) {
      this.transformedURLLength = urlLength;
      return this;
    }

    public Builder setRanges(@Nonnull List<TwitterTextWeightedRange> ranges) {
      this.ranges = ranges;
      return this;
    }

    public TwitterTextConfiguration build() {
      return new TwitterTextConfiguration(this);
    }
  }

  /**
   * Get the current version. This is an integer that will monotonically
   * increase in future releases. The legacy version of the string is version 1;
   * weighted code point ranges and 280-character “long” tweets are supported in version 2.
   *
   * @return The version for the configuration string.
   */
  public int getVersion() {
    return version;
  }

  /**
   * Get the maximum weighted length in the config. Legacy v1 tweets had a maximum
   * weighted length of 140 and all characters were weighted the same.
   * In the new configuration format, this is represented as a {@link maxWeightedTweetLength} of 140
   * and a {@link defaultWeight} of 1 for all code points.
   * @return The maximum length of the tweet, weighted.
   */
  public int getMaxWeightedTweetLength() {
    return maxWeightedTweetLength;
  }

  /**
   * Get the scale.
   *
   * @return The Tweet length is the (weighted length / scale).
   */
  public int getScale() {
    return scale;
  }

  /**
   * Get the default weight. This is overridden in one or more range items.
   *
   * @return The default weight applied to all code points.
   */
  public int getDefaultWeight() {
    return defaultWeight;
  }

  /**
   * Get whether emoji parsing is enabled.
   *
   * @return true if emoji parsing is enabled, otherwise false.
   */
  public boolean getEmojiParsingEnabled() {
    return emojiParsingEnabled;
  }

  /**
   * In previous versions of twitter-text, which was the "shortened URL length."
   * Differentiating between the http and https shortened length for URLs has been deprecated
   * (https is used for all t.co URLs). The default value is 23.
   *
   * @return The length counted for URLs against the total weight of the Tweet.
   */
  public int getTransformedURLLength() {
    return transformedURLLength;
  }

  /**
   * Get an array of range items that describe ranges of Unicode code points and the weight to
   * apply to each code point. Each range is defined by its start, end, and weight.
   * Surrogate pairs have a length that is equivalent to the length of the first code unit in the
   * surrogate pair. Note that certain graphemes are the result of joining code points together,
   * such as by a zero-width joiner; unlike a surrogate pair, the length of such a grapheme will be
   * the sum of the weighted length of all included code points.
   *
   * @return An array of range items.
   */
  @Nonnull
  public List<TwitterTextWeightedRange> getRanges() {
    return ranges;
  }

  @Override
  public int hashCode() {
    int result = 17;
    result = result * 31 + version;
    result = result * 31 + maxWeightedTweetLength;
    result = result * 31 + scale;
    result = result * 31 + defaultWeight;
    result = result * 31 + (emojiParsingEnabled ? 1 : 0);
    result = result * 31 + transformedURLLength;
    result = result * 31 + ranges.hashCode();
    return result;
  }

  @Override
  public boolean equals(@Nullable Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }

    final TwitterTextConfiguration that = (TwitterTextConfiguration) o;
    return version == that.version && maxWeightedTweetLength == that.maxWeightedTweetLength &&
        scale == that.scale && defaultWeight == that.defaultWeight &&
        emojiParsingEnabled == that.emojiParsingEnabled &&
        transformedURLLength == that.transformedURLLength && ranges.equals(that.ranges);
  }

  public static class TwitterTextWeightedRange {
    private int start;
    private int end;
    private int weight;

    private TwitterTextWeightedRange setStart(int start) {
      this.start = start;
      return this;
    }

    private TwitterTextWeightedRange setEnd(int end) {
      this.end = end;
      return this;
    }

    private TwitterTextWeightedRange setWeight(int weight) {
      this.weight = weight;
      return this;
    }

    /**
     * Get the contiguous unicode region
     *
     * @return range object
     */
    @Nonnull
    public Range getRange() {
      return new Range(start, end);
    }

    /**
     * Get the Weight for each unicode point in the region
     *
     * @return integer indicating the weight
     */
    public int getWeight() {
      return weight;
    }

    @Override
    public int hashCode() {
      return 31 * start + 31 * end + 31 * weight;
    }

    @Override
    public boolean equals(@Nullable Object o) {
      if (this == o) {
        return true;
      }
      if (o == null || getClass() != o.getClass()) {
        return false;
      }
      final TwitterTextWeightedRange that = (TwitterTextWeightedRange) o;
      return start == that.start && end == that.end && weight == that.weight;

    }
  }
}
