// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

package com.twitter.twittertext;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.Collection;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.dataformat.yaml.YAMLMapper;

import org.junit.Test;
import org.junit.experimental.runners.Enclosed;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;
import org.junit.runners.Parameterized.Parameter;
import org.junit.runners.Parameterized.Parameters;

import static org.junit.Assert.assertEquals;

@RunWith(Enclosed.class)
public class ConformanceTest {

  protected ConformanceTest() {
  }

  static final String KEY_DESCRIPTION = "description";
  static final String KEY_INPUT = "text";
  static final String KEY_EXPECTED_OUTPUT = "expected";
  private static final String KEY_HIGHLIGHT_HITS = "hits";
  private static final Extractor EXTRACTOR = new Extractor();
  private static final Autolink LINKER = new Autolink(false);
  private static final Validator VALIDATOR = new Validator();
  private static final HitHighlighter HIT_HIGHLIGHTER = new HitHighlighter();

  private static List<Extractor.Entity> getExpectedEntities(Map testCase, String key,
                                                            Extractor.Entity.Type type,
                                                            String listSlugKey) {
    @SuppressWarnings("unchecked") final List<Map<String, Object>> expectedConfig =
        (List<Map<String, Object>>) testCase.get(KEY_EXPECTED_OUTPUT);
    final List<Extractor.Entity> expected = new LinkedList<>();
    for (Map<String, Object> configEntry : expectedConfig) {
      @SuppressWarnings("unchecked") final List<Integer> indices =
          (List<Integer>) configEntry.get("indices");
      final String listSlug = listSlugKey != null ? configEntry.get(listSlugKey).toString() : "";
      expected.add(new Extractor.Entity(indices.get(0), indices.get(1),
          configEntry.get(key).toString(), listSlug.isEmpty() ? null : listSlug, type));
    }
    return expected;
  }

  @RunWith(Parameterized.class)
  public static class MentionsConformanceTest {
    @Parameter
    public Map testCase;

    @Parameters
    public static Collection<Map> data() throws Exception {
      return loadConformanceData("extract.yml", "mentions");
    }

    @Test
    public void testMentionsExtractor() throws Exception {
      assertEquals((String) testCase.get(KEY_DESCRIPTION),
          testCase.get(KEY_EXPECTED_OUTPUT),
          EXTRACTOR.extractMentionedScreennames((String) testCase.get(KEY_INPUT)));
    }
  }

  @RunWith(Parameterized.class)
  public static class MentionsWithIndicesConformanceTest {
    @Parameter
    public Map testCase;

    @Parameters
    public static Collection<Map> data() throws Exception {
      return loadConformanceData("extract.yml", "mentions_with_indices");
    }

    @Test
    public void testMentionsWithIndicesExtractor() throws Exception {
      assertEquals((String) testCase.get(KEY_DESCRIPTION),
          getExpectedEntities(testCase, "screen_name", Extractor.Entity.Type.MENTION, null),
          EXTRACTOR.extractMentionedScreennamesWithIndices((String) testCase.get(KEY_INPUT)));
    }
  }

  @RunWith(Parameterized.class)
  public static class MentionsOrListsWithIndicesConformanceTest {
    @Parameter
    public Map testCase;

    @Parameters
    public static Collection<Map> data() throws Exception {
      return loadConformanceData("extract.yml", "mentions_or_lists_with_indices");
    }

    @Test
    public void testMentionsOrListsWithIndicesExtractor() throws Exception {
      final String message = (String) testCase.get(KEY_DESCRIPTION);
      final List<Extractor.Entity> expectedEntities =
          getExpectedEntities(testCase, "screen_name", Extractor.Entity.Type.MENTION, "list_slug");
      final List<Extractor.Entity> actualEntities =
          EXTRACTOR.extractMentionsOrListsWithIndices((String) testCase.get(KEY_INPUT));
      assertEquals(message, expectedEntities, actualEntities);
      for (int i = 0; i < actualEntities.size(); i++) {
        assertEquals(message, expectedEntities.get(i).getListSlug(),
            actualEntities.get(i).getListSlug());
      }
    }
  }

  @RunWith(Parameterized.class)
  public static class ReplyConformanceTest {
    @Parameter
    public Map testCase;

    @Parameters
    public static Collection<Map> data() throws Exception {
      return loadConformanceData("extract.yml", "replies");
    }

    @Test
    public void testReplyExtractor() throws Exception {
      assertEquals((String) testCase.get(KEY_DESCRIPTION),
          testCase.get(KEY_EXPECTED_OUTPUT),
          EXTRACTOR.extractReplyScreenname((String) testCase.get(KEY_INPUT)));
    }
  }

