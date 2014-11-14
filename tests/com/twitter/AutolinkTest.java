
package com.twitter;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

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
    String expected = "<a href=\"http://t.co/0JG5Mcq\" rel=\"nofollow\"><span class='tco-ellipsis'><span style='position:absolute;left:-9999px;'>&nbsp;</span></span><span style='position:absolute;left:-9999px;'>http://</span><span class='js-display-url'>blog.twitter.com/2011/05/twitte</span><span style='position:absolute;left:-9999px;'>r-for-mac-update.html</span><span class='tco-ellipsis'><span style='position:absolute;left:-9999px;'>&nbsp;</span>…</span></a>";

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

  public void testUrlClass() {
    linker.setNoFollow(false);

    String tweet = "http://twitter.com";
    String expected = "<a href=\"http://twitter.com\">http://twitter.com</a>";
    assertAutolink(expected, linker.autoLink(tweet));

    linker.setUrlClass("testClass");
    expected = "<a href=\"http://twitter.com\" class=\"testClass\">http://twitter.com</a>";
    assertAutolink(expected, linker.autoLink(tweet));

    tweet = "#hash @tw";
    String result = linker.autoLink(tweet);
    assertTrue(result.contains("class=\"" + Autolink.DEFAULT_HASHTAG_CLASS + "\""));
    assertTrue(result.contains("class=\"" + Autolink.DEFAULT_USERNAME_CLASS + "\""));
    assertFalse(result.contains("class=\"testClass\""));
  }

  public void testSymbolTag() {
    linker.setSymbolTag("s");
    linker.setTextWithSymbolTag("b");
    linker.setNoFollow(false);

    String tweet = "#hash";
    String expected = "<a href=\"https://twitter.com/#!/search?q=%23hash\" title=\"#hash\" class=\"tweet-url hashtag\"><s>#</s><b>hash</b></a>";
    assertAutolink(expected, linker.autoLink(tweet));

    tweet = "@mention";
    expected = "<s>@</s><a class=\"tweet-url username\" href=\"https://twitter.com/mention\"><b>mention</b></a>";
    assertAutolink(expected, linker.autoLink(tweet));

    linker.setUsernameIncludeSymbol(true);
    expected = "<a class=\"tweet-url username\" href=\"https://twitter.com/mention\"><s>@</s><b>mention</b></a>";
    assertAutolink(expected, linker.autoLink(tweet));
  }

  public void testUrlTarget() {
    linker.setUrlTarget("_blank");

    String tweet = "http://test.com";
    String result = linker.autoLink(tweet);
    assertFalse("urlTarget shouldn't be applied to auto-linked hashtag", Pattern.matches(".*<a[^>]+hashtag[^>]+target[^>]+>.*", result));
    assertFalse("urlTarget shouldn't be applied to auto-linked mention", Pattern.matches(".*<a[^>]+username[^>]+target[^>]+>.*", result));
    assertTrue("urlTarget should be applied to auto-linked URL", Pattern.matches(".*<a[^>]+test.com[^>]+target=\"_blank\"[^>]*>.*", result));
    assertFalse("urlClass should not appear in HTML", result.toLowerCase().contains("urlclass"));
  }

  public void testLinkAttributeModifier() {
    linker.setLinkAttributeModifier(new Autolink.LinkAttributeModifier() {
      public void modify(Entity entity, Map<String, String> attributes) {
        if (entity.type == Entity.Type.HASHTAG) {
          attributes.put("dummy-hash-attr", "test");
        }
      }
    });

    String result = linker.autoLink("#hash @mention");
    assertTrue("HtmlAttributeModifier should be applied to hashtag", Pattern.matches(".*<a[^>]+hashtag[^>]+dummy-hash-attr=\"test\"[^>]*>.*", result));
    assertFalse("HtmlAttributeModifier should not be applied to mention", Pattern.matches(".*<a[^>]+username[^>]+dummy-hash-attr=\"test\"[^>]*>.*", result));

    linker.setLinkAttributeModifier(new Autolink.LinkAttributeModifier() {
      public void modify(Entity entity, Map<String, String> attributes) {
        if (entity.type == Entity.Type.URL) {
          attributes.put("dummy-url-attr", entity.value);
        }
      }
    });
    result = linker.autoLink("@mention http://twitter.com/");
    assertFalse("HtmlAttributeModifier should not be applied to mention", Pattern.matches(".*<a[^>]+username[^>]+dummy-url-attr[^>]*>.*", result));
    assertTrue("htmlAttributeBlock should be applied to URL", Pattern.matches(".*<a[^>]+dummy-url-attr=\"http://twitter.com/\".*", result));
  }

  public void testLinkTextModifier() {
    linker.setLinkTextModifier(new Autolink.LinkTextModifier() {
      public CharSequence modify(Entity entity, CharSequence text) {
        return entity.type == Entity.Type.HASHTAG ? "#replaced" : "pre_" + text + "_post";
      }
    });

    String result = linker.autoLink("#hash @mention");
    assertTrue("LinkTextModifier should modify a hashtag link text", Pattern.matches(".*<a[^>]+>#replaced</a>.*", result));
    assertTrue("LinkTextModifier should modify a username link text", Pattern.matches(".*<a[^>]+>pre_mention_post</a>.*", result));

    linker.setLinkTextModifier(new Autolink.LinkTextModifier() {
      public CharSequence modify(Entity entity, CharSequence text) {
        return "pre_" + text + "_post";
      }
    });
    linker.setSymbolTag("s");
    linker.setTextWithSymbolTag("b");
    linker.setUsernameIncludeSymbol(true);
    result = linker.autoLink("#hash @mention");
    assertTrue("LinkTextModifier should modify a hashtag link text", Pattern.matches(".*<a[^>]+>pre_<s>#</s><b>hash</b>_post</a>.*", result));
    assertTrue("LinkTextModifier should modify a username link text", Pattern.matches(".*<a[^>]+>pre_<s>@</s><b>mention</b>_post</a>.*", result));
  }

  protected void assertAutolink(String expected, String linked) {
    assertEquals("Autolinked text should equal the input", expected, linked);
  }
}
