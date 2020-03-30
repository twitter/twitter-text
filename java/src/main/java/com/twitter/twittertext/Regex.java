// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

package com.twitter.twittertext;

import java.util.Collection;
import java.util.Iterator;
import java.util.regex.Pattern;
import javax.annotation.Nonnull;

public class Regex {

  protected Regex() {
  }

  private static final String URL_VALID_GTLD =
    "(?:(?:" +
    join(TldLists.GTLDS) +
    ")(?=[^a-z0-9@+-]|$))";
  private static final String URL_VALID_CCTLD =
    "(?:(?:" +
    join(TldLists.CTLDS) +
    ")(?=[^a-z0-9@+-]|$))";

  private static final String INVALID_CHARACTERS =
    "\\uFFFE" +           // BOM
    "\\uFEFF" +           // BOM
    "\\uFFFF";            // Special

  private static final String DIRECTIONAL_CHARACTERS =
    "\\u061C" + // ARABIC LETTER MARK (ALM)
    "\\u200E" + // LEFT-TO-RIGHT MARK (LRM)
    "\\u200F" + // RIGHT-TO-LEFT MARK (RLM)
    "\\u202A" + // LEFT-TO-RIGHT EMBEDDING (LRE)
    "\\u202B" + // RIGHT-TO-LEFT EMBEDDING (RLE)
    "\\u202C" + // POP DIRECTIONAL FORMATTING (PDF)
    "\\u202D" + // LEFT-TO-RIGHT OVERRIDE (LRO)
    "\\u202E" + // RIGHT-TO-LEFT OVERRIDE (RLO)
    "\\u2066" + // LEFT-TO-RIGHT ISOLATE (LRI)
    "\\u2067" + // RIGHT-TO-LEFT ISOLATE (RLI)
    "\\u2068" + // FIRST STRONG ISOLATE (FSI)
    "\\u2069";  // POP DIRECTIONAL ISOLATE (PDI)


  private static final String UNICODE_SPACES = "[" +
    "\\u0009-\\u000d" +     //  # White_Space # Cc   [5] <control-0009>..<control-000D>
    "\\u0020" +             // White_Space # Zs       SPACE
    "\\u0085" +             // White_Space # Cc       <control-0085>
    "\\u00a0" +             // White_Space # Zs       NO-BREAK SPACE
    "\\u1680" +             // White_Space # Zs       OGHAM SPACE MARK
    "\\u180E" +             // White_Space # Zs       MONGOLIAN VOWEL SEPARATOR
    "\\u2000-\\u200a" +     // # White_Space # Zs  [11] EN QUAD..HAIR SPACE
    "\\u2028" +             // White_Space # Zl       LINE SEPARATOR
    "\\u2029" +             // White_Space # Zp       PARAGRAPH SEPARATOR
    "\\u202F" +             // White_Space # Zs       NARROW NO-BREAK SPACE
    "\\u205F" +             // White_Space # Zs       MEDIUM MATHEMATICAL SPACE
    "\\u3000" +             // White_Space # Zs       IDEOGRAPHIC SPACE
  "]";

  private static final String LATIN_ACCENTS_CHARS =
      // Latin-1
      "\\u00c0-\\u00d6\\u00d8-\\u00f6\\u00f8-\\u00ff" +
          // Latin Extended A and B
          "\\u0100-\\u024f" +
          // IPA Extensions
          "\\u0253\\u0254\\u0256\\u0257\\u0259\\u025b\\u0263\\u0268\\u026f\\u0272\\u0289\\u028b" +
          // Hawaiian
          "\\u02bb" +
          // Combining diacritics
          "\\u0300-\\u036f" +
          // Latin Extended Additional (mostly for Vietnamese)
          "\\u1e00-\\u1eff";

  private static final String CYRILLIC_CHARS = "\\u0400-\\u04ff";

