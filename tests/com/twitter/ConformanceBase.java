package com.twitter;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.List;
import java.util.Map;

import junit.framework.TestCase;
import org.ho.yaml.Yaml;

/**
 * Base class for the Conformance test and the Benchmark test
 */
public class ConformanceBase extends TestCase {
  private static final String CONFORMANCE_DIR_PROPERTY = "conformance.dir";
  protected static final String KEY_DESCRIPTION = "description";
  protected static final String KEY_INPUT = "text";
  protected static final String KEY_EXPECTED_OUTPUT = "expected";
  protected static final String KEY_HIGHLIGHT_HITS = "hits";
  protected File conformanceDir;
  protected Extractor extractor = new Extractor();
  protected Autolink linker = new Autolink();
  protected HitHighlighter hitHighlighter = new HitHighlighter();

  public void setUp() {
    assertNotNull("Missing required system property: " + CONFORMANCE_DIR_PROPERTY, System.getProperty(
            CONFORMANCE_DIR_PROPERTY));
    conformanceDir = new File(System.getProperty(CONFORMANCE_DIR_PROPERTY));
    assertTrue("Conformance directory " + conformanceDir + " is not a directory.", conformanceDir.isDirectory());

    assertNotNull("No extractor configured", extractor);
    assertNotNull("No autolinker configured", linker);
    linker.setNoFollow(false);
  }

  protected void autolink(List<Map> testCases) {
    for (Map testCase : testCases) {
      assertEquals((String)testCase.get(KEY_DESCRIPTION),
                   (String)testCase.get(KEY_EXPECTED_OUTPUT),
                   linker.autoLink((String) testCase.get(KEY_INPUT)));
    }
  }

  protected List loadConformanceData(File yamlFile, String testType) throws FileNotFoundException {
    Map fullConfig = (Map) Yaml.load(yamlFile);
    Map testConfig = (Map)fullConfig.get("tests");
    return (List)testConfig.get(testType);
  }
}
