
package com.twitter;

import java.util.regex.*;

public class Regex {
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
    "\\u3000" +              // White_Space # Zs       IDEOGRAPHIC SPACE
  "]";

  private static String LATIN_ACCENTS_CHARS = "\\u00c0-\\u00d6\\u00d8-\\u00f6\\u00f8-\\u00ff" + // Latin-1
                                              "\\u0100-\\u024f" + // Latin Extended A and B
                                              "\\u0253\\u0254\\u0256\\u0257\\u0259\\u025b\\u0263\\u0268\\u026f\\u0272\\u0289\\u028b" + // IPA Extensions
                                              "\\u02bb" + // Hawaiian
                                              "\\u0300-\\u036f" + // Combining diacritics
                                              "\\u1e00-\\u1eff"; // Latin Extended Additional (mostly for Vietnamese)
  private static final String HASHTAG_ALPHA_CHARS = "a-z" + LATIN_ACCENTS_CHARS +
                                                   "\\u0400-\\u04ff\\u0500-\\u0527" +  // Cyrillic
                                                   "\\u2de0-\\u2dff\\ua640-\\ua69f" +  // Cyrillic Extended A/B
                                                   "\\u0591-\\u05bf\\u05c1-\\u05c2\\u05c4-\\u05c5\\u05c7" +
                                                   "\\u05d0-\\u05ea\\u05f0-\\u05f4" + // Hebrew
                                                   "\\ufb1d-\\ufb28\\ufb2a-\\ufb36\\ufb38-\\ufb3c\\ufb3e\\ufb40-\\ufb41" +
                                                   "\\ufb43-\\ufb44\\ufb46-\\ufb4f" + // Hebrew Pres. Forms
                                                   "\\u0610-\\u061a\\u0620-\\u065f\\u066e-\\u06d3\\u06d5-\\u06dc" +
                                                   "\\u06de-\\u06e8\\u06ea-\\u06ef\\u06fa-\\u06fc\\u06ff" + // Arabic
                                                   "\\u0750-\\u077f\\u08a0\\u08a2-\\u08ac\\u08e4-\\u08fe" + // Arabic Supplement and Extended A
                                                   "\\ufb50-\\ufbb1\\ufbd3-\\ufd3d\\ufd50-\\ufd8f\\ufd92-\\ufdc7\\ufdf0-\\ufdfb" + // Pres. Forms A
                                                   "\\ufe70-\\ufe74\\ufe76-\\ufefc" + // Pres. Forms B
                                                   "\\u200c" +                        // Zero-Width Non-Joiner
                                                   "\\u0e01-\\u0e3a\\u0e40-\\u0e4e" + // Thai
                                                   "\\u1100-\\u11ff\\u3130-\\u3185\\uA960-\\uA97F\\uAC00-\\uD7AF\\uD7B0-\\uD7FF" + // Hangul (Korean)
                                                   "\\p{InHiragana}\\p{InKatakana}" +  // Japanese Hiragana and Katakana
                                                   "\\p{InCJKUnifiedIdeographs}" +     // Japanese Kanji / Chinese Han
                                                   "\\u3003\\u3005\\u303b" +           // Kanji/Han iteration marks
                                                   "\\uff21-\\uff3a\\uff41-\\uff5a" +  // full width Alphabet
                                                   "\\uff66-\\uff9f" +                 // half width Katakana
                                                   "\\uffa1-\\uffdc";                  // half width Hangul (Korean)
  private static final String HASHTAG_ALPHA_NUMERIC_CHARS = "0-9\\uff10-\\uff19_" + HASHTAG_ALPHA_CHARS;
  private static final String HASHTAG_ALPHA = "[" + HASHTAG_ALPHA_CHARS +"]";
  private static final String HASHTAG_ALPHA_NUMERIC = "[" + HASHTAG_ALPHA_NUMERIC_CHARS +"]";

