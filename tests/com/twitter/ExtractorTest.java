
package com.twitter;

import junit.framework.TestCase;
import com.twitter.*;

public class ExtractorTest extends TestCase {
  private Extractor extractor;

  public void setUp() throws Exception {
    extractor = new Extractor();
  }

  public void testReplyAtTheStart() {
    String extracted = extractor.extractReplyScreenname("@user reply");
    assertEquals("Failed to extract reply at the start", "user", extracted);
  }

  public void testReplyWithLeadingSpace() {
    String extracted = extractor.extractReplyScreenname(" @user reply");
    assertEquals("Failed to extract reply with leading space", "user", extracted);
  }
}