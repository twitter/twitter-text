
package com.twitter;

import java.util.*;
import java.util.regex.*;

public class Extractor {

  public Extractor() {
  }

  public List<String> extractMentionedScreennames(String text) {
    if (text == null) {
      return null;
    }

    Matcher matcher = Regex.EXTRACT_MENTIONS.matcher(text);
    return extractList(matcher, 2);
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
    if (text == null) {
      return null;
    }

    Matcher matcher = Regex.VALID_URL.matcher(text);
    return extractList(matcher, 3);
  }

  public List<String> extractHashtags(String text) {
    if (text == null) {
      return null;
    }

    Matcher matcher = Regex.EXTRACT_REPLY.matcher(text);
    return extractList(matcher, 3);
  }

  private List<String> extractList(Matcher matcher, int groupNumber) {
    List<String> extracted = new ArrayList<String>();
    while (matcher.find()) {
      extracted.add(matcher.group(groupNumber));
    }
    return extracted;
  }
}