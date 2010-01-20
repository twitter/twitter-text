
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

    return extractList(Regex.EXTRACT_MENTIONS, text, Regex.EXTRACT_MENTIONS_GROUP_USERNAME);
  }

  public String extractReplyScreenname(String text) {
    if (text == null) {
      return null;
    }

    Matcher matcher = Regex.EXTRACT_REPLY.matcher(text);
    if (matcher.matches()) {
      return matcher.group(Regex.EXTRACT_REPLY_GROUP_USERNAME);
    } else {
      return null;
    }
  }

  public List<String> extractURLs(String text) {
    if (text == null) {
      return null;
    }

    return extractList(Regex.VALID_URL, text, Regex.VALID_URL_GROUP_URL);
  }

  public List<String> extractHashtags(String text) {
    if (text == null) {
      return null;
    }

    return extractList(Regex.AUTO_LINK_HASHTAGS, text, Regex.AUTO_LINK_HASHTAGS_GROUP_TAG);
  }

  private List<String> extractList(Pattern pattern, String text, int groupNumber) {
    List<String> extracted = new ArrayList<String>();
    Matcher matcher = pattern.matcher(text);
    while (matcher.find()) {
      extracted.add(matcher.group(groupNumber));
    }
    return extracted;
  }
}