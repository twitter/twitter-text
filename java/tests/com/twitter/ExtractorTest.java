
package com.twitter;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.twitter.Extractor.Entity.Type;

import junit.framework.TestCase;
import junit.framework.TestSuite;
import junit.framework.Test;

public class ExtractorTest extends TestCase {
  protected Extractor extractor;

  public static Test suite() {
    Class<?>[] testClasses = { OffsetConversionTest.class, ReplyTest.class,
            MentionTest.class, HashtagTest.class, URLTest.class };
    return new TestSuite(testClasses);
  }

  public void setUp() throws Exception {
    extractor = new Extractor();
  }

  public static class OffsetConversionTest extends ExtractorTest {

    public void testConvertIndices() {
      assertOffsetConversionOk("abc", "abc");
      assertOffsetConversionOk("\ud83d\ude02abc", "abc");
      assertOffsetConversionOk("\ud83d\ude02abc\ud83d\ude02", "abc");
      assertOffsetConversionOk("\ud83d\ude02abc\ud838\ude02abc", "abc");
      assertOffsetConversionOk("\ud83d\ude02abc\ud838\ude02abc\ud83d\ude02",
              "abc");
      assertOffsetConversionOk("\ud83d\ude02\ud83d\ude02abc", "abc");
      assertOffsetConversionOk("\ud83d\ude02\ud83d\ude02\ud83d\ude02abc",
              "abc");

      assertOffsetConversionOk
              ("\ud83d\ude02\ud83d\ude02\ud83d\ude02abc\ud83d\ude02", "abc");

      // Several surrogate pairs following the entity
      assertOffsetConversionOk
              ("\ud83d\ude02\ud83d\ude02\ud83d\ude02abc\ud83d\ude02\ud83d" +
                      "\ude02\ud83d\ude02", "abc");

      // Several surrogate pairs surrounding multiple entities
      assertOffsetConversionOk
              ("\ud83d\ude02\ud83d\ude02\ud83d\ude02\ud83d\ude02abc\ud83d" +
                      "\ude02\ud83d\ude02\ud83d\ude02\ud83d\ude02abc\ud83d" +
                      "\ude02\ud83d\ude02\ud83d\ude02\ud83d\ude02", "abc");

      // unpaired low surrogate (at start)
      assertOffsetConversionOk
              ("\ude02\ud83d\ude02\ud83d\ude02\ud83d\ude02abc\ud83d" +
                      "\ude02\ud83d\ude02\ud83d\ude02\ud83d\ude02abc\ud83d" +
                      "\ude02\ud83d\ude02\ud83d\ude02\ud83d\ude02", "abc");

      // unpaired low surrogate (at end)
      assertOffsetConversionOk
              ("\ud83d\ude02\ud83d\ude02\ud83d\ude02\ud83d\ude02abc\ud83d" +
                      "\ude02\ud83d\ude02\ud83d\ude02\ud83d\ude02abc\ud83d" +
                      "\ude02\ud83d\ude02\ud83d\ude02\ude02", "abc");

      // unpaired low and high surrogates (at end)
      assertOffsetConversionOk
              ("\ud83d\ude02\ud83d\ude02\ud83d\ude02\ud83d\ude02abc\ud83d" +
                      "\ude02\ud83d\ude02\ud83d\ude02\ud83d\ude02abc\ud83d" +
                      "\ude02\ud83d\ude02\ud83d\ud83d\ude02\ude02", "abc");

      assertOffsetConversionOk("\ud83dabc\ud83d", "abc");

      assertOffsetConversionOk("\ude02abc\ude02", "abc");

      assertOffsetConversionOk("\ude02\ude02abc\ude02\ude02", "abc");

      assertOffsetConversionOk("abcabc", "abc");

      assertOffsetConversionOk("abc\ud83d\ude02abc", "abc");

      assertOffsetConversionOk("aa", "a");

      assertOffsetConversionOk("\ud83d\ude02a\ud83d\ude02a\ud83d\ude02", "a");
    }

