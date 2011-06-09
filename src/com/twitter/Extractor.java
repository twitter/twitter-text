
package com.twitter;

import java.util.*;
import java.util.regex.*;

/**
 * A class to extract usernames, lists, hashtags and URLs from Tweet text.
 */
public class Extractor {
  public static class Entity {
    protected Integer start = null;
    protected Integer end = null;
    protected String  value = null;
    protected String  type = null;

    public Entity(Matcher matcher, String valueType, Integer groupNumber) {
      // Offset -1 on start index to include @, # symbols for mentions and hashtags
      this(matcher, valueType, groupNumber, -1);
    }

    public Entity(Matcher matcher, String valueType, Integer groupNumber, int startOffset) {
      this.start = matcher.start(groupNumber) + startOffset; // 0-indexed.
      this.end = matcher.end(groupNumber);
      this.value = matcher.group(groupNumber);
      this.type = valueType;
    }
    /** Constructor used from conformance data */
    public Entity(Map<String, Object> config, String valueType) {
      this.type = valueType;
      this.value = (String)config.get(valueType);
      List<Integer> indices = (List<Integer>)config.get("indices");
      this.start = indices.get(0);
      this.end = indices.get(1);
    }

    public boolean equals(Object obj) {
      if (this == obj) {
        return true;
      }

      if (!(obj instanceof Entity)) {
        System.out.println("incorrect type");
        return false;
      }

      Entity other = (Entity)obj;

      if (this.type.equals(other.type) &&
          this.start.equals(other.start) &&
          this.end.equals(other.end) &&
          this.value.equals(other.value)) {
        return true;
      } else {
        return false;
      }
    }

    public int hashCode() {
      return this.type.hashCode() + this.value.hashCode() + this.start + this.end;
    }

    public Integer getStart() {
      return start;
    }

    public Integer getEnd() {
      return end;
    }
    
    public String getValue() {
      return value;
    }

    public String getType() {
      return type;
    }
  }

  /**
   * Create a new extractor.
   */
  public Extractor() {
  }

  /**
   * Extract @username references from Tweet text. A mention is an occurance of @username anywhere in a Tweet.
   *
   * @param text of the tweet from which to extract usernames
   * @return List of usernames referenced (without the leading @ sign)
   */
  public List<String> extractMentionedScreennames(String text) {
    if (text == null) {
      return null;
    }

    List<String> extracted = new ArrayList<String>();
    Matcher matcher = Regex.EXTRACT_MENTIONS.matcher(text);
    while (matcher.find()) {
      if (! Regex.SCREEN_NAME_MATCH_END.matcher(matcher.group(Regex.EXTRACT_MENTIONS_GROUP_AFTER)).matches()) {
        extracted.add(matcher.group(Regex.EXTRACT_MENTIONS_GROUP_USERNAME));
      }
    }
    return extracted;
  }

  /**
   * Extract @username references from Tweet text. A mention is an occurance of @username anywhere in a Tweet.
   *
   * @param text of the tweet from which to extract usernames
   * @return List of usernames referenced (without the leading @ sign)
   */
  public List<Entity> extractMentionedScreennamesWithIndices(String text) {
    if (text == null) {
      return null;
    }

    List<Entity> extracted = new ArrayList<Entity>();
    Matcher matcher = Regex.EXTRACT_MENTIONS.matcher(text);
    while (matcher.find()) {
      if (! Regex.SCREEN_NAME_MATCH_END.matcher(matcher.group(Regex.EXTRACT_MENTIONS_GROUP_AFTER)).matches()) {
        extracted.add(new Entity(matcher, "mention", Regex.EXTRACT_MENTIONS_GROUP_USERNAME));
      }
    }
    return extracted;
  }


  /**
   * Extract a @username reference from the beginning of Tweet text. A reply is an occurance of @username at the
   * beginning of a Tweet, preceded by 0 or more spaces.
   *
   * @param text of the tweet from which to extract the replied to username
   * @return username referenced, if any (without the leading @ sign). Returns null if this is not a reply.
   */
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

  /**
   * Extract URL references from Tweet text.
   *
   * @param text of the tweet from which to extract URLs
   * @return List of URLs referenced.
   */
  public List<String> extractURLs(String text) {
    if (text == null) {
      return null;
    }

    List<String> urls = new ArrayList<String>();

    Matcher matcher = Regex.VALID_URL.matcher(text);
    while (matcher.find()) {
      String protocol = matcher.group(Regex.VALID_URL_GROUP_PROTOCOL);
      if (!protocol.isEmpty()) {
        urls.add(matcher.group(Regex.VALID_URL_GROUP_URL));
      }
    }

    return urls;
  }

  /**
   * Extract URL references from Tweet text.
   *
   * @param text of the tweet from which to extract URLs
   * @return List of URLs referenced.
   */
  public List<Entity> extractURLsWithIndices(String text) {
    if (text == null) {
      return null;
    }

    List<Entity> urls = new ArrayList<Entity>();

    Matcher matcher = Regex.VALID_URL.matcher(text);
    while (matcher.find()) {
      String protocol = matcher.group(Regex.VALID_URL_GROUP_PROTOCOL);
      if (!protocol.isEmpty()) {
        urls.add(new Entity(matcher, "url", Regex.VALID_URL_GROUP_URL, 0));
      }
    }

    return urls;
  }


  /**
   * Extract #hashtag references from Tweet text.
   *
   * @param text of the tweet from which to extract hashtags
   * @return List of hashtags referenced (without the leading # sign)
   */
  public List<String> extractHashtags(String text) {
    if (text == null) {
      return null;
    }

    return extractList(Regex.AUTO_LINK_HASHTAGS, text, Regex.AUTO_LINK_HASHTAGS_GROUP_TAG);
  }

  /**
   * Extract #hashtag references from Tweet text.
   *
   * @param text of the tweet from which to extract hashtags
   * @return List of hashtags referenced (without the leading # sign)
   */
  public List<Entity> extractHashtagsWithIndices(String text) {
    if (text == null) {
      return null;
    }

    return extractListWithIndices(Regex.AUTO_LINK_HASHTAGS, text, Regex.AUTO_LINK_HASHTAGS_GROUP_TAG, "hashtag");
  }

  /**
   * Helper method for extracting multiple matches from Tweet text.
   *
   * @param pattern to match and use for extraction
   * @param text of the Tweet to extract from
   * @param groupNumber the capturing group of the pattern that should be added to the list.
   * @return list of extracted values, or an empty list if there were none.
   */
  private List<String> extractList(Pattern pattern, String text, int groupNumber) {
    List<String> extracted = new ArrayList<String>();
    Matcher matcher = pattern.matcher(text);
    while (matcher.find()) {
      extracted.add(matcher.group(groupNumber));
    }
    return extracted;
  }

  // TODO: Make this a real object, not a Map
  private List<Entity> extractListWithIndices(Pattern pattern, String text, int groupNumber, String valueType) {
    List<Entity> extracted = new ArrayList<Entity>();
    Matcher matcher = pattern.matcher(text);

    while (matcher.find()) {
      extracted.add(new Entity(matcher, valueType, groupNumber));
    }
    return extracted;
  }
}