  // Generated from unicode_regex/unicode_regex_groups.scala, more inclusive than Java's \p{L}\p{M}
  private static final String HASHTAG_LETTERS_AND_MARKS = "\\p{L}\\p{M}" +
      "\\u037f\\u0528-\\u052f\\u08a0-\\u08b2\\u08e4-\\u08ff\\u0978\\u0980\\u0c00\\u0c34\\u0c81" +
      "\\u0d01\\u0ede\\u0edf\\u10c7\\u10cd\\u10fd-\\u10ff\\u16f1-\\u16f8\\u17b4\\u17b5\\u191d" +
      "\\u191e\\u1ab0-\\u1abe\\u1bab-\\u1bad\\u1bba-\\u1bbf\\u1cf3-\\u1cf6\\u1cf8\\u1cf9" +
      "\\u1de7-\\u1df5\\u2cf2\\u2cf3\\u2d27\\u2d2d\\u2d66\\u2d67\\u9fcc\\ua674-\\ua67b\\ua698" +
      "-\\ua69d\\ua69f\\ua792-\\ua79f\\ua7aa-\\ua7ad\\ua7b0\\ua7b1\\ua7f7-\\ua7f9\\ua9e0-" +
      "\\ua9ef\\ua9fa-\\ua9fe\\uaa7c-\\uaa7f\\uaae0-\\uaaef\\uaaf2-\\uaaf6\\uab30-\\uab5a" +
      "\\uab5c-\\uab5f\\uab64\\uab65\\uf870-\\uf87f\\uf882\\uf884-\\uf89f\\uf8b8\\uf8c1-" +
      "\\uf8d6\\ufa2e\\ufa2f\\ufe27-\\ufe2d\\ud800\\udee0\\ud800\\udf1f\\ud800\\udf50-\\ud800" +
      "\\udf7a\\ud801\\udd00-\\ud801\\udd27\\ud801\\udd30-\\ud801\\udd63\\ud801\\ude00-\\ud801" +
      "\\udf36\\ud801\\udf40-\\ud801\\udf55\\ud801\\udf60-\\ud801\\udf67\\ud802\\udc60-\\ud802" +
      "\\udc76\\ud802\\udc80-\\ud802\\udc9e\\ud802\\udd80-\\ud802\\uddb7\\ud802\\uddbe\\ud802" +
      "\\uddbf\\ud802\\ude80-\\ud802\\ude9c\\ud802\\udec0-\\ud802\\udec7\\ud802\\udec9-\\ud802" +
      "\\udee6\\ud802\\udf80-\\ud802\\udf91\\ud804\\udc7f\\ud804\\udcd0-\\ud804\\udce8\\ud804" +
      "\\udd00-\\ud804\\udd34\\ud804\\udd50-\\ud804\\udd73\\ud804\\udd76\\ud804\\udd80-\\ud804" +
      "\\uddc4\\ud804\\uddda\\ud804\\ude00-\\ud804\\ude11\\ud804\\ude13-\\ud804\\ude37\\ud804" +
      "\\udeb0-\\ud804\\udeea\\ud804\\udf01-\\ud804\\udf03\\ud804\\udf05-\\ud804\\udf0c\\ud804" +
      "\\udf0f\\ud804\\udf10\\ud804\\udf13-\\ud804\\udf28\\ud804\\udf2a-\\ud804\\udf30\\ud804" +
      "\\udf32\\ud804\\udf33\\ud804\\udf35-\\ud804\\udf39\\ud804\\udf3c-\\ud804\\udf44\\ud804" +
      "\\udf47\\ud804\\udf48\\ud804\\udf4b-\\ud804\\udf4d\\ud804\\udf57\\ud804\\udf5d-\\ud804" +
      "\\udf63\\ud804\\udf66-\\ud804\\udf6c\\ud804\\udf70-\\ud804\\udf74\\ud805\\udc80-\\ud805" +
      "\\udcc5\\ud805\\udcc7\\ud805\\udd80-\\ud805\\uddb5\\ud805\\uddb8-\\ud805\\uddc0\\ud805" +
      "\\ude00-\\ud805\\ude40\\ud805\\ude44\\ud805\\ude80-\\ud805\\udeb7\\ud806\\udca0-\\ud806" +
      "\\udcdf\\ud806\\udcff\\ud806\\udec0-\\ud806\\udef8\\ud808\\udf6f-\\ud808\\udf98\\ud81a" +
      "\\ude40-\\ud81a\\ude5e\\ud81a\\uded0-\\ud81a\\udeed\\ud81a\\udef0-\\ud81a\\udef4\\ud81a" +
      "\\udf00-\\ud81a\\udf36\\ud81a\\udf40-\\ud81a\\udf43\\ud81a\\udf63-\\ud81a\\udf77\\ud81a" +
      "\\udf7d-\\ud81a\\udf8f\\ud81b\\udf00-\\ud81b\\udf44\\ud81b\\udf50-\\ud81b\\udf7e\\ud81b" +
      "\\udf8f-\\ud81b\\udf9f\\ud82f\\udc00-\\ud82f\\udc6a\\ud82f\\udc70-\\ud82f\\udc7c\\ud82f" +
      "\\udc80-\\ud82f\\udc88\\ud82f\\udc90-\\ud82f\\udc99\\ud82f\\udc9d\\ud82f\\udc9e\\ud83a" +
      "\\udc00-\\ud83a\\udcc4\\ud83a\\udcd0-\\ud83a\\udcd6\\ud83b\\ude00-\\ud83b\\ude03\\ud83b" +
      "\\ude05-\\ud83b\\ude1f\\ud83b\\ude21\\ud83b\\ude22\\ud83b\\ude24\\ud83b\\ude27\\ud83b" +
      "\\ude29-\\ud83b\\ude32\\ud83b\\ude34-\\ud83b\\ude37\\ud83b\\ude39\\ud83b\\ude3b\\ud83b" +
      "\\ude42\\ud83b\\ude47\\ud83b\\ude49\\ud83b\\ude4b\\ud83b\\ude4d-\\ud83b\\ude4f\\ud83b" +
      "\\ude51\\ud83b\\ude52\\ud83b\\ude54\\ud83b\\ude57\\ud83b\\ude59\\ud83b\\ude5b\\ud83b" +
      "\\ude5d\\ud83b\\ude5f\\ud83b\\ude61\\ud83b\\ude62\\ud83b\\ude64\\ud83b\\ude67-\\ud83b" +
      "\\ude6a\\ud83b\\ude6c-\\ud83b\\ude72\\ud83b\\ude74-\\ud83b\\ude77\\ud83b\\ude79-\\ud83b" +
      "\\ude7c\\ud83b\\ude7e\\ud83b\\ude80-\\ud83b\\ude89\\ud83b\\ude8b-\\ud83b\\ude9b\\ud83b" +
      "\\udea1-\\ud83b\\udea3\\ud83b\\udea5-\\ud83b\\udea9\\ud83b\\udeab-\\ud83b\\udebb";

