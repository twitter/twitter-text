// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

package com.twitter.twittertext;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * A class that represents a parsed tweet structure that contains the length of the tweet,
 * its validity, display ranges etc.
 */
public class TwitterTextParseResults {

  /**
   * The adjusted tweet length based on char weights.
   * true weightedLength is weightedLength / configuration.scale
   */
  public final int weightedLength;

  /**
   * true weightedLength by configuration.maxWeightedTweetLength permillage.
   */
  public final int permillage;

  /**
   * If the tweet is valid or not.
   */
  public final boolean isValid;

  /**
   * Text range that is visible
   */
  @Nonnull
  public final Range displayTextRange;

  /**
   * Text range that is valid for a Tweet
   */
  @Nonnull
  public final Range validTextRange;

  public TwitterTextParseResults(int weightedLength, int permillage, boolean isValid,
                                 @Nonnull Range displayTextRange, @Nonnull Range validTextRange) {
    this.weightedLength = weightedLength;
    this.permillage = permillage;
    this.isValid = isValid;
    this.displayTextRange = displayTextRange;
    this.validTextRange = validTextRange;
  }

  @Override
  public int hashCode() {
    int result = weightedLength;
    result = 31 * result + permillage;
    result = 31 * result + Boolean.valueOf(isValid).hashCode();
    result = 31 * result + displayTextRange.hashCode();
    result = 31 * result + validTextRange.hashCode();
    return result;
  }

  @Override
  public boolean equals(@Nullable Object obj) {
    return this == obj || obj instanceof TwitterTextParseResults &&
        equals((TwitterTextParseResults) obj);
  }

  private boolean equals(@Nullable TwitterTextParseResults obj) {
    return obj != null && obj.weightedLength == weightedLength && obj.permillage == permillage
        && obj.isValid == isValid && obj.displayTextRange.equals(displayTextRange)
        && obj.validTextRange.equals(validTextRange);
  }
}
