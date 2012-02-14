
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
   * @param text original text
   * @param entities entities with Unicode based indices
   */
  public void modifyIndicesFromUnicodeToUTF16(String text, List<Entity> entities) {
    // In order to avoid having to track which entities we have already
    // shifted, we process the string from the back to the front,
    // since converting from code points to code units never makes offsets
    // smaller.
    int codePointLocation = text.codePointCount(0, text.length()) - 1;

    // The current code unit (string location). This is always moved in lock
    // step with the codePointLocation.
    int charLocation = text.length() - 1;

    while (true) {
      // Find the next entity (counting code points, backwards) that needs to
      // be shifted.
      int nextEntityStart = -1;

      for (Entity entity : entities) {
        final int start = entity.getStart();

        // If this entity's start is the current code point location,
        // then it has not yet been converted (its units are still code units).
        if (start == codePointLocation) {
          if (charLocation != codePointLocation) {
            final int entityLength = entity.end - start;
            entity.start = charLocation;
            entity.end = charLocation + entityLength;
          }
        } else {
          // Choose the entity with the highest code point offset out of
          // those that have not yet been converted.
          if (start < codePointLocation && start > nextEntityStart) {
            nextEntityStart = start;
          }
        }
      }

      // Stop if no entity was found between the beginning of the string and
      // the current location.
      if (nextEntityStart < 0) break;

      while (codePointLocation > nextEntityStart) {
        if (charLocation > 0) {
          final char c1 = text.charAt(charLocation);
          final char c0 = text.charAt(charLocation - 1);
          if (Character.isSurrogatePair(c0, c1)) {
            charLocation--;
          }
        }
        codePointLocation--;
        charLocation--;
      }
    }
  }

  /*
   * Modify UTF-16-based indices of the entities to Unicode-based indices.
   *
   * In Unicode-based indices, Unicode supplementary characters are counted as single characters.
   *
   * @param text original text
   * @param entities entities with UTF-16 based indices
   */
  public void modifyIndicesFromUTF16ToToUnicode(String text, List<Entity> entities) {
    int codePointLocation = 0;
    int charLocation = 0;

    boolean wasHighSurrogate = false;

    while (true) {
      // Find the next entity (counting code units, counting forward) that
      // needs conversion, while converting any entities that occur at the
      // current location.
      int nextEntityStart = text.length();

      for (Entity entity : entities) {
        int start = entity.start;

        // Any entities that occur at this location should have their offsets
        // converted. Since the conversion results in a location that is less
        // than or equal to the current location, we are guaranteed not to
        // convert an entity more than once.
        if (start == charLocation) {
          if (codePointLocation != charLocation) {
            final int entityLen = entity.end - start;
            entity.start = codePointLocation;
            entity.end = codePointLocation + entityLen;
          }
        } else {
          // Choose the entity with the lowest code unit offset out of
          // those that have not yet been converted.
          if (start > charLocation && start < nextEntityStart) {
            nextEntityStart = start;
          }
        }
      }

      // If the next entity is past the end of the text,
      // or if no more entities were found, then we can stop counting.
      if (nextEntityStart >= text.length()) break;

      // Count the unicode code points between the current location and the
      // next entity start.
      while (charLocation < nextEntityStart) {
        final char c = text.charAt(charLocation);
        if (wasHighSurrogate && Character.isLowSurrogate(c)) {
          wasHighSurrogate = false;
        } else {
          codePointLocation += 1;
          wasHighSurrogate = Character.isHighSurrogate(c);
        }
        charLocation++;
      }
    }
  }
}
