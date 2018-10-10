// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

package com.twitter.twittertext;

import java.util.regex.Pattern;

import junit.framework.TestCase;

public class RegexTest extends TestCase {
  public void testAutoLinkHashtags() {
    assertCaptureCount(3, Regex.VALID_HASHTAG, "#hashtag");
    assertCaptureCount(3, Regex.VALID_HASHTAG, "#Azərbaycanca");
    assertCaptureCount(3, Regex.VALID_HASHTAG, "#mûǁae");
    assertCaptureCount(3, Regex.VALID_HASHTAG, "#Čeština");
    assertCaptureCount(3, Regex.VALID_HASHTAG, "#Ċaoiṁín");
    assertCaptureCount(3, Regex.VALID_HASHTAG, "#Caoiṁín");
    assertCaptureCount(3, Regex.VALID_HASHTAG, "#ta\u0301im");
    assertCaptureCount(3, Regex.VALID_HASHTAG, "#hag\u0303ua");
    assertCaptureCount(3, Regex.VALID_HASHTAG, "#caf\u00E9");
    assertCaptureCount(3, Regex.VALID_HASHTAG, "#\u05e2\u05d1\u05e8\u05d9\u05ea"); // "#Hebrew"
    assertCaptureCount(3, Regex.VALID_HASHTAG,
        "#\u05d0\u05b2\u05e9\u05b6\u05c1\u05e8"); // with marks
    assertCaptureCount(3, Regex.VALID_HASHTAG,
        "#\u05e2\u05b7\u05dc\u05be\u05d9\u05b0\u05d3\u05b5\u05d9"); // with maqaf 05be
    assertCaptureCount(3, Regex.VALID_HASHTAG, "#\u05d5\u05db\u05d5\u05f3"); // with geresh 05f3
    assertCaptureCount(3, Regex.VALID_HASHTAG, "#\u05de\u05f4\u05db"); // with gershayim 05f4
    assertCaptureCount(3, Regex.VALID_HASHTAG,
        "#\u0627\u0644\u0639\u0631\u0628\u064a\u0629"); // "#Arabic"
    assertCaptureCount(3, Regex.VALID_HASHTAG,
        "#\u062d\u0627\u0644\u064a\u0627\u064b"); // with mark
    assertCaptureCount(3, Regex.VALID_HASHTAG,
        "#\u064a\u0640\ufbb1\u0640\u064e\u0671"); // with pres. form
    assertCaptureCount(3, Regex.VALID_HASHTAG, "#ประเทศไทย");
    assertCaptureCount(3, Regex.VALID_HASHTAG, "#ฟรี"); // with mark
    assertCaptureCount(3, Regex.VALID_HASHTAG, "#日本語ハッシュタグ");
    assertCaptureCount(3, Regex.VALID_HASHTAG, "＃日本語ハッシュタグ");

    assertTrue(Regex.VALID_HASHTAG.matcher("これはOK #ハッシュタグ").find());
    assertTrue(Regex.VALID_HASHTAG.matcher("これもOK。#ハッシュタグ").find());
    assertFalse(Regex.VALID_HASHTAG.matcher("これはダメ#ハッシュタグ").find());

    assertFalse(Regex.VALID_HASHTAG.matcher("#1").find());
    assertFalse(Regex.VALID_HASHTAG.matcher("#0").find());
  }

  public void testAutoLinkUsernamesOrLists() {
    assertCaptureCount(4, Regex.VALID_MENTION_OR_LIST, "@username");
    assertCaptureCount(4, Regex.VALID_MENTION_OR_LIST, "@username/list");
  }

  public void testValidURL() {
    assertCaptureCount(8, Regex.VALID_URL, "http://example.com");
    assertCaptureCount(8, Regex.VALID_URL, "http://はじめよう.みんな");
    assertCaptureCount(8, Regex.VALID_URL, "http://はじめよう.香港");
    assertCaptureCount(8, Regex.VALID_URL, "http://はじめよう.الجزائر");
    assertCaptureCount(8, Regex.VALID_URL, "http://test.scot");
  }

  public void testValidURLDoesNotCrashOnLongPaths() {
    final String text = "Check out http://example.com/";
    final StringBuilder longPathIsLong = new StringBuilder(text);
    for (int i = 0; i < 1500; i++) {
      longPathIsLong.append("a");
    }
    assertTrue("Failed to correctly match a very long path",
        Regex.VALID_URL.matcher(longPathIsLong.toString()).find());
  }

