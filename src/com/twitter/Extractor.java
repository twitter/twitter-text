
package com.twitter;

import java.util.*;
import java.util.regex.*;

/**
 * A class to extract usernames, lists, hashtags and URLs from Tweet text.
 */
public class Extractor {
  public enum EntityType {
    URL, HASHTAG, MENTION, LIST
  };

  public static class Entity {
    protected int start;
    protected int end;
    protected String value = null;
    protected EntityType type = null;

    public Entity(int start, int end, String value, EntityType type) {
      this.start = start;
      this.end = end;
      this.value = value;
      this.type = type;
    }

    public Entity(Matcher matcher, EntityType type, Integer groupNumber) {
      // Offset -1 on start index to include @, # symbols for mentions and hashtags
      this(matcher, type, groupNumber, -1);
    }

    public Entity(Matcher matcher, EntityType type, Integer groupNumber, int startOffset) {
      this(matcher.start(groupNumber) + startOffset, matcher.end(groupNumber), matcher.group(groupNumber), type);
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
          this.start == other.start &&
          this.end == other.end &&
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

    public EntityType getType() {
      return type;
    }
  }

  protected boolean extractURLWithoutProtocol = true;

  /**
   * Create a new extractor.
   */
  public Extractor() {
  }

  public List<Entity> extractEntities(String text) {
    List<Entity> entities = extractURLsWithIndices(text);
    entities.addAll(extractHashtagsWithIndices(text));
    entities.addAll(extractMentionedScreennamesWithIndices(text));

    // sort by index
    Collections.<Entity>sort(entities, new Comparator<Entity>() {
      public int compare(Entity e1, Entity e2) {
        return e1.start - e2.start;
      }
    });

    // remove overlap
    if (!entities.isEmpty()) {
      Iterator<Entity> it = entities.iterator();
      Entity prev = it.next();
      while (it.hasNext()) {
        Entity cur = it.next();
        if (prev.getEnd() > cur.getStart()) {
          it.remove();
        }
      }
    }

    return entities;
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
      String after = text.substring(matcher.end());
      if (! Regex.SCREEN_NAME_MATCH_END.matcher(after).find()) {
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
      String after = text.substring(matcher.end());
      if (! Regex.SCREEN_NAME_MATCH_END.matcher(after).find()) {
        extracted.add(new Entity(matcher, EntityType.MENTION, Regex.EXTRACT_MENTIONS_GROUP_USERNAME));
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
    if (matcher.find()) {
      String after = text.substring(matcher.end());
      if (Regex.SCREEN_NAME_MATCH_END.matcher(after).find()) {
        return null;
      } else {
        return matcher.group(Regex.EXTRACT_REPLY_GROUP_USERNAME);
      }
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
      if (!extractURLWithoutProtocol && matcher.group(Regex.VALID_URL_GROUP_PROTOCOL) == null) {
        continue;
      }
      String url = matcher.group(Regex.VALID_URL_GROUP_URL);
      Matcher tco_matcher = Regex.VALID_TCO_URL.matcher(url);
      if (tco_matcher.find()) {
        // In the case of t.co URLs, don't allow additional path characters.
        url = tco_matcher.group();
      }
      urls.add(url);
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
      if (!extractURLWithoutProtocol && matcher.group(Regex.VALID_URL_GROUP_PROTOCOL) == null) {
        continue;
      }
      Entity entity = new Entity(matcher, EntityType.URL, Regex.VALID_URL_GROUP_URL, 0);
      String url = matcher.group(Regex.VALID_URL_GROUP_URL);
      Matcher tco_matcher = Regex.VALID_TCO_URL.matcher(url);
      if (tco_matcher.find()) {
        // In the case of t.co URLs, don't allow additional path characters.
        entity.value = tco_matcher.group();
        entity.end = entity.start + entity.value.length();
      }

      urls.add(entity);
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

    List<Entity> entities = extractHashtagsWithIndices(text);
    List<String> hashtags = new ArrayList<String>(entities.size());
    for (Entity entity : entities) {
      hashtags.add(entity.getValue());
    }
    return hashtags;
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

    List<Entity> extracted = new ArrayList<Entity>();
    Matcher matcher = Regex.AUTO_LINK_HASHTAGS.matcher(text);

    while (matcher.find()) {
      String after = text.substring(matcher.end());
      if (!Regex.HASHTAG_MATCH_END.matcher(after).find()) {
        extracted.add(new Entity(matcher, EntityType.HASHTAG, Regex.AUTO_LINK_HASHTAGS_GROUP_TAG));
      }
    }
    return extracted;
  }

  public void setExtractURLWithoutProtocol(boolean extractURLWithoutProtocol) {
    this.extractURLWithoutProtocol = extractURLWithoutProtocol;
  }

  public boolean isExtractURLWithoutProtocol() {
    return extractURLWithoutProtocol;
  }
}
