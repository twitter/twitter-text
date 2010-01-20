
package com.twitter;

import java.util.*;
import java.util.regex.*;

public class Extractor {

  public Extractor() {
  }

  public List<String> extractMentionedScreennames(String text) {
    return null;
  }

  public String extractReplyScreenname(String text) {
    if (text == null) {
      return null;
    }
    
    Matcher matcher = Regex.EXTRACT_REPLY.matcher(text);
    if (matcher.matches()) {
      return matcher.group(1);
    } else {
      return null;
    }
  }

  public List<String> extractURLs(String text) {
    return null;
  }

  public List<String> extractHashtags(String text) {
    return null;
  }
}