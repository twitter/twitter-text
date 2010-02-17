
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

  protected void assertAutolink(String expected, String linked) {
    assertEquals("Autolinked text should not equal the input", expected, linked);
  }
}
