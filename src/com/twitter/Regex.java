
package com.twitter;

import java.util.*;
import java.util.regex.*;

public class Regex {
  private static final String[] UNICODE_SPACES = {};

  private static final String[] RESERVED_ACTION_WORDS = {"twitter","lists",
  "retweet","retweets","following","followings","follower","followers",
  "with_friend","with_friends","statuses","status","activity","favourites",
  "favourite","favorite","favorites"};

  private static final String[] LATIN_ACCENTS = {};
  private static final Pattern HASHTAG_CHARACTERS_PATTERN = Pattern.compile("[a-z0-9_]", Pattern.CASE_INSENSITIVE);
  
  /* Begin public constants */
  public static final Pattern AUTO_LINK_HASHTAGS = Pattern.compile("(^|[^0-9A-Z&/]+)(#|＃)([0-9A-Z_]*[A-Z_]+" + HASHTAG_CHARACTERS_PATTERN.pattern() + "*)");
}