  // Generated from unicode_regex/unicode_regex_groups.scala, more inclusive than Java's \p{Nd}
  private static final String HASHTAG_NUMERALS = "\\p{Nd}" +
      "\\u0de6-\\u0def\\ua9f0-\\ua9f9\\ud804\\udcf0-\\ud804\\udcf9\\ud804\\udd36-\\ud804" +
      "\\udd3f\\ud804\\uddd0-\\ud804\\uddd9\\ud804\\udef0-\\ud804\\udef9\\ud805\\udcd0-\\ud805" +
      "\\udcd9\\ud805\\ude50-\\ud805\\ude59\\ud805\\udec0-\\ud805\\udec9\\ud806\\udce0-\\ud806" +
      "\\udce9\\ud81a\\ude60-\\ud81a\\ude69\\ud81a\\udf50-\\ud81a\\udf59";

  private static final String HASHTAG_SPECIAL_CHARS = "_" + //underscore
      "\\u200c" + // ZERO WIDTH NON-JOINER (ZWNJ)
      "\\u200d" + // ZERO WIDTH JOINER (ZWJ)
      "\\ua67e" + // CYRILLIC KAVYKA
      "\\u05be" + // HEBREW PUNCTUATION MAQAF
      "\\u05f3" + // HEBREW PUNCTUATION GERESH
      "\\u05f4" + // HEBREW PUNCTUATION GERSHAYIM
      "\\uff5e" + // FULLWIDTH TILDE
      "\\u301c" + // WAVE DASH
      "\\u309b" + // KATAKANA-HIRAGANA VOICED SOUND MARK
      "\\u309c" + // KATAKANA-HIRAGANA SEMI-VOICED SOUND MARK
      "\\u30a0" + // KATAKANA-HIRAGANA DOUBLE HYPHEN
      "\\u30fb" + // KATAKANA MIDDLE DOT
      "\\u3003" + // DITTO MARK
      "\\u0f0b" + // TIBETAN MARK INTERSYLLABIC TSHEG
      "\\u0f0c" + // TIBETAN MARK DELIMITER TSHEG BSTAR
      "\\u00b7";  // MIDDLE DOT