  /* URL related hash regex collection */
  private static final String URL_VALID_PRECEEDING_CHARS = "(?:[^A-Z0-9@＠$#＃\u202A-\u202E]|^)";

  private static final String URL_VALID_CHARS = "[\\p{Alnum}" + LATIN_ACCENTS_CHARS + "]";
  private static final String URL_VALID_SUBDOMAIN = "(?:(?:" + URL_VALID_CHARS + "[" + URL_VALID_CHARS + "\\-_]*)?" + URL_VALID_CHARS + "\\.)";
  private static final String URL_VALID_DOMAIN_NAME = "(?:(?:" + URL_VALID_CHARS + "[" + URL_VALID_CHARS + "\\-]*)?" + URL_VALID_CHARS + "\\.)";
  /* Any non-space, non-punctuation characters. \p{Z} = any kind of whitespace or invisible separator. */
  private static final String URL_VALID_UNICODE_CHARS = "[.[^\\p{Punct}\\s\\p{Z}\\p{InGeneralPunctuation}]]";

  private static final String URL_VALID_GTLD =
      "(?:(?:aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|xxx)(?=[^\\p{Alnum}@]|$))";
  private static final String URL_VALID_CCTLD =
      "(?:(?:ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|" +
      "bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|" +
      "er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|" +
      "hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|" +
      "lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|" +
      "nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|" +
      "sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|" +
      "va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|za|zm|zw)(?=[^\\p{Alnum}@]|$))";
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
    "|(?:" + "(?<=https?://)" +
      "(?:" +
        "(?:" + URL_VALID_DOMAIN_NAME + URL_VALID_CCTLD + ")" +  // protocol + domain + ccTLD
        "|(?:" +
          URL_VALID_UNICODE_CHARS + "+\\." +                     // protocol + unicode domain + TLD
          "(?:" + URL_VALID_GTLD + "|" + URL_VALID_CCTLD + ")" +
        ")" +
      ")" +
    ")" +
    "|(?:" +                                                  // domain + ccTLD + '/'
      URL_VALID_DOMAIN_NAME + URL_VALID_CCTLD + "(?=/)" +     // e.g. t.co/
    ")";

  private static final String URL_VALID_PORT_NUMBER = "[0-9]++";

  private static final String URL_VALID_GENERAL_PATH_CHARS = "[a-z0-9!\\*';:=\\+,.\\$/%#\\[\\]\\-_~\\|&@" + LATIN_ACCENTS_CHARS + "]";
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

  private static final String URL_VALID_URL_QUERY_CHARS = "[a-z0-9!?\\*'\\(\\);:&=\\+\\$/%#\\[\\]\\-_\\.,~\\|@]";
  private static final String URL_VALID_URL_QUERY_ENDING_CHARS = "[a-z0-9_&=#/]";
  private static final String VALID_URL_PATTERN_STRING =
  "(" +                                                            //  $1 total match
    "(" + URL_VALID_PRECEEDING_CHARS + ")" +                       //  $2 Preceeding chracter
    "(" +                                                          //  $3 URL
      "(https?://)?" +                                             //  $4 Protocol (optional)
      "(" + URL_VALID_DOMAIN + ")" +                               //  $5 Domain(s)
      "(?::(" + URL_VALID_PORT_NUMBER +"))?" +                     //  $6 Port number (optional)
      "(/" +
        URL_VALID_PATH + "*+" +
      ")?" +                                                       //  $7 URL Path and anchor
      "(\\?" + URL_VALID_URL_QUERY_CHARS + "*" +                   //  $8 Query String
              URL_VALID_URL_QUERY_ENDING_CHARS + ")?" +
    ")" +
  ")";

  private static String AT_SIGNS_CHARS = "@\uFF20";

  private static final String DOLLAR_SIGN_CHAR = "\\$";
  private static final String CASHTAG = "[a-z]{1,6}(?:[._][a-z]{1,2})?";

