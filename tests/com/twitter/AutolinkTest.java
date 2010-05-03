
package com.twitter;

import java.util.regex.*;
import junit.framework.TestCase;
import com.twitter.*;

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

  protected void assertAutolink(String expected, String linked) {
    assertEquals("Autolinked text should not equal the input", expected, linked);
  }
}
