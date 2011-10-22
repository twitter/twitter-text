
package com.twitter;

import java.util.Arrays;

import junit.framework.TestCase;

public class AutolinkTest extends TestCase {
  private Autolink linker;

  public void setUp() {
    linker = new Autolink();
  }

  public void testNoFollowByDefault() {
    String tweet = "This has a #hashtag";
    String expected = "This has a <a href=\"http://twitter.com/search?q=%23hashtag\" title=\"#hashtag\" class=\"tweet-url hashtag\" rel=\"nofollow\">#hashtag</a>";
    assertAutolink(expected, linker.autoLinkHashtags(tweet));
  }

  public void testNoFollowDisabled() {
    linker.setNoFollow(false);
    String tweet = "This has a #hashtag";
    String expected = "This has a <a href=\"http://twitter.com/search?q=%23hashtag\" title=\"#hashtag\" class=\"tweet-url hashtag\">#hashtag</a>";
    assertAutolink(expected, linker.autoLinkHashtags(tweet));
  }

  /** See Also: http://github.com/mzsanford/twitter-text-rb/issues#issue/5 */
  public void testBlogspotWithDash() {
    linker.setNoFollow(false);
    String tweet = "Url: http://samsoum-us.blogspot.com/2010/05/la-censure-nuit-limage-de-notre-pays.html";
    String expected = "Url: <a href=\"http://samsoum-us.blogspot.com/2010/05/la-censure-nuit-limage-de-notre-pays.html\">http://samsoum-us.blogspot.com/2010/05/la-censure-nuit-limage-de-notre-pays.html</a>";
    assertAutolink(expected, linker.autoLinkURLs(tweet));
  }

  /** See also: https://github.com/mzsanford/twitter-text-java/issues/8 */
  public void testURLWithDollarThatLooksLikeARegex() {
    linker.setNoFollow(false);
    String tweet = "Url: http://example.com/$ABC";
    String expected = "Url: <a href=\"http://example.com/$ABC\">http://example.com/$ABC</a>";
    assertAutolink(expected, linker.autoLinkURLs(tweet));
  }

  public void testURLWithoutProtocol() {
    linker.setNoFollow(false);
    String tweet = "Url: www.twitter.com http://www.twitter.com";
    String expected = "Url: www.twitter.com <a href=\"http://www.twitter.com\">http://www.twitter.com</a>";
    assertAutolink(expected, linker.autoLinkURLs(tweet));
  }

  public void testWithAngleBrackets() {
    linker.setNoFollow(false);
    String tweet = "(Debugging) <3 #idol2011";
    String expected = "(Debugging) &lt;3 <a href=\"http://twitter.com/search?q=%23idol2011\" title=\"#idol2011\" class=\"tweet-url hashtag\">#idol2011</a>";
    assertAutolink(expected, linker.autoLink(tweet));
  }

  protected void assertAutolink(String expected, String linked) {
    assertEquals("Autolinked text should equal the input", expected, linked);
  }

  public void testSplit() {
    String text = "Url: <a href=\"http://example.com/$ABC\">http://example.com/$ABC</a>";
    assertEquals(Arrays.asList(text.split("[<>]", -1)), Autolink.split(text, "<>"));

    text = "";
    assertFalse(Autolink.split(text, "<>").iterator().hasNext());

    text = "there is no bracket in this text.";
    assertEquals(Arrays.asList(text.split("[<>]", -1)), Autolink.split(text, "<>"));

    text = "><><><><";
    assertEquals(Arrays.asList(text.split("[<>]", -1)), Autolink.split(text, "<>"));
  }
}
