
package com.twitter;

import java.util.*;
import junit.framework.TestCase;
import com.twitter.*;

public class ExtractorTest extends TestCase {
  private Extractor extractor;

  public void setUp() throws Exception {
    extractor = new Extractor();
  }

  public void testReplyAtTheStart() {
    String extracted = extractor.extractReplyScreenname("@user reply");
    assertEquals("Failed to extract reply at the start", "user", extracted);
  }

  public void testReplyWithLeadingSpace() {
    String extracted = extractor.extractReplyScreenname(" @user reply");
    assertEquals("Failed to extract reply with leading space", "user", extracted);
  }

  public void testMentionAtTheBeginning() {
    List<String> extracted = extractor.extractMentionedScreennames("@user mention");
    assertList("Failed to extract mention at the beginning", new String[]{"user"}, extracted);
  }

  public void testMentionWithLeadingSpace() {
    List<String> extracted = extractor.extractMentionedScreennames(" @user mention");
    assertList("Failed to extract mention with leading space", new String[]{"user"}, extracted);
  }

  public void testMentionInMidText() {
    List<String> extracted = extractor.extractMentionedScreennames("mention @user here");
    assertList("Failed to extract mention in mid text", new String[]{"user"}, extracted);
  }

  private void assertList(String message, String[] expected, List<String> actual) {
    List<String> expectedList = Arrays.asList(expected);
    if (expectedList.size() != actual.size()) {
      fail(message + "\n\nExpected list and extracted list are differnt sizes:\n" +
      "  Expected (" + expectedList.size() + "): " + expectedList + "\n" +
      "  Actual   (" + actual.size() + "): " + actual);
    } else {
      for (int i=0; i < expectedList.size(); i++) {
        assertEquals(expectedList.get(i), actual.get(i));
      }
    }
  }
}