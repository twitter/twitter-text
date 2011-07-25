
package com.twitter;

import java.util.*;
import java.util.regex.*;

public class Regex {
  private static final String[] RESERVED_ACTION_WORDS = {"twitter","lists",
  "retweet","retweets","following","followings","follower","followers",
  "with_friend","with_friends","statuses","status","activity","favourites",
  "favourite","favorite","favorites"};

  private static String LATIN_ACCENTS_CHARS = "\\u00c0-\\u00d6\\u00d8-\\u00f6\\u00f8-\\u00ff";
  private static final String HASHTAG_ALPHA_CHARS = "a-z" + LATIN_ACCENTS_CHARS +
                                                   "\\u0400-\\u04ff\\u0500-\\u0527" + // Cyrillic
                                                   "\\u1100-\\u11ff\\u3130-\\u3185\\uA960-\\uA97F\\uAC00-\\uD7AF\\uD7B0-\\uD7FF" + // Hangul (Korean)
                                                   "\\p{InHiragana}\\p{InKatakana}" + // Japanese Hiragana and Katakana
                                                   "\\p{InCJKUnifiedIdeographs}\\u3005" + // Japanese Kanji / Chinese Han
                                                   "\\uff21-\\uff3a\\uff41-\\uff5a" + // full width Alphabet
                                                   "\\uff66-\\uff9f" + // half width Katakana
                                                   "\\uffa1-\\uffdc"; // half width Hangul (Korean)
  private static final String HASHTAG_ALPHA_NUMERIC_CHARS = "0-9\\uff10-\\uff19_" + HASHTAG_ALPHA_CHARS;
  private static final String HASHTAG_ALPHA = "[" + HASHTAG_ALPHA_CHARS +"]";
  private static final String HASHTAG_ALPHA_NUMERIC = "[" + HASHTAG_ALPHA_NUMERIC_CHARS +"]";

  /* URL related hash regex collection */
  private static final String URL_VALID_PRECEEDING_CHARS = "(?:[^\\-/\"':!=A-Z0-9_@＠]+|^|\\:)";

  private static final String URL_VALID_CHARS = "[^\\p{Punct}\\s\\u00a0]";
  private static final String URL_PUNYCODE = "xn--[0-9a-z]+";
  private static final String URL_VALID_SUBDOMAIN = "(?:(?:" + URL_VALID_CHARS + "(?:[_-]|" + URL_VALID_CHARS + ")*)?" + URL_VALID_CHARS + "\\.)";
  private static final String URL_VALID_DOMAIN_NAME = "(?:" + URL_VALID_CHARS + "(?:[-]|" + URL_VALID_CHARS + ")*)?" + URL_VALID_CHARS;
  private static final String URL_VALID_DOMAIN = URL_VALID_SUBDOMAIN + "*" + URL_VALID_DOMAIN_NAME + "\\.(?:" + URL_PUNYCODE + "|[a-z]{2,})(?::[0-9]+)?";

  private static final String URL_VALID_GENERAL_PATH_CHARS = "[a-z0-9!\\*';:=\\+\\$/%#\\[\\]\\-_,~\\.\\|]";
  private static final String URL_VALID_PATH_CHARS_WITHOUT_SLASH = "[" + URL_VALID_GENERAL_PATH_CHARS + "&&[^/]]";
  private static final String URL_VALID_PATH_CHARS_WITHOUT_COMMA = "[" + URL_VALID_GENERAL_PATH_CHARS + "&&[^,]]";

  /** Allow URL paths to contain balanced parens
   *  1. Used in Wikipedia URLs like /Primer_(film)
   *  2. Used in IIS sessions like /S(dfd346)/
  **/
  private static final String URL_BALANCE_PARENS = "(?:\\(" + URL_VALID_GENERAL_PATH_CHARS + "+\\))";
  private static final String URL_VALID_URL_PATH_CHARS = "(?:" +
    URL_BALANCE_PARENS +
    "|@" + URL_VALID_PATH_CHARS_WITHOUT_SLASH + "++/" +
    "|(?:[.,]*+" + URL_VALID_PATH_CHARS_WITHOUT_COMMA + ")++" +
  ")";

