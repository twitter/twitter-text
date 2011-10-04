
package com.twitter;

import java.util.regex.*;

public class Regex {
  private static String LATIN_ACCENTS_CHARS = "\\u00c0-\\u00d6\\u00d8-\\u00f6\\u00f8-\\u00ff\\u015f";
  private static final String HASHTAG_ALPHA_CHARS = "a-z" + LATIN_ACCENTS_CHARS +
                                                   "\\u0400-\\u04ff\\u0500-\\u0527" +  // Cyrillic
                                                   "\\u2de0–\\u2dff\\ua640–\\ua69f" +  // Cyrillic Extended A/B
                                                   "\\u1100-\\u11ff\\u3130-\\u3185\\uA960-\\uA97F\\uAC00-\\uD7AF\\uD7B0-\\uD7FF" + // Hangul (Korean)
                                                   "\\p{InHiragana}\\p{InKatakana}" +  // Japanese Hiragana and Katakana
                                                   "\\p{InCJKUnifiedIdeographs}" +     // Japanese Kanji / Chinese Han
                                                   "\\u3005\\u303b" +                  // Kanji/Han iteration marks
                                                   "\\uff21-\\uff3a\\uff41-\\uff5a" +  // full width Alphabet
                                                   "\\uff66-\\uff9f" +                 // half width Katakana
                                                   "\\uffa1-\\uffdc";                  // half width Hangul (Korean)
  private static final String HASHTAG_ALPHA_NUMERIC_CHARS = "0-9\\uff10-\\uff19_" + HASHTAG_ALPHA_CHARS;
  private static final String HASHTAG_ALPHA = "[" + HASHTAG_ALPHA_CHARS +"]";
  private static final String HASHTAG_ALPHA_NUMERIC = "[" + HASHTAG_ALPHA_NUMERIC_CHARS +"]";

  /* URL related hash regex collection */
  private static final String URL_VALID_PRECEEDING_CHARS = "(?:[^\\-/\"'!=A-Z0-9_@＠.]|^)";

  private static final String URL_VALID_CHARS = "[\\p{Alnum}" + LATIN_ACCENTS_CHARS + "]";
  private static final String URL_VALID_SUBDOMAIN = "(?:(?:" + URL_VALID_CHARS + "[" + URL_VALID_CHARS + "\\-_]*)?" + URL_VALID_CHARS + "\\.)";
  private static final String URL_VALID_DOMAIN_NAME = "(?:(?:" + URL_VALID_CHARS + "[" + URL_VALID_CHARS + "\\-]*)?" + URL_VALID_CHARS + "\\.)";
  private static final String URL_VALID_UNICODE_CHARS = "[.[^\\p{Punct}\\s\\p{Zs}\\p{InGeneralPunctuation}]]";

  private static final String URL_VALID_GTLD =
      "(?:(?:aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel)(?=\\P{Alpha}|$))";
  private static final String URL_VALID_CCTLD =
      "(?:(?:ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|" +
      "bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|" +
      "er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|" +
      "hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|" +
      "lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|" +
      "nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|" +
      "sl|sm|sn|so|sr|ss|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|" +
      "va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|za|zm|zw)(?=\\P{Alpha}|$))";
  private static final String URL_PUNYCODE = "(?:xn--[0-9a-z]+)";

  private static final String URL_VALID_DOMAIN =
    "(?:" +                                                   // subdomains + domain + TLD
        URL_VALID_SUBDOMAIN + "+" + URL_VALID_DOMAIN_NAME +   // e.g. www.twitter.com, foo.co.jp, bar.co.uk
        "(?:" + URL_VALID_GTLD + "|" + URL_VALID_CCTLD + "|" + URL_PUNYCODE + ")" +
      ")" +
    "|(?:" +                                                  // domain + gTLD
      URL_VALID_DOMAIN_NAME +                                 // e.g. twitter.com
      "(?:" + URL_VALID_GTLD + "|" + URL_PUNYCODE + ")" +
    ")" +
    "|(?:" + "(?<=https?://)" +                               // protocol + domain + ccTLD
      "(?:(?:" + URL_VALID_DOMAIN_NAME + URL_VALID_CCTLD + ")" + // e.g. http://t.co
      "|(?:" + URL_VALID_UNICODE_CHARS + "+\\.(?:" + URL_VALID_GTLD + "|" + URL_VALID_CCTLD + ")))" +
    ")" +
    "|(?:" +                                                  // domain + ccTLD + '/'
      URL_VALID_DOMAIN_NAME + URL_VALID_CCTLD + "(?=/)" +     // e.g. t.co/
    ")";

