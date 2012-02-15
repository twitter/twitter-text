
package com.twitter;

import java.util.*;
import java.util.regex.*;

/**
 * A class to extract usernames, lists, hashtags and URLs from Tweet text.
 */
public class Extractor {
  public static class Entity {
    protected int start;
    protected int end;
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
      Entity entity = new Entity(matcher, "url", Regex.VALID_URL_GROUP_URL, 0);
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
      String after = text.substring(matcher.end());
      if (!Regex.HASHTAG_MATCH_END.matcher(after).find()) {
        extracted.add(matcher.group(groupNumber));
      }
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

  /*
   * Modify Unicode-based indices of the entities to UTF-16 based indices.
   *
   * In UTF-16 based indices, Unicode supplementary characters are counted as two characters.
   *
   * This method requires that the list of entities be in ascending order by start index.
   *
   * @param text original text
   * @param entities entities with Unicode based indices
   */
  public void modifyIndicesFromUnicodeToUTF16(String text, List<Entity> entities) {
    IndexConverter convert = new IndexConverter(text);

    for (Entity entity : entities) {
      entity.start = convert.codePointsToCodeUnits(entity.start);
      entity.end = convert.codePointsToCodeUnits(entity.end);
    }
  }

  /*
   * Modify UTF-16-based indices of the entities to Unicode-based indices.
   *
   * In Unicode-based indices, Unicode supplementary characters are counted as single characters.
   *
   * This method requires that the list of entities be in ascending order by start index.
   *
   * @param text original text
   * @param entities entities with UTF-16 based indices
   */
  public void modifyIndicesFromUTF16ToToUnicode(String text, List<Entity> entities) {
    IndexConverter convert = new IndexConverter(text);

    for (Entity entity : entities) {
      entity.start = convert.codeUnitsToCodePoints(entity.start);
      entity.end = convert.codeUnitsToCodePoints(entity.end);
    }
  }

  /**
   * An efficient converter of indices between code points and code units.
   */
  private static final class IndexConverter {
    protected final String text;

    // Keep track of a single corresponding pair of code unit and code point
    // offsets so that we can re-use counting work if the next requested
    // entity is near the most recent entity.
    protected int codePointIndex = 0;
    protected int charIndex = 0;

    IndexConverter(String text) {
      this.text = text;
    }

    /**
     * @param charIndex Index into the string measured in code units.
     * @return The code point index that corresponds to the specified character index.
     */
    int codeUnitsToCodePoints(int charIndex) {
      if (charIndex < this.charIndex) {
        this.codePointIndex -= text.codePointCount(charIndex, this.charIndex);
      } else {
        this.codePointIndex += text.codePointCount(this.charIndex, charIndex);
      }
      this.charIndex = charIndex;

      // Make sure that charIndex never points to the second code unit of a
      // surrogate pair.
      if (charIndex > 0 && Character.isSupplementaryCodePoint(text.codePointAt(charIndex - 1))) {
        this.charIndex -= 1;
      }
      return this.codePointIndex;
    }

    /**
     * @param codePointIndex Index into the string measured in code points.
     * @return the code unit index that corresponds to the specified code point index.
     */
    int codePointsToCodeUnits(int codePointIndex) {
      // Note that offsetByCodePoints accepts negative indices.
      this.charIndex = text.offsetByCodePoints(this.charIndex, codePointIndex - this.codePointIndex);
      this.codePointIndex = codePointIndex;
      return this.charIndex;
    }
  }
}