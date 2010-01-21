
package com.twitter;

import java.util.regex.*;
import junit.framework.TestCase;
import com.twitter.*;

public class AutolinkTest extends TestCase {
  private Autolink linker;

  public void setUp() {
    linker = new Autolink();
  }

  public void testAutoLinkHashtagAtTheEnd() {
    String tweet = "This has a #hastag";
    String expected = "This has a <a href=\"http://twitter.com/search?q=%23hastag\">#hastag</a>";
    assertAutolink(expected, linker.autoLinkHashtags(tweet));
  }

  public void testAutoLinkHashtagAtTheStart() {
    String tweet = "#hastag at the start";
    String expected = "<a href=\"http://twitter.com/search?q=%23hastag\">#hastag</a> at the start";
    assertAutolink(expected, linker.autoLinkHashtags(tweet));
  }

  public void testAutoLinkMultipleHashtags() {
    String tweet = "#hastag on both #ends";
    String expected = "<a href=\"http://twitter.com/search?q=%23hastag\">#hastag</a> on both " +
        "<a href=\"http://twitter.com/search?q=%23ends\">#ends</a>";
    assertAutolink(expected, linker.autoLinkHashtags(tweet));
  }

  protected void assertAutolink(String expected, String linked) {
    assertEquals("Autolinked text should not equal the input", expected, linked);
  }
}