  /** Valid end-of-path chracters (so /foo. does not gobble the period).
   *   2. Allow =&# for empty URL parameters and other URL-join artifacts
  **/
  private static final String URL_VALID_URL_PATH_ENDING_CHARS = "(?:[a-z0-9=_#/\\-\\+]+|"+URL_BALANCE_PARENS+")";
  private static final String URL_VALID_URL_QUERY_CHARS = "[a-z0-9!\\*'\\(\\);:&=\\+\\$/%#\\[\\]\\-_\\.,~\\|]";
  private static final String URL_VALID_URL_QUERY_ENDING_CHARS = "[a-z0-9_&=#/]";
  private static final String VALID_URL_PATTERN_STRING =
  "(" +                                                            //  $1 total match
    "(" + URL_VALID_PRECEEDING_CHARS + ")" +                       //  $2 Preceeding chracter
    "(" +                                                          //  $3 URL
      "(https?://)" +                                              //  $4 Protocol
      "(" + URL_VALID_DOMAIN + ")" +                               //  $5 Domain(s) and optional port number
      "(/" +
        "(?:" +
          URL_VALID_URL_PATH_CHARS + "+|" +                        //     1+ path chars and a valid last char
          URL_VALID_URL_PATH_ENDING_CHARS +                        //     Just a # case
        ")?" +
      ")?" +                                                       //  $6 URL Path and anchor
      "(\\?" + URL_VALID_URL_QUERY_CHARS + "*" +                   //  $7 Query String
              URL_VALID_URL_QUERY_ENDING_CHARS + ")?" +
    ")" +
  ")";

  private static String AT_SIGNS_CHARS = "@\uFF20";


  /* Begin public constants */
  public static final Pattern AT_SIGNS = Pattern.compile("[" + AT_SIGNS_CHARS + "]");

  public static final Pattern SCREEN_NAME_MATCH_END = Pattern.compile("^(?:[" + AT_SIGNS_CHARS + LATIN_ACCENTS_CHARS + "]|://)");

  public static final Pattern AUTO_LINK_HASHTAGS = Pattern.compile("(^|[^&/" + HASHTAG_ALPHA_NUMERIC_CHARS + "]+)(#|\uFF03)(" + HASHTAG_ALPHA_NUMERIC + "*" + HASHTAG_ALPHA + HASHTAG_ALPHA_NUMERIC + "*)", Pattern.CASE_INSENSITIVE);
  public static final int AUTO_LINK_HASHTAGS_GROUP_BEFORE = 1;
  public static final int AUTO_LINK_HASHTAGS_GROUP_HASH = 2;
  public static final int AUTO_LINK_HASHTAGS_GROUP_TAG = 3;

  public static final Pattern AUTO_LINK_USERNAMES_OR_LISTS = Pattern.compile("([^a-z0-9_]|^|RT:?)(" + AT_SIGNS + "+)([a-z0-9_]{1,20})(/[a-z][a-z0-9_\\-]{0,24})?", Pattern.CASE_INSENSITIVE);
  public static final int AUTO_LINK_USERNAME_OR_LISTS_GROUP_BEFORE = 1;
  public static final int AUTO_LINK_USERNAME_OR_LISTS_GROUP_AT = 2;
  public static final int AUTO_LINK_USERNAME_OR_LISTS_GROUP_USERNAME = 3;
  public static final int AUTO_LINK_USERNAME_OR_LISTS_GROUP_LIST = 4;

  public static final Pattern VALID_URL = Pattern.compile(VALID_URL_PATTERN_STRING, Pattern.CASE_INSENSITIVE);
  public static final int VALID_URL_GROUP_ALL          = 1;
  public static final int VALID_URL_GROUP_BEFORE       = 2;
  public static final int VALID_URL_GROUP_URL          = 3;
  public static final int VALID_URL_GROUP_PROTOCOL     = 4;
  public static final int VALID_URL_GROUP_DOMAIN       = 5;
  public static final int VALID_URL_GROUP_PATH         = 6;
  public static final int VALID_URL_GROUP_QUERY_STRING = 7;

  public static final Pattern EXTRACT_MENTIONS = Pattern.compile("(^|[^a-z0-9_])" + AT_SIGNS + "([a-z0-9_]{1,20})(?=(.|$))", Pattern.CASE_INSENSITIVE);
  public static final int EXTRACT_MENTIONS_GROUP_BEFORE = 1;
  public static final int EXTRACT_MENTIONS_GROUP_USERNAME = 2;
  public static final int EXTRACT_MENTIONS_GROUP_AFTER = 3;

  public static final Pattern EXTRACT_REPLY = Pattern.compile("^(?:[" + com.twitter.regex.Spaces.getCharacterClass() + "])*" + AT_SIGNS + "([a-z0-9_]{1,20}).*", Pattern.CASE_INSENSITIVE);
  public static final int EXTRACT_REPLY_GROUP_USERNAME = 1;
}
