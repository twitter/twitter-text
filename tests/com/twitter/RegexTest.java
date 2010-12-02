
package com.twitter;

import java.util.regex.*;
import junit.framework.TestCase;
import com.twitter.*;

public class RegexTest extends TestCase {
  public void testAutoLinkHashtags() {
    assertCaptureCount(3, Regex.AUTO_LINK_HASHTAGS, "#hashtag");
    assertCaptureCount(3, Regex.AUTO_LINK_HASHTAGS, "#caf\u00E9");
  }

  public void testAutoLinkUsernamesOrLists() {
    assertCaptureCount(4, Regex.AUTO_LINK_USERNAMES_OR_LISTS, "@username");
    assertCaptureCount(4, Regex.AUTO_LINK_USERNAMES_OR_LISTS, "@username/list");
  }

  public void testValidURL() {
    assertCaptureCount(7, Regex.VALID_URL, "http://example.com");
  }

  public void testValidURLDoesNotCrashOnLongPaths() {
    String longPathIsLong = "Check out http://example.com/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    assertTrue("Failed to correctly match a very long path", Regex.VALID_URL.matcher(longPathIsLong).find());
  }

  public void testExtractMentions() {
    assertCaptureCount(3, Regex.EXTRACT_MENTIONS, "sample @user mention");
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