  @RunWith(Parameterized.class)
  public static class HashtagsConformanceTest {
    @Parameter
    public Map testCase;

    @Parameters
    public static Collection<Map> data() throws Exception {
      return loadConformanceData("extract.yml", "hashtags");
    }

    @Test
    public void testHashtagsExtractor() throws Exception {
      assertEquals((String) testCase.get(KEY_DESCRIPTION),
          testCase.get(KEY_EXPECTED_OUTPUT),
          EXTRACTOR.extractHashtags((String) testCase.get(KEY_INPUT)));
    }
  }

  @RunWith(Parameterized.class)
  public static class HashtagsAstralConformanceTest {
    @Parameter
    public Map testCase;

    @Parameters
    public static Collection<Map> data() throws Exception {
      return loadConformanceData("extract.yml", "hashtags_from_astral");
    }

    @Test
    public void testHashtagsAstralExtractor() throws Exception {
      assertEquals((String) testCase.get(KEY_DESCRIPTION),
          testCase.get(KEY_EXPECTED_OUTPUT),
          EXTRACTOR.extractHashtags((String) testCase.get(KEY_INPUT)));
    }
  }

  @RunWith(Parameterized.class)
  public static class HashtagsWithIndicesConformanceTest {
    @Parameter
    public Map testCase;

    @Parameters
    public static Collection<Map> data() throws Exception {
      return loadConformanceData("extract.yml", "hashtags_with_indices");
    }

    @Test
    public void testHashtagsWithIndicesExtractor() throws Exception {
      assertEquals((String) testCase.get(KEY_DESCRIPTION),
          getExpectedEntities(testCase, "hashtag", Extractor.Entity.Type.HASHTAG, null),
          EXTRACTOR.extractHashtagsWithIndices((String) testCase.get(KEY_INPUT)));
    }
  }

  @RunWith(Parameterized.class)
  public static class URLsConformanceTest {
    @Parameter
    public Map testCase;

    @Parameters
    public static Collection<Map> data() throws Exception {
      return loadConformanceData("extract.yml", "urls");
    }

    @Test
    public void testURLsExtractor() throws Exception {
      assertEquals((String) testCase.get(KEY_DESCRIPTION),
          testCase.get(KEY_EXPECTED_OUTPUT),
          EXTRACTOR.extractURLs((String) testCase.get(KEY_INPUT)));
    }
  }

  @RunWith(Parameterized.class)
  public static class URLsWithIndicesConformanceTest {
    @Parameter
    public Map testCase;

    @Parameters
    public static Collection<Map> data() throws Exception {
      return loadConformanceData("extract.yml", "urls_with_indices");
    }

    @Test
    public void testURLsWithIndicesExtractor() throws Exception {
      assertEquals((String) testCase.get(KEY_DESCRIPTION),
          getExpectedEntities(testCase, "url", Extractor.Entity.Type.URL, null),
          EXTRACTOR.extractURLsWithIndices((String) testCase.get(KEY_INPUT)));
    }
  }

  @RunWith(Parameterized.class)
  public static class URLsWithDirectionMarkersConformanceTest {
    @Parameter
    public Map testCase;

    @Parameters
    public static Collection<Map> data() throws Exception {
      return loadConformanceData("extract.yml", "urls_with_directional_markers");
    }

    @Test
    public void testURLsWithIndicesExtractor() throws Exception {
      assertEquals((String) testCase.get(KEY_DESCRIPTION),
          getExpectedEntities(testCase, "url", Extractor.Entity.Type.URL, null),
          EXTRACTOR.extractURLsWithIndices((String) testCase.get(KEY_INPUT)));
    }
  }

  @RunWith(Parameterized.class)
  public static class TCOURLsWithParamsConformanceTest {
    @Parameter
    public Map testCase;

    @Parameters
    public static Collection<Map> data() throws Exception {
      return loadConformanceData("extract.yml", "tco_urls_with_params");
    }

    @Test
    public void testURLsExtractor() throws Exception {
      assertEquals((String) testCase.get(KEY_DESCRIPTION),
          testCase.get(KEY_EXPECTED_OUTPUT),
          EXTRACTOR.extractURLs((String) testCase.get(KEY_INPUT)));
    }
  }

  @RunWith(Parameterized.class)
  public static class CountryTldsConformanceTest {
    @Parameter
    public Map testCase;

    @Parameters
    public static Collection<Map> data() throws Exception {
      return loadConformanceData("tlds.yml", "country");
    }

    @Test
    public void testCountryTldsExtractor() throws Exception {
      assertEquals((String) testCase.get(KEY_DESCRIPTION),
          testCase.get(KEY_EXPECTED_OUTPUT),
          EXTRACTOR.extractURLs((String) testCase.get(KEY_INPUT)));
    }
  }

