
package com.twitter;

import java.util.ArrayList;
import java.util.List;

import com.twitter.Extractor.Entity;

import junit.framework.TestCase;

public class AutolinkTest extends TestCase {
  private Autolink linker;

  public void setUp() {
    linker = new Autolink();
  }

  public void testNoFollowByDefault() {
    String tweet = "This has a #hashtag";
    String expected = "This has a <a href=\"https://twitter.com/#!/search?q=%23hashtag\" title=\"#hashtag\" class=\"tweet-url hashtag\" rel=\"nofollow\">#hashtag</a>";
    assertAutolink(expected, linker.autoLinkHashtags(tweet));
  }

  public void testNoFollowDisabled() {
    linker.setNoFollow(false);
    String tweet = "This has a #hashtag";
    String expected = "This has a <a href=\"https://twitter.com/#!/search?q=%23hashtag\" title=\"#hashtag\" class=\"tweet-url hashtag\">#hashtag</a>";
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

  public void testURLEntities() {
    Entity entity = new Entity(0, 19, "http://t.co/0JG5Mcq", Entity.Type.URL);
    entity.setDisplayURL("blog.twitter.com/2011/05/twitte…");
    entity.setExpandedURL("http://blog.twitter.com/2011/05/twitter-for-mac-update.html");
    List<Entity> entities = new ArrayList<Entity>();
    entities.add(entity);
    String tweet = "http://t.co/0JG5Mcq";
    String expected = "<a href=\"http://t.co/0JG5Mcq\" rel=\"nofollow\"><span class='tco-ellipsis'><span style='font-size:0; line-height:0'>&nbsp;</span></span><span style='font-size:0; line-height:0'>http://</span><span class='js-display-url'>blog.twitter.com/2011/05/twitte</span><span style='font-size:0; line-height:0'>r-for-mac-update.html</span><span class='tco-ellipsis'><span style='font-size:0; line-height:0'>&nbsp;</span>…</span></a>";

    assertAutolink(expected, linker.autoLinkEntities(tweet, entities));
  }

  public void testWithAngleBrackets() {
    linker.setNoFollow(false);
    String tweet = "(Debugging) <3 #idol2011";
    String expected = "(Debugging) &lt;3 <a href=\"https://twitter.com/#!/search?q=%23idol2011\" title=\"#idol2011\" class=\"tweet-url hashtag\">#idol2011</a>";
    assertAutolink(expected, linker.autoLink(tweet));

    tweet = "<link rel='true'>http://example.com</link>";
    expected = "<link rel='true'><a href=\"http://example.com\">http://example.com</a></link>";
    assertAutolink(expected, linker.autoLinkURLs(tweet));
  }

  public void testUsernameIncludeSymbol() {
    linker.setUsernameIncludeSymbol(true);
    String tweet = "Testing @mention and @mention/list";
    String expected = "Testing <a class=\"tweet-url username\" href=\"https://twitter.com/mention\" rel=\"nofollow\">@mention</a> and <a class=\"tweet-url list-slug\" href=\"https://twitter.com/mention/list\" rel=\"nofollow\">@mention/list</a>";
    assertAutolink(expected, linker.autoLink(tweet));
  }

  protected void assertAutolink(String expected, String linked) {
    assertEquals("Autolinked text should equal the input", expected, linked);
  }
}