  public void testValidUrlDoesNotTakeForeverOnRepeatedPuctuationAtEnd() {
    final String[] repeatedPaths = {
        "Try http://example.com/path**********************",
        "http://foo.org/bar/foo-bar-foo-bar.aspx!!!!!! Test"
    };

    for (String text : repeatedPaths) {
      final long start = System.currentTimeMillis();
      final int NUM_RUNS = 100;
      for (int i = 0; i < NUM_RUNS - 1; i++) {
        Regex.VALID_URL.matcher(text).find();
        Regex.VALID_URL.matcher(text).matches();
      }
      final boolean isValid = Regex.VALID_URL.matcher(text).find();
      Regex.VALID_URL.matcher(text).matches();
      final long end = System.currentTimeMillis();

      assertTrue("Should be able to extract a valid URL even followed by punctuations", isValid);

      final long duration = end - start;
      assertTrue("Matching a repeated path end should take less than 10ms (took " +
          (duration / NUM_RUNS) + "ms)", duration < 10 * NUM_RUNS);
    }
  }

  public void testValidURLWithoutProtocol() {
    assertTrue("Matching a URL with gTLD without protocol.",
        Regex.VALID_URL.matcher("twitter.com").matches());

    assertTrue("Matching a URL with ccTLD without protocol.",
        Regex.VALID_URL.matcher("www.foo.co.jp").matches());

    assertTrue("Matching a URL with gTLD followed by ccTLD without protocol.",
        Regex.VALID_URL.matcher("www.foo.org.za").matches());

    assertTrue("Match a short URL with ccTLD with protocol.",
        Regex.VALID_URL.matcher("http://t.co").matches());

    assertFalse("Should not match a short URL with empty TLD with protocol.",
        Regex.VALID_URL.matcher("http://twitt").matches());

    assertFalse("Should not match a short URL with empty TLD without protocol.",
        Regex.VALID_URL.matcher("twitt").matches());

    assertTrue("Match a short URL with ccTLD without protocol.",
        Regex.VALID_URL.matcher("it.so").matches());

    assertFalse("Should not match a URL with invalid gTLD.",
        Regex.VALID_URL.matcher("www.xxxxxxx.baz").find());

    assertTrue("Match a short URL with ccTLD and '/' without protocol.",
        Regex.VALID_URL.matcher("t.co/blahblah").matches());

    assertFalse("Should not match a URL with non-ASCII characters in the domain name without " +
            "protocol.", Regex.VALID_URL.matcher("はじめよう.みんな").matches());

    assertTrue("Should match a URL with non-ASCII characters & hyphen in the domain name with " +
            "protocol.", Regex.VALID_URL.matcher("http://はじめ-よう.みんな").matches());

    assertTrue("Should match a URL with IDNA prefix and valid ASCII characters with protocol",
        Regex.VALID_URL.matcher("http://xn--p8j9a0d9c9a.com/index.html").matches());

    assertTrue("Should match a URL with IDNA prefix and non-ASCII characters with protocol",
        Regex.VALID_URL.matcher("http://xn--はじめよう.com/index.html").matches());
  }

  public void testValidUrlDoesNotOverflowOnLongDomains() {
    final StringBuilder domainIsLong = new StringBuilder("cool");
    for (int i = 0; i < 1500; i++) {
      domainIsLong.append(".cool");
    }
    assertTrue("Match a super long url",
        Regex.VALID_URL.matcher(domainIsLong.toString()).matches());
  }

  public void testInvalidUrlWithDirectionalCharacter() {
    final char[] directionalChar = new char[]{'\u202A', '\u202B', '\u202C', '\u202D', '\u202E'};
    for (char c : directionalChar) {
      assertFalse("Should not extract URLs with directional character",
          Regex.VALID_URL.matcher("http://twitt" + c + ".com").find());
    }
  }

  public void testExtractMentions() {
    assertCaptureCount(4, Regex.VALID_MENTION_OR_LIST, "sample @user mention");
  }

  public void testInvalidMentions() {
    final char[] invalidChars = new char[]{'!', '@', '#', '$', '%', '&', '*'};
    for (char c : invalidChars) {
      assertFalse("Failed to ignore a mention preceded by " + c,
          Regex.VALID_MENTION_OR_LIST.matcher("f" + c + "@kn").find());
    }
  }

  public void testExtractReply() {
    assertCaptureCount(1, Regex.VALID_REPLY, "@user reply");
    assertCaptureCount(1, Regex.VALID_REPLY, " @user reply");
    assertCaptureCount(1, Regex.VALID_REPLY, "\u3000@user reply");
  }

  private void assertCaptureCount(int expectedCount, Pattern pattern, String sample) {
    assertTrue("Pattern failed to match sample: '" + sample + "'",
               pattern.matcher(sample).find());
    assertEquals("Does not have " + expectedCount + " captures as expected: '" + sample + "'",
                 expectedCount,
                 pattern.matcher(sample).groupCount());
  }
}