  private static final String HASHTAG_LETTERS_NUMERALS =
      HASHTAG_LETTERS_AND_MARKS + HASHTAG_NUMERALS + HASHTAG_SPECIAL_CHARS;
  private static final String HASHTAG_LETTERS_SET = "[" + HASHTAG_LETTERS_AND_MARKS + "]";
  private static final String HASHTAG_LETTERS_NUMERALS_SET = "[" + HASHTAG_LETTERS_NUMERALS + "]";

  /* URL related hash regex collection */
  private static final String URL_VALID_PRECEDING_CHARS =
      "(?:[^a-z0-9@＠$#＃" + INVALID_CHARACTERS + "]|[" + DIRECTIONAL_CHARACTERS + "]|^)";

  private static final String URL_VALID_CHARS = "[a-z0-9" + LATIN_ACCENTS_CHARS + "]";
  private static final String URL_VALID_SUBDOMAIN =
      "(?>(?:" + URL_VALID_CHARS + "[" + URL_VALID_CHARS + "\\-_]*)?" + URL_VALID_CHARS + "\\.)";
  private static final String URL_VALID_DOMAIN_NAME =
      "(?:(?:" + URL_VALID_CHARS + "[" + URL_VALID_CHARS + "\\-]*)?" + URL_VALID_CHARS + "\\.)";

  private static final String PUNCTUATION_CHARS = "-_!\"#$%&'\\(\\)*+,./:;<=>?@\\[\\]^`\\{|}~";

  // Any non-space, non-punctuation characters.
  // \p{Z} = any kind of whitespace or invisible separator.
  private static final String URL_VALID_UNICODE_CHARS =
      "[^" + PUNCTUATION_CHARS + "\\s\\p{Z}\\p{InGeneralPunctuation}]";
  private static final String URL_VALID_UNICODE_DOMAIN_NAME =
      "(?:(?:" + URL_VALID_UNICODE_CHARS + "[" + URL_VALID_UNICODE_CHARS + "\\-]*)?" +
          URL_VALID_UNICODE_CHARS + "\\.)";

  private static final String URL_PUNYCODE = "(?:xn--[-0-9a-z]+)";

  private static final String URL_VALID_DOMAIN =
    "(?:" +                                                   // optional sub-domain + domain + TLD
        URL_VALID_SUBDOMAIN + "*" + URL_VALID_DOMAIN_NAME +   // e.g. twitter.com, foo.co.jp ...
        "(?:" + URL_VALID_GTLD + "|" + URL_VALID_CCTLD + "|" + URL_PUNYCODE + ")" +
    ")" +
    "|(?:" + "(?<=https?://)" +
      "(?:" +
        "(?:" + URL_VALID_DOMAIN_NAME + URL_VALID_CCTLD + ")" +  // protocol + domain + ccTLD
          "|(?:" +
            URL_VALID_UNICODE_DOMAIN_NAME +                      // protocol + unicode domain + TLD
            "(?:" + URL_VALID_GTLD + "|" + URL_VALID_CCTLD + ")" +
          ")" +
      ")" +
    ")" +
    "|(?:" +                                                  // domain + ccTLD + '/'
      URL_VALID_DOMAIN_NAME + URL_VALID_CCTLD + "(?=/)" +     // e.g. t.co/
    ")";

  private static final String URL_VALID_PORT_NUMBER = "[0-9]++";

  private static final String URL_VALID_GENERAL_PATH_CHARS =
      "[a-z0-9!\\*';:=\\+,.\\$/%#\\[\\]\\-\\u2013_~\\|&@" +
          LATIN_ACCENTS_CHARS + CYRILLIC_CHARS + "]";

  /**
   * Allow URL paths to contain up to two nested levels of balanced parens
   *  1. Used in Wikipedia URLs like /Primer_(film)
   *  2. Used in IIS sessions like /S(dfd346)/
   *  3. Used in Rdio URLs like /track/We_Up_(Album_Version_(Edited))/
   */
  private static final String URL_BALANCED_PARENS = "\\(" +
    "(?:" +
      URL_VALID_GENERAL_PATH_CHARS + "+" +
      "|" +
      // allow one nested level of balanced parentheses
      "(?:" +
        URL_VALID_GENERAL_PATH_CHARS + "*" +
        "\\(" +
          URL_VALID_GENERAL_PATH_CHARS + "+" +
        "\\)" +
        URL_VALID_GENERAL_PATH_CHARS + "*" +
      ")" +
    ")" +
  "\\)";

