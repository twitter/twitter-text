
package com.twitter;

import java.util.*;
import junit.framework.TestCase;
import junit.framework.TestSuite;
import junit.framework.Test;
import com.twitter.*;

public class ExtractorTest extends TestCase {
  protected Extractor extractor;

  public static Test suite() {
    Class[] testClasses = { ReplyTest.class, MentionTest.class, HashtagTest.class, URLTest.class };
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
   * Tests for the extractMentionedScreennames{WithIndices} methods
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

    public void testMentionWithIndices() {
      List<Extractor.Entity> extracted = extractor.extractMentionedScreennamesWithIndices(" @user1 mention @user2 here @user3 ");
      assertEquals(extracted.size(), 3);
      assertEquals(extracted.get(0).start.intValue(), 1);
      assertEquals(extracted.get(0).end.intValue(), 7);
      assertEquals(extracted.get(1).start.intValue(), 16);
      assertEquals(extracted.get(1).end.intValue(), 22);
      assertEquals(extracted.get(2).start.intValue(), 28);
      assertEquals(extracted.get(2).end.intValue(), 34);
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

    public void testHashtagWithIndices() {
      List<Extractor.Entity> extracted = extractor.extractHashtagsWithIndices(" #user1 mention #user2 here #user3 ");
      assertEquals(extracted.size(), 3);
      assertEquals(extracted.get(0).start.intValue(), 1);
      assertEquals(extracted.get(0).end.intValue(), 7);
      assertEquals(extracted.get(1).start.intValue(), 16);
      assertEquals(extracted.get(1).end.intValue(), 22);
      assertEquals(extracted.get(2).start.intValue(), 28);
      assertEquals(extracted.get(2).end.intValue(), 34);
    }
  }

   /**
   * Tests for the extractURLsWithIndices method
   */
  public static class URLTest extends ExtractorTest {
   public void testUrlWithIndices() {
      List<Extractor.Entity> extracted = extractor.extractURLsWithIndices("http://t.co url https://www.twitter.com ");
      assertEquals(extracted.get(0).start.intValue(), 0);
      assertEquals(extracted.get(0).end.intValue(), 11);
      assertEquals(extracted.get(1).start.intValue(), 16);
      assertEquals(extracted.get(1).end.intValue(), 39);
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
