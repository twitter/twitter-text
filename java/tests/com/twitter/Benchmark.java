package com.twitter;

import java.io.File;
import java.util.List;

/**
 * Micro benchmark for discovering hotspots in our autolinker.
 */
public class Benchmark extends ConformanceTest {

  private static final int AUTO_LINK_TESTS = 10000;
  private static final int ITERATIONS = 10;

  public double testBenchmarkAutolinking() throws Exception {
    File yamlFile = new File(conformanceDir, "autolink.yml");
    List testCases = loadConformanceData(yamlFile, "all");
    autolink(testCases);
    long start = System.currentTimeMillis();
    for (int i = 0; i < AUTO_LINK_TESTS; i++) {
      autolink(testCases);
    }
    long diff = System.currentTimeMillis() - start;
    double autolinksPerMS = ((double) AUTO_LINK_TESTS) / diff;
    System.out.println(autolinksPerMS + " autolinks per ms");
    return autolinksPerMS;
  }

  public static void main(String[] args) throws Exception {
    Benchmark benchmark = new Benchmark();
    benchmark.setUp();
    double total = 0;
    double best = Double.MAX_VALUE;
    double worst = 0;
    for (int i = 0; i < ITERATIONS; i++) {
      double result = benchmark.testBenchmarkAutolinking();
      if (best > result) best = result;
      if (worst < result) worst = result;
      total += result;
    }
    // Drop worst and best
    total -= best + worst;
    System.out.println("Average: " + (total/(ITERATIONS - 2)));
    benchmark.tearDown();
  }
}