  /**
   * Valid end-of-path characters (so /foo. does not gobble the period).
   *   2. Allow =&# for empty URL parameters and other URL-join artifacts
   */
  private static final String URL_VALID_PATH_ENDING_CHARS =
      "[a-z0-9=_#/\\-\\+" + LATIN_ACCENTS_CHARS + CYRILLIC_CHARS + "]|(?:" +
          URL_BALANCED_PARENS + ")";

  private static final String URL_VALID_PATH = "(?:" +
    "(?:" +
      URL_VALID_GENERAL_PATH_CHARS + "*" +
      "(?:" + URL_BALANCED_PARENS + URL_VALID_GENERAL_PATH_CHARS + "*)*" +
      URL_VALID_PATH_ENDING_CHARS +
    ")|(?:@" + URL_VALID_GENERAL_PATH_CHARS + "+/)" +
  ")";

  private static final String URL_VALID_URL_QUERY_CHARS =
      "[a-z0-9!?\\*'\\(\\);:&=\\+\\$/%#\\[\\]\\-_\\.,~\\|@]";
  private static final String URL_VALID_URL_QUERY_ENDING_CHARS = "[a-z0-9\\-_&=#/]";
  private static final String VALID_URL_PATTERN_STRING =
  "(" +                                                            //  $1 total match
    "(" + URL_VALID_PRECEDING_CHARS + ")" +                        //  $2 Preceding character
    "(" +                                                          //  $3 URL
      "(https?://)?" +                                             //  $4 Protocol (optional)
      "(" + URL_VALID_DOMAIN + ")" +                               //  $5 Domain(s)
      "(?::(" + URL_VALID_PORT_NUMBER + "))?" +                    //  $6 Port number (optional)
      "(/" +
        URL_VALID_PATH + "*+" +
      ")?" +                                                       //  $7 URL Path and anchor
      "(\\?" + URL_VALID_URL_QUERY_CHARS + "*" +                   //  $8 Query String
              URL_VALID_URL_QUERY_ENDING_CHARS + ")?" +
    ")" +
  ")";

  private static final String AT_SIGNS_CHARS = "@\uFF20";
  private static final String DOLLAR_SIGN_CHAR = "\\$";
  private static final String CASHTAG = "[a-z]{1,6}(?:[._][a-z]{1,2})?";

  /* Begin public constants */

  public static final Pattern INVALID_CHARACTERS_PATTERN;
  public static final Pattern VALID_HASHTAG;
  public static final int VALID_HASHTAG_GROUP_BEFORE = 1;
  public static final int VALID_HASHTAG_GROUP_HASH = 2;
  public static final int VALID_HASHTAG_GROUP_TAG = 3;
  public static final Pattern INVALID_HASHTAG_MATCH_END;
  public static final Pattern RTL_CHARACTERS;

  public static final Pattern AT_SIGNS;
  public static final Pattern VALID_MENTION_OR_LIST;
  public static final int VALID_MENTION_OR_LIST_GROUP_BEFORE = 1;
  public static final int VALID_MENTION_OR_LIST_GROUP_AT = 2;
  public static final int VALID_MENTION_OR_LIST_GROUP_USERNAME = 3;
  public static final int VALID_MENTION_OR_LIST_GROUP_LIST = 4;

  public static final Pattern VALID_REPLY;
  public static final int VALID_REPLY_GROUP_USERNAME = 1;

  public static final Pattern INVALID_MENTION_MATCH_END;

  /**
   * Regex to extract URL (it also includes the text preceding the url).
   *
   * This regex does not reflect its name and {@link Regex#VALID_URL_GROUP_URL} match
   * should be checked in order to match a valid url. This is not ideal, but the behavior is
   * being kept to ensure backwards compatibility. Ideally this regex should be
   * implemented with a negative lookbehind as opposed to a negated character class
   * but lack of JS support increases maint overhead if the logic is different by
   * platform.
   */