    private void assertOffsetConversionOk(String testData, String patStr) {
      // Build an entity at the location of patStr
      final Pattern pat = Pattern.compile(patStr);
      final Matcher matcher = pat.matcher(testData);

      List<Extractor.Entity> entities = new ArrayList<Extractor.Entity>();
      List<Integer> codePointOffsets = new ArrayList<Integer>();
      List<Integer> charOffsets = new ArrayList<Integer>();
      while (matcher.find()) {
        final int charOffset = matcher.start();
        charOffsets.add(charOffset);
        codePointOffsets.add(testData.codePointCount(0, charOffset));
        entities.add(new Extractor.Entity(matcher, Type.HASHTAG, 0, 0));
      }

      extractor.modifyIndicesFromUTF16ToToUnicode(testData, entities);

      for (int i = 0; i < entities.size(); i++) {
        assertEquals(codePointOffsets.get(i), entities.get(i).getStart());
      }

      extractor.modifyIndicesFromUnicodeToUTF16(testData, entities);

      for (int i = 0; i < entities.size(); i++) {
        // This assertion could fail if the entity location is in the middle
        // of a surrogate pair, since there is no equivalent code point
        // offset to that location. It would be pathological for an entity to
        // start at that point, so we can just let the test fail in that case.
        assertEquals(charOffsets.get(i), entities.get(i).getStart());
      }
    }
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
      assertEquals(extracted.get(0).getStart().intValue(), 1);
      assertEquals(extracted.get(0).getEnd().intValue(), 7);
      assertEquals(extracted.get(1).getStart().intValue(), 16);
      assertEquals(extracted.get(1).getEnd().intValue(), 22);
      assertEquals(extracted.get(2).getStart().intValue(), 28);
      assertEquals(extracted.get(2).getEnd().intValue(), 34);
    }

    public void testMentionWithSupplementaryCharacters() {
      // insert U+10400 before " @mention"
      String text = String.format("%c @mention %c @mention", 0x00010400, 0x00010400);

      // count U+10400 as 2 characters (as in UTF-16)
      List<Extractor.Entity> extracted = extractor.extractMentionedScreennamesWithIndices(text);
      assertEquals(extracted.size(), 2);
      assertEquals(extracted.get(0).value, "mention");
      assertEquals(extracted.get(0).start, 3);
      assertEquals(extracted.get(0).end, 11);
      assertEquals(extracted.get(1).value, "mention");
      assertEquals(extracted.get(1).start, 15);
      assertEquals(extracted.get(1).end, 23);

      // count U+10400 as single character
      extractor.modifyIndicesFromUTF16ToToUnicode(text, extracted);
      assertEquals(extracted.size(), 2);
      assertEquals(extracted.get(0).start, 2);
      assertEquals(extracted.get(0).end, 10);
      assertEquals(extracted.get(1).start, 13);
      assertEquals(extracted.get(1).end, 21);

      // count U+10400 as 2 characters (as in UTF-16)
      extractor.modifyIndicesFromUnicodeToUTF16(text, extracted);
      assertEquals(2, extracted.size());
      assertEquals(3, extracted.get(0).start);
      assertEquals(11, extracted.get(0).end);
      assertEquals(15, extracted.get(1).start);
      assertEquals(23, extracted.get(1).end);
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
      assertEquals(extracted.get(0).getStart().intValue(), 1);
      assertEquals(extracted.get(0).getEnd().intValue(), 7);
      assertEquals(extracted.get(1).getStart().intValue(), 16);
      assertEquals(extracted.get(1).getEnd().intValue(), 22);
      assertEquals(extracted.get(2).getStart().intValue(), 28);
      assertEquals(extracted.get(2).getEnd().intValue(), 34);
    }