  private static final String URL_VALID_PORT_NUMBER = "[0-9]++";

  private static final String URL_VALID_GENERAL_PATH_CHARS = "[a-z0-9!\\*';:=\\+,.\\$/%#\\[\\]\\-_~\\|&" + LATIN_ACCENTS_CHARS + "]";
  /** Allow URL paths to contain balanced parens
   *  1. Used in Wikipedia URLs like /Primer_(film)
   *  2. Used in IIS sessions like /S(dfd346)/
  **/
  private static final String URL_BALANCED_PARENS = "\\(" + URL_VALID_GENERAL_PATH_CHARS + "+\\)";
  /** Valid end-of-path chracters (so /foo. does not gobble the period).
   *   2. Allow =&# for empty URL parameters and other URL-join artifacts
  **/
  private static final String URL_VALID_PATH_ENDING_CHARS = "[a-z0-9=_#/\\-\\+" + LATIN_ACCENTS_CHARS + "]|(?:" + URL_BALANCED_PARENS +")";

  private static final String URL_VALID_PATH = "(?:" +
    "(?:" +
      URL_VALID_GENERAL_PATH_CHARS + "*" +
      "(?:" + URL_BALANCED_PARENS + URL_VALID_GENERAL_PATH_CHARS + "*)*" +
      URL_VALID_PATH_ENDING_CHARS +
    ")|(?:@" + URL_VALID_GENERAL_PATH_CHARS + "+/)" +
  ")";

  private static final String URL_VALID_URL_QUERY_CHARS = "[a-z0-9!\\*'\\(\\);:&=\\+\\$/%#\\[\\]\\-_\\.,~\\|]";
  private static final String URL_VALID_URL_QUERY_ENDING_CHARS = "[a-z0-9_&=#/]";
  private static final String VALID_URL_PATTERN_STRING =
  "(" +                                                            //  $1 total match
    "(" + URL_VALID_PRECEEDING_CHARS + ")" +                       //  $2 Preceeding chracter
    "(" +                                                          //  $3 URL
      "(https?://)?" +                                             //  $4 Protocol (optional)
      "(" + URL_VALID_DOMAIN + ")" +                               //  $5 Domain(s)
      "(?::(" + URL_VALID_PORT_NUMBER +"))?" +                     //  $6 Port number (optional)
      "(/" +
        URL_VALID_PATH + "*" +
      ")?" +                                                       //  $7 URL Path and anchor
      "(\\?" + URL_VALID_URL_QUERY_CHARS + "*" +                   //  $8 Query String
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
  public static final int VALID_URL_GROUP_PORT         = 6;
  public static final int VALID_URL_GROUP_PATH         = 7;
  public static final int VALID_URL_GROUP_QUERY_STRING = 8;

  public static final Pattern EXTRACT_MENTIONS = Pattern.compile("(^|[^a-z0-9_])" + AT_SIGNS + "([a-z0-9_]{1,20})(?=(.|$))", Pattern.CASE_INSENSITIVE);
  public static final int EXTRACT_MENTIONS_GROUP_BEFORE = 1;
  public static final int EXTRACT_MENTIONS_GROUP_USERNAME = 2;
  public static final int EXTRACT_MENTIONS_GROUP_AFTER = 3;

  public static final Pattern EXTRACT_REPLY = Pattern.compile("^(?:[" + com.twitter.regex.Spaces.getCharacterClass() + "])*" + AT_SIGNS + "([a-z0-9_]{1,20}).*", Pattern.CASE_INSENSITIVE);
  public static final int EXTRACT_REPLY_GROUP_USERNAME = 1;
}
