package com.twitter.twittertext;

import com.fasterxml.jackson.databind.ObjectMapper;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;

/**
 * A class that represents the different configurations used by {@link TwitterTextParser} to parse a tweet.
 */
public class TwitterTextConfiguration {

  // These defaults should be kept up to date with v2.json config. There's a unit test to ensure that.
  private final static int DEFAULT_VERSION = 2;
  private final static int DEFAULT_WEIGHTED_LENGTH = 280;
  private final static int DEFAULT_SCALE = 100;
  private final static int DEFAULT_WEIGHT = 200;
  private final static int DEFAULT_TRANSFORMED_URL_LENGTH = 23;
  private static final List<TwitterTextWeightedRange> DEFAULT_RANGES = new ArrayList<>();
  static {
    DEFAULT_RANGES.add(new TwitterTextWeightedRange().setStart(0).setEnd(4351).setWeight(100));
    DEFAULT_RANGES.add(new TwitterTextWeightedRange().setStart(8192).setEnd(8205).setWeight(100));
    DEFAULT_RANGES.add(new TwitterTextWeightedRange().setStart(8208).setEnd(8223).setWeight(100));
    DEFAULT_RANGES.add(new TwitterTextWeightedRange().setStart(8242).setEnd(8247).setWeight(100));
  }

  private int version;
  private int maxWeightedTweetLength;
  private int scale;
  private int defaultWeight;
  private int transformedURLLength;
  @Nonnull
  private List<TwitterTextWeightedRange> ranges;

  /**
   * @param json The configuration string or file name in the config directory
   *             The JSON can have the following properties
   *             version (required, integer, min value 0)
   *             maxWeightedTweetLength (required, integer, min value 0)
   *             scale (required, integer, min value 1)
   *             defaultWeight (required, integer, min value 0)
   *             transformedURLLength (integer, min value 0)
   *             ranges (array of range items)
   *             A range item has the following properties:
   *               start (required, integer, min value 0)
   *               end (required, integer, min value 0)
   *               weight (required, integer, min value 0)
   * @param isResource boolean indicating if the json refers to a file name for the configuration.
   * @return a {@link TwitterTextConfiguration} object that provides all the configuration values.
   */
  @Nonnull
  public static TwitterTextConfiguration configurationFromJson(@Nonnull String json, boolean isResource) {
    // jackson's default serialization format is json
    final ObjectMapper objectMapper = new ObjectMapper();
    TwitterTextConfiguration config;
    try {
      if (isResource) {
        InputStream resourceStream = TwitterTextConfiguration.class.getResourceAsStream("/" + json);
        // For whatever reason, this fails in some Samsung Galaxy J7 family of devices, try falling back to classloader.
        if (resourceStream == null) {
          resourceStream = TwitterTextConfiguration.class.getClassLoader().getResourceAsStream(json);
        }
        try {
          final Reader reader = new BufferedReader(new InputStreamReader(resourceStream));
          config = objectMapper.readValue(reader, TwitterTextConfiguration.class);
          // If an invalid resource is passed, use default config.
        } catch (NullPointerException ex) {
          return getDefaultConfig();
        }
      } else {
        config = objectMapper.readValue(json, TwitterTextConfiguration.class);
      }
    // InputStreamReader can throw an NPE when the resource is null
    } catch (IOException ex) {
      config = getDefaultConfig();
    }
    return config;
  }

  private static TwitterTextConfiguration getDefaultConfig() {
    return new TwitterTextConfiguration()
        .setVersion(DEFAULT_VERSION)
        .setMaxWeightedTweetLength(DEFAULT_WEIGHTED_LENGTH)
        .setScale(DEFAULT_SCALE)
        .setDefaultWeight(DEFAULT_WEIGHT)
        .setRanges(DEFAULT_RANGES)
        .setTransformedURLLength(DEFAULT_TRANSFORMED_URL_LENGTH);
  }

  private TwitterTextConfiguration setVersion(int version) {
    this.version = version;
    return this;
  }

  private TwitterTextConfiguration setMaxWeightedTweetLength(int maxWeightedTweetLength) {
    this.maxWeightedTweetLength = maxWeightedTweetLength;
    return this;
  }

  private TwitterTextConfiguration setScale(int scale) {
    this.scale = scale;
    return this;
  }

  private TwitterTextConfiguration setDefaultWeight(int defaultWeight) {
    this.defaultWeight = defaultWeight;
    return this;
  }

  private TwitterTextConfiguration setTransformedURLLength(int urlLength) {
    this.transformedURLLength = urlLength;
    return this;
  }

  private TwitterTextConfiguration setRanges(@Nonnull List<TwitterTextWeightedRange> ranges) {
    this.ranges = ranges;
    return this;
  }

  /**
   * @return The version for the configuration string. This is an integer that will monotonically increase in
   * future releases. The legacy version of the string is version 1; weighted code point ranges and 280-character “long”
   * tweets are supported in version 2.
   */
  public int getVersion() {
    return version;
  }

  /**
   * @return The maximum length of the tweet, weighted. Legacy v1 tweets had a maximum weighted length of 140 and
   * all characters were weighted the same. In the new configuration format, this is represented as a
   * {@link maxWeightedTweetLength} of 140 and a {@link defaultWeight} of 1 for all code points.
   */
  public int getMaxWeightedTweetLength() {
    return maxWeightedTweetLength;
  }

  /**
   * @return The Tweet length is the (weighted length / scale).
   */
  public int getScale() {
    return scale;
  }

  /**
   * @return The default weight applied to all code points. This is overridden in one or more range items.
   */
  public int getDefaultWeight() {
    return defaultWeight;
  }

  /**
   * @return The length counted for URLs against the total weight of the Tweet. In previous versions of twitter-text,
   * which was the "shortened URL length." Differentiating between the http and https shortened length for URLs has
   * been deprecated (https is used for all t.co URLs). The default value is 23.
   */
  public int getTransformedURLLength() {
    return transformedURLLength;
  }

  /**
   * @return An array of range items that describe ranges of Unicode code points and the weight to apply to each
   * code point. Each range is defined by its start, end, and weight. Surrogate pairs have a length that is equivalent
   * to the length of the first code unit in the surrogate pair. Note that certain graphemes are the result of joining
   * code points together, such as by a zero-width joiner; unlike a surrogate pair, the length of such a grapheme
   * will be the sum of the weighted length of all included code points.
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
    return version == that.version && maxWeightedTweetLength == that.maxWeightedTweetLength && scale == that.scale &&
        defaultWeight == that.defaultWeight && transformedURLLength == that.transformedURLLength &&
        ranges.equals(that.ranges);
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
     * @return Contiguous unicode region
     */
    @Nonnull
    public Range getRange() {
      return new Range(start, end);
    }

    /**
     *  @return Weight for each unicode point in the region
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
