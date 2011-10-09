package com.twitter;

import java.io.File;
import java.util.List;

/**
 * Micro benchmark for discovering hotspots in our autolinker.
 */
public class Benchmark extends ConformanceBase {

  private static final int AUTO_LINK_TESTS = 100000;

  public void testBenchmarkAutolinking() throws Exception {
    File yamlFile = new File(conformanceDir, "autolink.yml");
    List testCases = loadConformanceData(yamlFile, "all");
    autolink(testCases);
    long start = System.currentTimeMillis();
    for (int i = 0; i < AUTO_LINK_TESTS; i++) {
      autolink(testCases);
    }
    long diff = System.currentTimeMillis() - start;
    System.out.println(((double) AUTO_LINK_TESTS) / diff + " autolinks per ms");
  }

  public static void main(String[] args) throws Exception {
    Benchmark benchmark = new Benchmark();
    benchmark.setUp();
    benchmark.testBenchmarkAutolinking();
    benchmark.tearDown();
  }
}
