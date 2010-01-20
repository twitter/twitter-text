
package com.twitter;

import java.util.*;
import junit.framework.TestCase;
import junit.framework.TestSuite;
import junit.framework.Test;
import com.twitter.*;

public class ExtractorTest extends TestCase {
  protected Extractor extractor;

  public static Test suite() {
    Class[] testClasses = { ReplyTest.class, MentionTest.class, HashtagTest.class };
    return new TestSuite(testClasses);
  }

  public void setUp() throws Exception {
    extractor = new Extractor();
  }

  /**
   * Tests for the extractReplyScreenname method
   */
  public static class ReplyTest extends ExtractorTest {
    public void testReplyAtTheStart() {
      String extracted = extractor.extractReplyScreenname("@user reply");
      assertEquals("Failed to extract reply at the start", "user", extracted);
    }

    public void testReplyWithLeadingSpace() {
      String extracted = extractor.extractReplyScreenname(" @user reply");
      assertEquals("Failed to extract reply with leading space", "user", extracted);
    }
  }

  /**
   * Tests for the extractMentionedScreennames method
   */
  public static class MentionTest extends ExtractorTest {
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

    public void testMultipleMentions() {
      List<String> extracted = extractor.extractMentionedScreennames("mention @user1 here and @user2 here");
      assertList("Failed to extract multiple mentioned users", new String[]{"user1", "user2"}, extracted);
    }
  }

   /**
   * Tests for the extractHashtags method
   */
  public static class HashtagTest extends ExtractorTest {
    public void testHashtagAtTheBeginning() {
      List<String> extracted = extractor.extractHashtags("#hashtag mention");
      assertList("Failed to extract hashtag at the beginning", new String[]{"hashtag"}, extracted);
    }

    public void testHashtagWithLeadingSpace() {
      List<String> extracted = extractor.extractHashtags(" #hashtag mention");
      assertList("Failed to extract hashtag with leading space", new String[]{"hashtag"}, extracted);
    }

    public void testHashtagInMidText() {
      List<String> extracted = extractor.extractHashtags("mention #hashtag here");
      assertList("Failed to extract hashtag in mid text", new String[]{"hashtag"}, extracted);
    }

    public void testMultipleHashtags() {
      List<String> extracted = extractor.extractHashtags("text #hashtag1 #hashtag2");
      assertList("Failed to extract multiple hashtags", new String[]{"hashtag1", "hashtag2"}, extracted);
    }
  }

  /**
   * Helper method for asserting that the List of extracted Strings match the expected values.
   *
   * @param message to display on failure
   * @param expected Array of Strings that were expected to be extracted
   * @param actual List of Strings that were extracted
   */
  protected void assertList(String message, String[] expected, List<String> actual) {
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