    public void testHashtagWithSupplementaryCharacters() {
      // insert U+10400 before " #hashtag"
      String text = String.format("%c #hashtag %c #hashtag", 0x00010400, 0x00010400);

      // count U+10400 as 2 characters (as in UTF-16)
      List<Extractor.Entity> extracted = extractor.extractHashtagsWithIndices(text);
      assertEquals(extracted.size(), 2);
      assertEquals(extracted.get(0).value, "hashtag");
      assertEquals(extracted.get(0).start, 3);
      assertEquals(extracted.get(0).end, 11);
      assertEquals(extracted.get(1).value, "hashtag");
      assertEquals(extracted.get(1).start, 15);
      assertEquals(extracted.get(1).end, 23);

      // count U+10400 as single character
      extractor.modifyIndicesFromUTF16ToToUnicode(text, extracted);
      assertEquals(extracted.size(), 2);
      assertEquals(extracted.get(0).start, 2);
      assertEquals(extracted.get(0).end, 10);
      assertEquals(extracted.get(1).start, 13);
      assertEquals(extracted.get(1).end, 21);

      // count U+10400 as 2 characters (as in UTF-16)
      extractor.modifyIndicesFromUnicodeToUTF16(text, extracted);
      assertEquals(extracted.size(), 2);
      assertEquals(extracted.get(0).start, 3);
      assertEquals(extracted.get(0).end, 11);
      assertEquals(extracted.get(1).start, 15);
      assertEquals(extracted.get(1).end, 23);
    }
  }

   /**
   * Tests for the extractURLsWithIndices method
   */
  public static class URLTest extends ExtractorTest {
   public void testUrlWithIndices() {
      List<Extractor.Entity> extracted = extractor.extractURLsWithIndices("http://t.co url https://www.twitter.com ");
      assertEquals(extracted.get(0).getStart().intValue(), 0);
      assertEquals(extracted.get(0).getEnd().intValue(), 11);
      assertEquals(extracted.get(1).getStart().intValue(), 16);
      assertEquals(extracted.get(1).getEnd().intValue(), 39);
   }

   public void testUrlWithoutProtocol() {
     String text = "www.twitter.com, www.yahoo.co.jp, t.co/blahblah, www.poloshirts.uk.com";
     assertList("Failed to extract URLs without protocol",
         new String[]{"www.twitter.com", "www.yahoo.co.jp", "t.co/blahblah", "www.poloshirts.uk.com"},
         extractor.extractURLs(text));

     List<Extractor.Entity> extracted = extractor.extractURLsWithIndices(text);
     assertEquals(extracted.get(0).getStart().intValue(), 0);
     assertEquals(extracted.get(0).getEnd().intValue(), 15);
     assertEquals(extracted.get(1).getStart().intValue(), 17);
     assertEquals(extracted.get(1).getEnd().intValue(), 32);
     assertEquals(extracted.get(2).getStart().intValue(), 34);
     assertEquals(extracted.get(2).getEnd().intValue(), 47);

     extractor.setExtractURLWithoutProtocol(false);
     assertTrue("Should not extract URLs w/o protocol", extractor.extractURLs(text).isEmpty());
   }

   public void testURLFollowedByPunctuations() {
     String text ="http://games.aarp.org/games/mahjongg-dimensions.aspx!!!!!!";
     assertList("Failed to extract URLs followed by punctuations",
         new String[]{"http://games.aarp.org/games/mahjongg-dimensions.aspx"},
         extractor.extractURLs(text));
   }

   public void testUrlWithPunctuation() {
     String[] urls = new String[] {
       "http://www.foo.com/foo/path-with-period./",
       "http://www.foo.org.za/foo/bar/688.1",
       "http://www.foo.com/bar-path/some.stm?param1=foo;param2=P1|0||P2|0",
       "http://foo.com/bar/123/foo_&_bar/",
       "http://foo.com/bar(test)bar(test)bar(test)",
       "www.foo.com/foo/path-with-period./",
       "www.foo.org.za/foo/bar/688.1",
       "www.foo.com/bar-path/some.stm?param1=foo;param2=P1|0||P2|0",
       "foo.com/bar/123/foo_&_bar/"
     };

     for (String url : urls) {
       assertEquals(url, extractor.extractURLs(url).get(0));
     }
   }

   public void testUrlnWithSupplementaryCharacters() {
     // insert U+10400 before " http://twitter.com"
     String text = String.format("%c http://twitter.com %c http://twitter.com", 0x00010400, 0x00010400);

     // count U+10400 as 2 characters (as in UTF-16)
     List<Extractor.Entity> extracted = extractor.extractURLsWithIndices(text);
     assertEquals(extracted.size(), 2);
     assertEquals(extracted.get(0).value, "http://twitter.com");
     assertEquals(extracted.get(0).start, 3);
     assertEquals(extracted.get(0).end, 21);
     assertEquals(extracted.get(1).value, "http://twitter.com");
     assertEquals(extracted.get(1).start, 25);
     assertEquals(extracted.get(1).end, 43);

     // count U+10400 as single character
     extractor.modifyIndicesFromUTF16ToToUnicode(text, extracted);
     assertEquals(extracted.size(), 2);
     assertEquals(extracted.get(0).start, 2);
     assertEquals(extracted.get(0).end, 20);
     assertEquals(extracted.get(1).start, 23);
     assertEquals(extracted.get(1).end, 41);

     // count U+10400 as 2 characters (as in UTF-16)
     extractor.modifyIndicesFromUnicodeToUTF16(text, extracted);
     assertEquals(extracted.size(), 2);
     assertEquals(extracted.get(0).start, 3);
     assertEquals(extracted.get(0).end, 21);
     assertEquals(extracted.get(1).start, 25);
     assertEquals(extracted.get(1).end, 43);
   }
  }

  public void testUrlWithSpecialCCTLDWithoutProtocol() {
    String text = "MLB.tv vine.co";
    assertList("Failed to extract URLs without protocol",
        new String[]{"MLB.tv", "vine.co"}, extractor.extractURLs(text));

    List<Extractor.Entity> extracted = extractor.extractURLsWithIndices(text);
    assertEquals(extracted.get(0).getStart().intValue(), 0);
    assertEquals(extracted.get(0).getEnd().intValue(), 6);
    assertEquals(extracted.get(1).getStart().intValue(), 7);
    assertEquals(extracted.get(1).getEnd().intValue(), 14);

    extractor.setExtractURLWithoutProtocol(false);
    assertTrue("Should not extract URLs w/o protocol", extractor.extractURLs(text).isEmpty());
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