  @RunWith(Parameterized.class)
  public static class GenericTldsConformanceTest {
    @Parameter
    public Map testCase;

    @Parameters
    public static Collection<Map> data() throws Exception {
      return loadConformanceData("tlds.yml", "generic");
    }

    @Test
    public void testGenericTldsExtractor() throws Exception {
      assertEquals((String) testCase.get(KEY_DESCRIPTION),
          testCase.get(KEY_EXPECTED_OUTPUT),
          EXTRACTOR.extractURLs((String) testCase.get(KEY_INPUT)));
    }
  }

  @RunWith(Parameterized.class)
  public static class CashtagsConformanceTest {
    @Parameter
    public Map testCase;

    @Parameters
    public static Collection<Map> data() throws Exception {
      return loadConformanceData("extract.yml", "cashtags");
    }

    @Test
    public void testCashtagsExtractor() throws Exception {
      assertEquals((String) testCase.get(KEY_DESCRIPTION),
          testCase.get(KEY_EXPECTED_OUTPUT),
          EXTRACTOR.extractCashtags((String) testCase.get(KEY_INPUT)));
    }
  }

  @RunWith(Parameterized.class)
  public static class CashtagsWithIndicesConformanceTest {
    @Parameter
    public Map testCase;

    @Parameters
    public static Collection<Map> data() throws Exception {
      return loadConformanceData("extract.yml", "cashtags_with_indices");
    }

    @Test
    public void testCashtagsWithIndicesExtractor() throws Exception {
      assertEquals((String) testCase.get(KEY_DESCRIPTION),
          getExpectedEntities(testCase, "cashtag", Extractor.Entity.Type.CASHTAG, null),
          EXTRACTOR.extractCashtagsWithIndices((String) testCase.get(KEY_INPUT)));
    }
  }

  @RunWith(Parameterized.class)
  public static class UsernameAutolinkingConformanceTest {
    @Parameter
    public Map testCase;

    @Parameters
    public static Collection<Map> data() throws Exception {
      return loadConformanceData("autolink.yml", "usernames");
    }

    @Test
    public void testUsernameAutolinking() throws Exception {
      assertEquals((String) testCase.get(KEY_DESCRIPTION),
          testCase.get(KEY_EXPECTED_OUTPUT),
          LINKER.autoLinkUsernamesAndLists((String) testCase.get(KEY_INPUT)));
    }
  }

  @RunWith(Parameterized.class)
  public static class ListAutolinkingConformanceTest {
    @Parameter
    public Map testCase;

    @Parameters
    public static Collection<Map> data() throws Exception {
      return loadConformanceData("autolink.yml", "lists");
    }

    @Test
    public void testListAutolinking() throws Exception {
      assertEquals((String) testCase.get(KEY_DESCRIPTION),
          testCase.get(KEY_EXPECTED_OUTPUT),
          LINKER.autoLinkUsernamesAndLists((String) testCase.get(KEY_INPUT)));
    }
  }

  @RunWith(Parameterized.class)
  public static class HashtagsAutolinkingConformanceTest {
    @Parameter
    public Map testCase;

    @Parameters
    public static Collection<Map> data() throws Exception {
      return loadConformanceData("autolink.yml", "hashtags");
    }

    @Test
    public void testHashtagAutolinking() throws Exception {
      assertEquals((String) testCase.get(KEY_DESCRIPTION),
          testCase.get(KEY_EXPECTED_OUTPUT),
          LINKER.autoLinkHashtags((String) testCase.get(KEY_INPUT)));
    }
  }

  @RunWith(Parameterized.class)
  public static class URLsAutolinkingConformanceTest {
    @Parameter
    public Map testCase;

    @Parameters
    public static Collection<Map> data() throws Exception {
      return loadConformanceData("autolink.yml", "urls");
    }

    @Test
    public void testURLsAutolinking() throws Exception {
      assertEquals((String) testCase.get(KEY_DESCRIPTION),
          testCase.get(KEY_EXPECTED_OUTPUT),
          LINKER.autoLinkURLs((String) testCase.get(KEY_INPUT)));
    }
  }

  @RunWith(Parameterized.class)
  public static class CashtagsAutolinkingConformanceTest {
    @Parameter
    public Map testCase;

    @Parameters
    public static Collection<Map> data() throws Exception {
      return loadConformanceData("autolink.yml", "cashtags");
    }

    @Test
    public void testURLsAutolinking() throws Exception {
      assertEquals((String) testCase.get(KEY_DESCRIPTION),
          testCase.get(KEY_EXPECTED_OUTPUT),
          LINKER.autoLinkCashtags((String) testCase.get(KEY_INPUT)));
    }
  }

