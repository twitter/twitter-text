
package com.twitter;

import java.util.*;
import java.util.regex.*;

/**
 * A class to extract usernames, lists, hashtags and URLs from Tweet text.
 */
public class Extractor {
  public static class Entity {
    public enum Type {
      URL, HASHTAG, MENTION
    }

    protected final int start;
    protected final int end;
    protected final String value;
    protected final String listSlug;
    protected final Type type;

    public Entity(int start, int end, String value, String listSlug, Type type) {
      this.start = start;
      this.end = end;
      this.value = value;
      this.listSlug = listSlug;
      this.type = type;
    }

    public Entity(int start, int end, String value, Type type) {
      this(start, end, value, null, type);
    }

    public Entity(Matcher matcher, Type type, int groupNumber) {
      // Offset -1 on start index to include @, # symbols for mentions and hashtags
      this(matcher, type, groupNumber, -1);
    }

    public Entity(Matcher matcher, Type type, int groupNumber, int startOffset) {
      this(matcher.start(groupNumber) + startOffset, matcher.end(groupNumber), matcher.group(groupNumber), type);
    }

    public boolean equals(Object obj) {
      if (this == obj) {
        return true;
      }

      if (!(obj instanceof Entity)) {
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

    public String getListSlug() {
      return listSlug;
    }

    public Type getType() {
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
    List<Entity> entities = new ArrayList<Entity>();
    entities.addAll(extractURLsWithIndices(text));
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
        } else {
          prev = cur;
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
    if (text == null || text.isEmpty()) {
      return Collections.emptyList();
    }

    List<String> extracted = new ArrayList<String>();
    for (Entity entity : extractMentionedScreennamesWithIndices(text)) {
      extracted.add(entity.value);
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
    if (text == null || text.isEmpty()) {
      return Collections.emptyList();
    }

    boolean found = false;
    for (char c : text.toCharArray()) {
      if (c == '@' || c == '＠') {
        found = true;
        break;
      }
    }
    if (!found) {
      return Collections.emptyList();
    }

    List<Entity> extracted = new ArrayList<Entity>();
    Matcher matcher = Regex.VALID_MENTION_OR_LIST.matcher(text);
    while (matcher.find()) {
      String after = text.substring(matcher.end());
      if (! Regex.INVALID_MENTION_MATCH_END.matcher(after).find()) {
        if (matcher.group(Regex.VALID_MENTION_OR_LIST_GROUP_LIST) == null) {
          extracted.add(new Entity(matcher, Entity.Type.MENTION, Regex.VALID_MENTION_OR_LIST_GROUP_USERNAME));
        } else {
          extracted.add(new Entity(matcher.start(Regex.VALID_MENTION_OR_LIST_GROUP_USERNAME) - 1,
              matcher.end(Regex.VALID_MENTION_OR_LIST_GROUP_USERNAME),
              matcher.group(Regex.VALID_MENTION_OR_LIST_GROUP_USERNAME),
              matcher.group(Regex.VALID_MENTION_OR_LIST_GROUP_LIST),
              Entity.Type.MENTION));
        }
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

    Matcher matcher = Regex.VALID_REPLY.matcher(text);
    if (matcher.find()) {
      String after = text.substring(matcher.end());
      if (Regex.INVALID_MENTION_MATCH_END.matcher(after).find()) {
        return null;
      } else {
        return matcher.group(Regex.VALID_REPLY_GROUP_USERNAME);
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
    if (text == null || text.isEmpty()) {
      return Collections.emptyList();
    }

    List<String> urls = new ArrayList<String>();
    for (Entity entity : extractURLsWithIndices(text)) {
      urls.add(entity.value);
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
    if (text == null || text.isEmpty()
        || (extractURLWithoutProtocol ? text.indexOf('.') : text.indexOf(':')) == -1) {
      return Collections.emptyList();
    }

    List<Entity> urls = new ArrayList<Entity>();

    Matcher matcher = Regex.VALID_URL.matcher(text);
    while (matcher.find()) {
      if (matcher.group(Regex.VALID_URL_GROUP_PROTOCOL) == null) {
        // skip if protocol is not present and 'extractURLWithoutProtocol' is false
        // or URL is preceded by invalid character.
        if (!extractURLWithoutProtocol
            || Regex.INVALID_URL_WITHOUT_PROTOCOL_MATCH_BEGIN
                    .matcher(matcher.group(Regex.VALID_URL_GROUP_BEFORE)).matches()) {
          continue;
        }
      }
      String url = matcher.group(Regex.VALID_URL_GROUP_URL);
      int start = matcher.start(Regex.VALID_URL_GROUP_URL);
      int end = matcher.end(Regex.VALID_URL_GROUP_URL);
      Matcher tco_matcher = Regex.VALID_TCO_URL.matcher(url);
      if (tco_matcher.find()) {
        // In the case of t.co URLs, don't allow additional path characters.
        url = tco_matcher.group();
        end = start + url.length();
      }

      urls.add(new Entity(start, end, url, Entity.Type.URL));
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
    if (text == null || text.isEmpty()) {
      return Collections.emptyList();
    }

    List<String> extracted = new ArrayList<String>();
    for (Entity entity : extractHashtagsWithIndices(text)) {
      extracted.add(entity.value);
    }

    return extracted;
  }

  /**
   * Extract #hashtag references from Tweet text.
   *
   * @param text of the tweet from which to extract hashtags
   * @return List of hashtags referenced (without the leading # sign)
   */
  public List<Entity> extractHashtagsWithIndices(String text) {
    if (text == null || text.isEmpty()) {
      return Collections.emptyList();
    }

    boolean found = false;
    for (char c : text.toCharArray()) {
      if (c == '#' || c == '＃') {
        found = true;
        break;
      }
    }
    if (!found) {
      return Collections.emptyList();
    }

    List<Entity> extracted = new ArrayList<Entity>();
    Matcher matcher = Regex.VALID_HASHTAG.matcher(text);

    while (matcher.find()) {
      String after = text.substring(matcher.end());
      if (!Regex.INVALID_HASHTAG_MATCH_END.matcher(after).find()) {
        extracted.add(new Entity(matcher, Entity.Type.HASHTAG, Regex.VALID_HASHTAG_GROUP_TAG));
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