  public static final Pattern VALID_URL;
  public static final int VALID_URL_GROUP_ALL          = 1;
  public static final int VALID_URL_GROUP_BEFORE       = 2;
  public static final int VALID_URL_GROUP_URL          = 3;
  public static final int VALID_URL_GROUP_PROTOCOL     = 4;
  public static final int VALID_URL_GROUP_DOMAIN       = 5;
  public static final int VALID_URL_GROUP_PORT         = 6;
  public static final int VALID_URL_GROUP_PATH         = 7;
  public static final int VALID_URL_GROUP_QUERY_STRING = 8;

  public static final Pattern VALID_TCO_URL;
  public static final Pattern INVALID_URL_WITHOUT_PROTOCOL_MATCH_BEGIN;

  public static final Pattern VALID_CASHTAG;
  public static final int VALID_CASHTAG_GROUP_BEFORE = 1;
  public static final int VALID_CASHTAG_GROUP_DOLLAR = 2;
  public static final int VALID_CASHTAG_GROUP_CASHTAG = 3;

  public static final Pattern VALID_DOMAIN;

  // initializing in a static synchronized block,
  // there appears to be thread safety issues with Pattern.compile in android
  static {
    synchronized (Regex.class) {
      INVALID_CHARACTERS_PATTERN = Pattern.compile(".*[" + INVALID_CHARACTERS + "].*");
      VALID_HASHTAG = Pattern.compile("(^|\\uFE0E|\\uFE0F|[^&" + HASHTAG_LETTERS_NUMERALS +
          "])([#\uFF03])(?![\uFE0F\u20E3])(" + HASHTAG_LETTERS_NUMERALS_SET + "*" +
          HASHTAG_LETTERS_SET + HASHTAG_LETTERS_NUMERALS_SET + "*)", Pattern.CASE_INSENSITIVE);
      INVALID_HASHTAG_MATCH_END = Pattern.compile("^(?:[#＃]|://)");
      RTL_CHARACTERS = Pattern.compile("[\u0600-\u06FF\u0750-\u077F\u0590-\u05FF\uFE70-\uFEFF]");
      AT_SIGNS = Pattern.compile("[" + AT_SIGNS_CHARS + "]");
      VALID_MENTION_OR_LIST = Pattern.compile("([^a-z0-9_!#$%&*" + AT_SIGNS_CHARS +
          "]|^|(?:^|[^a-z0-9_+~.-])RT:?)(" + AT_SIGNS +
          "+)([a-z0-9_]{1,20})(/[a-z][a-z0-9_\\-]{0,24})?", Pattern.CASE_INSENSITIVE);
      VALID_REPLY = Pattern.compile("^(?:" + UNICODE_SPACES + "|" + DIRECTIONAL_CHARACTERS + ")*" +
          AT_SIGNS + "([a-z0-9_]{1,20})", Pattern.CASE_INSENSITIVE);
      INVALID_MENTION_MATCH_END =
          Pattern.compile("^(?:[" + AT_SIGNS_CHARS + LATIN_ACCENTS_CHARS + "]|://)");
      INVALID_URL_WITHOUT_PROTOCOL_MATCH_BEGIN = Pattern.compile("[-_./]$");

      VALID_URL = Pattern.compile(VALID_URL_PATTERN_STRING, Pattern.CASE_INSENSITIVE);
      VALID_TCO_URL = Pattern.compile("^https?://t\\.co/([a-z0-9]+)(?:\\?" +
          URL_VALID_URL_QUERY_CHARS + "*" + URL_VALID_URL_QUERY_ENDING_CHARS + ")?",
          Pattern.CASE_INSENSITIVE);
      VALID_CASHTAG = Pattern.compile("(^|" + UNICODE_SPACES + "|" + DIRECTIONAL_CHARACTERS + ")(" +
          DOLLAR_SIGN_CHAR + ")(" + CASHTAG + ")" + "(?=$|\\s|\\p{Punct})",
          Pattern.CASE_INSENSITIVE);
      VALID_DOMAIN = Pattern.compile(URL_VALID_DOMAIN, Pattern.CASE_INSENSITIVE);
    }
  }

  private static String join(@Nonnull Collection<?> col) {
    final StringBuilder sb = new StringBuilder();
    final Iterator<?> iter = col.iterator();
    if (iter.hasNext()) {
      sb.append(iter.next().toString());
    }
    while (iter.hasNext()) {
      sb.append("|");
      sb.append(iter.next().toString());
    }
    return sb.toString();
  }
}