  /* Begin public constants */

  public static final Pattern VALID_HASHTAG = Pattern.compile("(^|[^&" + HASHTAG_ALPHA_NUMERIC_CHARS + "])(#|\uFF03)(" + HASHTAG_ALPHA_NUMERIC + "*" + HASHTAG_ALPHA + HASHTAG_ALPHA_NUMERIC + "*)", Pattern.CASE_INSENSITIVE);
  public static final int VALID_HASHTAG_GROUP_BEFORE = 1;
  public static final int VALID_HASHTAG_GROUP_HASH = 2;
  public static final int VALID_HASHTAG_GROUP_TAG = 3;
  public static final Pattern INVALID_HASHTAG_MATCH_END = Pattern.compile("^(?:[#＃]|://)");
  public static final Pattern RTL_CHARACTERS = Pattern.compile("[\u0600-\u06FF\u0750-\u077F\u0590-\u05FF\uFE70-\uFEFF]");

  public static final Pattern AT_SIGNS = Pattern.compile("[" + AT_SIGNS_CHARS + "]");
  public static final Pattern VALID_MENTION_OR_LIST = Pattern.compile("([^a-z0-9_!#$%&*" + AT_SIGNS_CHARS + "]|^|RT:?)(" + AT_SIGNS + "+)([a-z0-9_]{1,20})(/[a-z][a-z0-9_\\-]{0,24})?", Pattern.CASE_INSENSITIVE);
  public static final int VALID_MENTION_OR_LIST_GROUP_BEFORE = 1;
  public static final int VALID_MENTION_OR_LIST_GROUP_AT = 2;
  public static final int VALID_MENTION_OR_LIST_GROUP_USERNAME = 3;
  public static final int VALID_MENTION_OR_LIST_GROUP_LIST = 4;

  public static final Pattern VALID_REPLY = Pattern.compile("^(?:" + UNICODE_SPACES + ")*" + AT_SIGNS + "([a-z0-9_]{1,20})", Pattern.CASE_INSENSITIVE);
  public static final int VALID_REPLY_GROUP_USERNAME = 1;

  public static final Pattern INVALID_MENTION_MATCH_END = Pattern.compile("^(?:[" + AT_SIGNS_CHARS + LATIN_ACCENTS_CHARS + "]|://)");

  public static final Pattern VALID_URL = Pattern.compile(VALID_URL_PATTERN_STRING, Pattern.CASE_INSENSITIVE);
  public static final int VALID_URL_GROUP_ALL          = 1;
  public static final int VALID_URL_GROUP_BEFORE       = 2;
  public static final int VALID_URL_GROUP_URL          = 3;
  public static final int VALID_URL_GROUP_PROTOCOL     = 4;
  public static final int VALID_URL_GROUP_DOMAIN       = 5;
  public static final int VALID_URL_GROUP_PORT         = 6;
  public static final int VALID_URL_GROUP_PATH         = 7;
  public static final int VALID_URL_GROUP_QUERY_STRING = 8;

  public static final Pattern VALID_TCO_URL = Pattern.compile("^https?:\\/\\/t\\.co\\/[a-z0-9]+", Pattern.CASE_INSENSITIVE);
  public static final Pattern INVALID_URL_WITHOUT_PROTOCOL_MATCH_BEGIN = Pattern.compile("[-_./]$");

  public static final Pattern VALID_CASHTAG = Pattern.compile("(^|" + UNICODE_SPACES + ")(" + DOLLAR_SIGN_CHAR + ")(" + CASHTAG + ")" +"(?=$|\\s|\\p{Punct})", Pattern.CASE_INSENSITIVE);
  public static final int VALID_CASHTAG_GROUP_BEFORE = 1;
  public static final int VALID_CASHTAG_GROUP_DOLLAR = 2;
  public static final int VALID_CASHTAG_GROUP_CASHTAG = 3;
}