  @RunWith(Parameterized.class)
  public static class AllAutolinkingConformanceTest {
    @Parameter
    public Map testCase;

    @Parameters
    public static Collection<Map> data() throws Exception {
      return loadConformanceData("autolink.yml", "all");
    }

    @Test
    public void testAllAutolinking() throws Exception {
      assertEquals((String) testCase.get(KEY_DESCRIPTION),
          testCase.get(KEY_EXPECTED_OUTPUT),
          LINKER.autoLink((String) testCase.get(KEY_INPUT)));
    }
  }

  @RunWith(Parameterized.class)
  public static class UnicodeDirectionalMarkerCounterTest {
    @Parameter
    public Map testCase;

    @Parameters
    public static Collection<Map> data() throws Exception {
      return loadConformanceData("validate.yml", "UnicodeDirectionalMarkerCounterTest");
    }

    @SuppressWarnings("unchecked")
    @Test
    public void testUnicodeDirectionalMarkerCounting() throws Exception {
      final TwitterTextParseResults parseResults =
          TwitterTextParser.parseTweet((String) testCase.get(KEY_INPUT));
      String message = (String) testCase.get(KEY_DESCRIPTION);
      final Map<String, Object> expected = (Map<String, Object>) testCase.get(KEY_EXPECTED_OUTPUT);
      assertEquals(message, expected.get("weightedLength"), parseResults.weightedLength);
      assertEquals(message, expected.get("valid"), parseResults.isValid);
      assertEquals(message, expected.get("permillage"), parseResults.permillage);
      assertEquals(message, expected.get("displayRangeStart"), parseResults.displayTextRange.start);
      assertEquals(message, expected.get("displayRangeEnd"), parseResults.displayTextRange.end);
      assertEquals(message, expected.get("validRangeStart"), parseResults.validTextRange.start);
      assertEquals(message, expected.get("validRangeEnd"), parseResults.validTextRange.end);
    }
  }

  @RunWith(Parameterized.class)
  public static class PlainTextHitHighlightConformanceTest {
    @Parameter
    public Map testCase;

    @Parameters
    public static Collection<Map> data() throws Exception {
      return loadConformanceData("hit_highlighting.yml", "plain_text");
    }

    @Test
    public void testAllAutolinkingExtractor() throws Exception {
      @SuppressWarnings("unchecked")
      final List<List<Integer>> hits = (List<List<Integer>>) testCase.get(KEY_HIGHLIGHT_HITS);
      assertEquals((String) testCase.get(KEY_DESCRIPTION),
          testCase.get(KEY_EXPECTED_OUTPUT),
          HIT_HIGHLIGHTER.highlight((String) testCase.get(KEY_INPUT), hits));
    }
  }

  @RunWith(Parameterized.class)
  public static class EmojiTweetsConformanceTest {
    @Parameter
    public Map testCase;

    @Parameters
    public static Collection<Map> data() throws Exception {
      return loadConformanceData("validate.yml", "WeightedTweetsWithDiscountedEmojiCounterTest");
    }

    @SuppressWarnings("unchecked")
    @Test
    public void testEmojiTweets() throws Exception {
      final TwitterTextParseResults parseResults =
          TwitterTextParser.parseTweet((String) testCase.get(KEY_INPUT),
              TwitterTextParser.TWITTER_TEXT_DEFAULT_CONFIG);
      final String message = (String) testCase.get(KEY_DESCRIPTION);
      final Map<String, Object> expected = (Map<String, Object>) testCase.get(KEY_EXPECTED_OUTPUT);
      assertEquals(message, expected.get("weightedLength"), parseResults.weightedLength);
      assertEquals(message, expected.get("valid"), parseResults.isValid);
      assertEquals(message, expected.get("permillage"), parseResults.permillage);
      assertEquals(message, expected.get("displayRangeStart"), parseResults.displayTextRange.start);
      assertEquals(message, expected.get("displayRangeEnd"), parseResults.displayTextRange.end);
      assertEquals(message, expected.get("validRangeStart"), parseResults.validTextRange.start);
      assertEquals(message, expected.get("validRangeEnd"), parseResults.validTextRange.end);
    }
  }

  @SuppressWarnings("unchecked")
  static List<Map> loadConformanceData(String yamlFile, String testType) throws IOException {
    final String resourcePath = String.format("/%s", yamlFile);
    final InputStream resourceStream = ConformanceTest.class.getResourceAsStream(resourcePath);
    final Reader resourceReader = new BufferedReader(new InputStreamReader(resourceStream));
    final Map fullConfig = new YAMLMapper().readValue(resourceReader, Map.class);
    final Map testConfig = (Map) fullConfig.get("tests");
    return (List<Map>) testConfig.get(testType);
  }
}
