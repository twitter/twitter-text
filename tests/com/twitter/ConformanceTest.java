
package com.twitter;

import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import java.io.File;
import java.io.FileNotFoundException;

import junit.framework.TestCase;
import org.ho.yaml.Yaml;

public class ConformanceTest extends ConformanceBase {

  public void testMentionsExtractor() throws Exception {
    File yamlFile = new File(conformanceDir, "extract.yml");
    List testCases = loadConformanceData(yamlFile, "mentions");
    for (Map testCase : (List<Map>)testCases) {
      assertEquals((String)testCase.get(KEY_DESCRIPTION),
                   (List)testCase.get(KEY_EXPECTED_OUTPUT),
                   extractor.extractMentionedScreennames((String)testCase.get(KEY_INPUT)));
    }
  }

  public void testReplyExtractor() throws Exception {
    File yamlFile = new File(conformanceDir, "extract.yml");
    List testCases = loadConformanceData(yamlFile, "replies");
    for (Map testCase : (List<Map>)testCases) {
      assertEquals((String)testCase.get(KEY_DESCRIPTION),
                   (String)testCase.get(KEY_EXPECTED_OUTPUT),
                   extractor.extractReplyScreenname((String)testCase.get(KEY_INPUT)));
    }
  }

  public void testHashtagsExtractor() throws Exception {
    File yamlFile = new File(conformanceDir, "extract.yml");
    List testCases = loadConformanceData(yamlFile, "hashtags");
    for (Map testCase : (List<Map>)testCases) {
      assertEquals((String)testCase.get(KEY_DESCRIPTION),
                   (List)testCase.get(KEY_EXPECTED_OUTPUT),
                   extractor.extractHashtags((String)testCase.get(KEY_INPUT)));
    }
  }

  public void testHashtagsWithIndicesExtractor() throws Exception {
    File yamlFile = new File(conformanceDir, "extract.yml");
    List testCases = loadConformanceData(yamlFile, "hashtags_with_indices");
    for (Map testCase : (List<Map>)testCases) {
      List<Map<String, Object>> expectedConfig = (List)testCase.get(KEY_EXPECTED_OUTPUT);
      List<Extractor.Entity> expected = new ArrayList<Extractor.Entity>();
      for (Map<String, Object> configEntry : expectedConfig) {
        expected.add(new Extractor.Entity(configEntry, "hashtag"));
      }

      assertEquals((String)testCase.get(KEY_DESCRIPTION),
                   expected,
                   extractor.extractHashtagsWithIndices((String)testCase.get(KEY_INPUT)));
    }
  }

  public void testURLsExtractor() throws Exception {
    File yamlFile = new File(conformanceDir, "extract.yml");
    List testCases = loadConformanceData(yamlFile, "urls");
    for (Map testCase : (List<Map>)testCases) {
      assertEquals((String)testCase.get(KEY_DESCRIPTION),
                   (List)testCase.get(KEY_EXPECTED_OUTPUT),
                   extractor.extractURLs((String)testCase.get(KEY_INPUT)));
    }
  }


  public void testUsernameAutolinking() throws Exception {
    File yamlFile = new File(conformanceDir, "autolink.yml");
    List testCases = loadConformanceData(yamlFile, "usernames");
    for (Map testCase : (List<Map>)testCases) {
      assertEquals((String)testCase.get(KEY_DESCRIPTION),
                   (String)testCase.get(KEY_EXPECTED_OUTPUT),
                   linker.autoLinkUsernamesAndLists((String)testCase.get(KEY_INPUT)));
    }
  }

  public void testListAutolinking() throws Exception {
    File yamlFile = new File(conformanceDir, "autolink.yml");
    List testCases = loadConformanceData(yamlFile, "lists");
    for (Map testCase : (List<Map>)testCases) {
      assertEquals((String)testCase.get(KEY_DESCRIPTION),
                   (String)testCase.get(KEY_EXPECTED_OUTPUT),
                   linker.autoLinkUsernamesAndLists((String) testCase.get(KEY_INPUT)));
    }
  }

  public void testHashtagAutolinking() throws Exception {
    File yamlFile = new File(conformanceDir, "autolink.yml");
    List testCases = loadConformanceData(yamlFile, "hashtags");
    for (Map testCase : (List<Map>)testCases) {
      assertEquals((String)testCase.get(KEY_DESCRIPTION),
                   (String)testCase.get(KEY_EXPECTED_OUTPUT),
                   linker.autoLinkHashtags((String) testCase.get(KEY_INPUT)));
    }
  }

  public void testURLAutolinking() throws Exception {
    File yamlFile = new File(conformanceDir, "autolink.yml");
    List testCases = loadConformanceData(yamlFile, "urls");
    for (Map testCase : (List<Map>)testCases) {
      assertEquals((String)testCase.get(KEY_DESCRIPTION),
                   (String)testCase.get(KEY_EXPECTED_OUTPUT),
                   linker.autoLinkURLs((String)testCase.get(KEY_INPUT)));
    }
  }

  public void testAllAutolinking() throws Exception {
    File yamlFile = new File(conformanceDir, "autolink.yml");
    List testCases = loadConformanceData(yamlFile, "all");
    autolink(testCases);
  }

  public void testPlainTextHitHighlighting() throws Exception {
    File yamlFile = new File(conformanceDir, "hit_highlighting.yml");
    List testCases = loadConformanceData(yamlFile, "plain_text");
    List<List<Integer>> hits = null;
    
    for (Map testCase : (List<Map>)testCases) {
      hits = (List<List<Integer>>)testCase.get(KEY_HIGHLIGHT_HITS);
      assertEquals((String)testCase.get(KEY_DESCRIPTION),
                   (String)testCase.get(KEY_EXPECTED_OUTPUT),
                   hitHighlighter.highlight( (String)testCase.get(KEY_INPUT), hits));
    }
  }

}
