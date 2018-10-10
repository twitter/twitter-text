// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

package com.twitter.twittertext;

import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertEquals;

/**
 * Micro benchmark for discovering hotspots in our autolinker.
 */
public class Benchmark extends ConformanceTest {

  private static final int AUTO_LINK_TESTS = 10000;
  private static final int ITERATIONS = 10;
  private static final Autolink LINKER = new Autolink(false);

  public double testBenchmarkAutolinking() throws Exception {
    List<Map> testCases = loadConformanceData("autolink.yml", "all");
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

  private void autolink(List<Map> testCases) {
    for (Map testCase : testCases) {
      assertEquals((String) testCase.get(KEY_DESCRIPTION),
          testCase.get(KEY_EXPECTED_OUTPUT),
          LINKER.autoLink((String) testCase.get(KEY_INPUT)));
    }
  }

  public static void main(String[] args) throws Exception {
    Benchmark benchmark = new Benchmark();
    double total = 0;
    double best = Double.MAX_VALUE;
    double worst = 0;
    for (int i = 0; i < ITERATIONS; i++) {
      double result = benchmark.testBenchmarkAutolinking();
      if (best > result) {
        best = result;
      }
      if (worst < result) {
        worst = result;
      }
      total += result;
    }
    // Drop worst and best
    total -= best + worst;
    System.out.println("Average: " + (total / (ITERATIONS - 2)));
  }
}
