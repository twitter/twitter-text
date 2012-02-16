
package com.twitter;

import java.util.regex.*;
import junit.framework.TestCase;

public class RegexTest extends TestCase {
  public void testAutoLinkHashtags() {
    assertCaptureCount(3, Regex.AUTO_LINK_HASHTAGS, "#hashtag");
    assertCaptureCount(3, Regex.AUTO_LINK_HASHTAGS, "#Azərbaycanca");
    assertCaptureCount(3, Regex.AUTO_LINK_HASHTAGS, "#mûǁae");
    assertCaptureCount(3, Regex.AUTO_LINK_HASHTAGS, "#Čeština");
    assertCaptureCount(3, Regex.AUTO_LINK_HASHTAGS, "#Ċaoiṁín");
    assertCaptureCount(3, Regex.AUTO_LINK_HASHTAGS, "#Caoiṁín");
    assertCaptureCount(3, Regex.AUTO_LINK_HASHTAGS, "#caf\u00E9");
    assertCaptureCount(3, Regex.AUTO_LINK_HASHTAGS, "#\u05e2\u05d1\u05e8\u05d9\u05ea"); // "#Hebrew"
    assertCaptureCount(3, Regex.AUTO_LINK_HASHTAGS, "#\u05d0\u05b2\u05e9\u05b6\u05c1\u05e8"); // with marks
    assertCaptureCount(3, Regex.AUTO_LINK_HASHTAGS, "#\u0627\u0644\u0639\u0631\u0628\u064a\u0629"); // "#Arabic"
    assertCaptureCount(3, Regex.AUTO_LINK_HASHTAGS, "#\u062d\u0627\u0644\u064a\u0627\u064b"); // with mark
    assertCaptureCount(3, Regex.AUTO_LINK_HASHTAGS, "#\u064a\u0640\ufbb1\u0640\u064e\u0671"); // with pres. form
    assertCaptureCount(3, Regex.AUTO_LINK_HASHTAGS, "#ประเทศไทย");
    assertCaptureCount(3, Regex.AUTO_LINK_HASHTAGS, "#ฟรี"); // with mark
    assertCaptureCount(3, Regex.AUTO_LINK_HASHTAGS, "#日本語ハッシュタグ");
    assertCaptureCount(3, Regex.AUTO_LINK_HASHTAGS, "＃日本語ハッシュタグ");

    assertTrue(Regex.AUTO_LINK_HASHTAGS.matcher("これはOK #ハッシュタグ").find());
    assertTrue(Regex.AUTO_LINK_HASHTAGS.matcher("これもOK。#ハッシュタグ").find());
    assertFalse(Regex.AUTO_LINK_HASHTAGS.matcher("これはダメ#ハッシュタグ").find());

    assertFalse(Regex.AUTO_LINK_HASHTAGS.matcher("#1").find());
    assertFalse(Regex.AUTO_LINK_HASHTAGS.matcher("#0").find());
  }

  public void testAutoLinkUsernamesOrLists() {
    assertCaptureCount(4, Regex.AUTO_LINK_USERNAMES_OR_LISTS, "@username");
    assertCaptureCount(4, Regex.AUTO_LINK_USERNAMES_OR_LISTS, "@username/list");
  }

  public void testValidURL() {
    assertCaptureCount(8, Regex.VALID_URL, "http://example.com");
  }

  public void testValidURLDoesNotCrashOnLongPaths() {
    String longPathIsLong = "Check out http://example.com/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    assertTrue("Failed to correctly match a very long path", Regex.VALID_URL.matcher(longPathIsLong).find());
  }

  public void testValidUrlDoesNotTakeForeverOnRepeatedPuctuationAtEnd() {
    String[] repeatedPaths = {
        "Try http://example.com/path**********************",
        "http://foo.org/bar/foo-bar-foo-bar.aspx!!!!!! Test"
    };

    for (String text : repeatedPaths) {
      long start = System.currentTimeMillis();
      boolean isValid = Regex.VALID_URL.matcher(text).find();
      Regex.VALID_URL.matcher(text).matches();
      long end = System.currentTimeMillis();

      assertTrue("Should be able to extract a valid URL even followed by punctuations", isValid);

      long duration = (end - start);
      assertTrue("Matching a repeated path end should take less than 10ms (took " + duration + "ms)", (duration < 10) );
    }
  }

  public void testValidURLWithoutProtocol() {
    assertTrue("Matching a URL with gTLD without protocol.",
        Regex.VALID_URL.matcher("twitter.com").matches());

    assertTrue("Matching a URL with ccTLD without protocol.",
        Regex.VALID_URL.matcher("www.foo.co.jp").matches());

    assertTrue("Matching a URL with gTLD followed by ccTLD without protocol.",
        Regex.VALID_URL.matcher("www.foo.org.za").matches());

    assertTrue("Should not match a short URL with ccTLD without protocol.",
        Regex.VALID_URL.matcher("http://t.co").matches());

    assertFalse("Should not match a short URL with ccTLD without protocol.",
        Regex.VALID_URL.matcher("t.co").matches());

    assertFalse("Should not match a URL with invalid gTLD.",
        Regex.VALID_URL.matcher("www.foo.bar").find());

    assertTrue("Match a short URL with ccTLD and '/' but without protocol.",
        Regex.VALID_URL.matcher("t.co/blahblah").matches());
  }

  public void testInvalidUrlWithInvalidCharacter() {
    char[] invalid_chars = new char[]{'\u202A', '\u202B', '\u202C', '\u202D', '\u202E'};
    for (char c : invalid_chars) {
      assertFalse("Should not extract URLs with invalid character",
          Regex.VALID_URL.matcher("http://twitt" + c + "er.com").find());
    }
  }

  public void testExtractMentions() {
    assertCaptureCount(2, Regex.EXTRACT_MENTIONS, "sample @user mention");
  }

  public void testInvalidMentions() {
    char[] invalid_chars = new char[]{'!', '@', '#', '$', '%', '&', '*'};
    for (char c : invalid_chars) {
      assertFalse("Failed to ignore a mention preceded by " + c, Regex.EXTRACT_MENTIONS.matcher("f" + c + "@kn").find());
    }
  }

  public void testExtractReply() {
    assertCaptureCount(1, Regex.EXTRACT_REPLY, "@user reply");
    assertCaptureCount(1, Regex.EXTRACT_REPLY, " @user reply");
    assertCaptureCount(1, Regex.EXTRACT_REPLY, "\u3000@user reply");
  }

  private void assertCaptureCount(int expectedCount, Pattern pattern, String sample) {
    assertTrue("Pattern failed to match sample: '" + sample + "'",
               pattern.matcher(sample).find());
    assertEquals("Does not have " + expectedCount + " captures as expected: '" + sample + "'",
                 expectedCount,
                 pattern.matcher(sample).groupCount());
  }
}
