
package com.twitter;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.Collection;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.experimental.runners.Enclosed;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;
import org.junit.runners.Parameterized.Parameter;
import org.junit.runners.Parameterized.Parameters;
import org.yaml.snakeyaml.Yaml;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

@RunWith(Enclosed.class)
public class ConformanceTest {

  private static final String CONFORMANCE_DIR_PROPERTY = "conformance.dir";
  static final String KEY_DESCRIPTION = "description";
  static final String KEY_INPUT = "text";
  static final String KEY_EXPECTED_OUTPUT = "expected";
  private static final String KEY_HIGHLIGHT_HITS = "hits";
  private static final Extractor extractor = new Extractor();
  private static final Autolink linker = new Autolink(false);
  private static final Validator validator = new Validator();
  private static final HitHighlighter hitHighlighter = new HitHighlighter();

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
          extractor.extractMentionedScreennames((String) testCase.get(KEY_INPUT)));
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
          extractor.extractReplyScreenname((String) testCase.get(KEY_INPUT)));
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
          extractor.extractHashtags((String) testCase.get(KEY_INPUT)));
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
          extractor.extractHashtags((String) testCase.get(KEY_INPUT)));
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
      @SuppressWarnings("unchecked")
      List<Map<String, Object>> expectedConfig = (List<Map<String, Object>>)testCase.get(KEY_EXPECTED_OUTPUT);
      List<Extractor.Entity> expected = new LinkedList<Extractor.Entity>();
      for (Map<String, Object> configEntry : expectedConfig) {
        @SuppressWarnings("unchecked")
        List<Integer> indices = (List<Integer>)configEntry.get("indices");
        expected.add(new Extractor.Entity(indices.get(0), indices.get(1), configEntry.get("hashtag").toString(), Extractor.Entity.Type.HASHTAG));
      }

      assertEquals((String) testCase.get(KEY_DESCRIPTION),
          expected,
          extractor.extractHashtagsWithIndices((String) testCase.get(KEY_INPUT)));
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
          extractor.extractURLs((String) testCase.get(KEY_INPUT)));
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
          extractor.extractURLs((String) testCase.get(KEY_INPUT)));
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
          extractor.extractURLs((String) testCase.get(KEY_INPUT)));
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
          extractor.extractCashtags((String) testCase.get(KEY_INPUT)));
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
      @SuppressWarnings("unchecked")
      List<Map<String, Object>> expectedConfig = (List<Map<String, Object>>)testCase.get(KEY_EXPECTED_OUTPUT);
      List<Extractor.Entity> expected = new LinkedList<Extractor.Entity>();
      for (Map<String, Object> configEntry : expectedConfig) {
        @SuppressWarnings("unchecked")
        List<Integer> indices = (List<Integer>)configEntry.get("indices");
        expected.add(new Extractor.Entity(indices.get(0), indices.get(1), configEntry.get("cashtag").toString(), Extractor.Entity.Type.CASHTAG));
      }

      assertEquals((String)testCase.get(KEY_DESCRIPTION),
                   expected,
                   extractor.extractCashtagsWithIndices((String)testCase.get(KEY_INPUT)));
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
          linker.autoLinkUsernamesAndLists((String) testCase.get(KEY_INPUT)));
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
          linker.autoLinkUsernamesAndLists((String) testCase.get(KEY_INPUT)));
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
          linker.autoLinkHashtags((String) testCase.get(KEY_INPUT)));
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
          linker.autoLinkURLs((String) testCase.get(KEY_INPUT)));
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
          linker.autoLinkCashtags((String) testCase.get(KEY_INPUT)));
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
          linker.autoLink((String) testCase.get(KEY_INPUT)));
    }
  }

  @RunWith(Parameterized.class)
  public static class TweetLengthConformanceTest {
    @Parameter
    public Map testCase;

    @Parameters
    public static Collection<Map> data() throws Exception {
      return loadConformanceData("validate.yml", "lengths");
    }

    @Test
    public void testTweetLengthExtractor() throws Exception {
      assertEquals((String) testCase.get(KEY_DESCRIPTION),
          testCase.get(KEY_EXPECTED_OUTPUT),
          validator.getTweetLength((String)testCase.get(KEY_INPUT)));
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
      List<List<Integer>> hits = (List<List<Integer>>)testCase.get(KEY_HIGHLIGHT_HITS);
      assertEquals((String) testCase.get(KEY_DESCRIPTION),
          testCase.get(KEY_EXPECTED_OUTPUT),
          hitHighlighter.highlight((String)testCase.get(KEY_INPUT), hits));
    }
  }

  @SuppressWarnings("unchecked")
  static List<Map> loadConformanceData(String yamlFile, String testType) throws FileNotFoundException {
    Yaml yaml = new Yaml();
    Map fullConfig = yaml.loadAs(new FileInputStream(new File(System.getProperty(CONFORMANCE_DIR_PROPERTY, "../conformance"), yamlFile)), Map.class);
    Map testConfig = (Map) fullConfig.get("tests");
    return (List<Map>)testConfig.get(testType);
  }
}
