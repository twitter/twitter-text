
package com.twitter;

import junit.framework.TestCase;
import com.twitter.*;

public class RegexTest extends TestCase {
  public void testAutoLinkHashtags() {
    System.out.println("PATTERN:" + Regex.AUTO_LINK_HASHTAGS.pattern());
    assertTrue("Does not match a simple hashtag", Regex.AUTO_LINK_HASHTAGS.matcher("#hashtag").matches());
    assertEquals("Does not have 5 captures as expected", 5, Regex.AUTO_LINK_HASHTAGS.matcher("#hashtag").groupCount());
  }
}