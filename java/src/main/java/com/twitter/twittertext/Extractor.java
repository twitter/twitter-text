// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

package com.twitter.twittertext;

import java.net.IDN;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Matcher;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * A class to extract usernames, lists, hashtags and URLs from Tweet text.
 */
public class Extractor {
  /**
   * The maximum url length that the Twitter backend supports.
   */
  public static final int MAX_URL_LENGTH = 4096;

  /**
   * The maximum t.co path length that the Twitter backend supports.
   */
  public static final int MAX_TCO_SLUG_LENGTH = 40;

  /**
   * The backend adds http:// for normal links and https to *.twitter.com URLs
   * (it also rewrites http to https for URLs matching *.twitter.com).
   * We're better off adding https:// all the time. By making the assumption that
   * URL_GROUP_PROTOCOL_LENGTH is https, the trade off is we'll disallow a http URL
   * that is 4096 characters.
   */
  private static final int URL_GROUP_PROTOCOL_LENGTH = "https://".length();

  public static class Entity {
    public enum Type {
      URL, HASHTAG, MENTION, CASHTAG
    }

    protected int start;
    protected int end;
    protected final String value;
    // listSlug is used to store the list portion of @mention/list.
    protected final String listSlug;
    protected final Type type;

    protected String displayURL = null;
    protected String expandedURL = null;

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
      this(matcher.start(groupNumber) + startOffset, matcher.end(groupNumber),
          matcher.group(groupNumber), type);
    }

    @Override
    public boolean equals(Object obj) {
      if (this == obj) {
        return true;
      }

      if (!(obj instanceof Entity)) {
        return false;
      }

      Entity other = (Entity) obj;

      return this.type.equals(other.type) &&
          this.start == other.start &&
          this.end == other.end &&
          this.value.equals(other.value);
    }

    @Override
    public int hashCode() {
      return this.type.hashCode() + this.value.hashCode() + this.start + this.end;
    }

    @Override
    public String toString() {
      return value + "(" + type + ") [" + start + "," + end + "]";
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

    public String getDisplayURL() {
      return displayURL;
    }

    public void setDisplayURL(String displayURL) {
      this.displayURL = displayURL;
    }

    public String getExpandedURL() {
      return expandedURL;
    }

    public void setExpandedURL(String expandedURL) {
      this.expandedURL = expandedURL;
    }
  }

  protected boolean extractURLWithoutProtocol = true;

  /**
   * Create a new extractor.
   */
  public Extractor() {
  }

  private void removeOverlappingEntities(List<Entity> entities) {
    // sort by index
    Collections.sort(entities, new Comparator<Entity>() {
      public int compare(Entity e1, Entity e2) {
        return e1.start - e2.start;
      }
    });

    // Remove overlapping entities.
    // Two entities overlap only when one is URL and the other is hashtag/mention
    // which is a part of the URL. When it happens, we choose URL over hashtag/mention
    // by selecting the one with smaller start index.
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
  }

  /**
   * Extract URLs, @mentions, lists and #hashtag from a given text/tweet.
   *
   * @param text text of tweet
   * @return list of extracted entities
   */
  public List<Entity> extractEntitiesWithIndices(String text) {
    List<Entity> entities = new ArrayList<Entity>();
    entities.addAll(extractURLsWithIndices(text));
    entities.addAll(extractHashtagsWithIndices(text, false));
    entities.addAll(extractMentionsOrListsWithIndices(text));
    entities.addAll(extractCashtagsWithIndices(text));

    removeOverlappingEntities(entities);
    return entities;
  }

  /**
   * Extract @username references from Tweet text. A mention is an occurrence of @username anywhere
   * in a Tweet.
   *
   * @param text of the tweet from which to extract usernames
   * @return List of usernames referenced (without the leading @ sign)
   */
  public List<String> extractMentionedScreennames(String text) {
    if (isEmptyString(text)) {
      return Collections.emptyList();
    }

    List<String> extracted = new ArrayList<String>();
    for (Entity entity : extractMentionedScreennamesWithIndices(text)) {
      extracted.add(entity.value);
    }
    return extracted;
  }

  /**
   * Extract @username references from Tweet text. A mention is an occurrence of @username anywhere
   * in a Tweet.
   *
   * @param text of the tweet from which to extract usernames
   * @return List of usernames referenced (without the leading @ sign)
   */
  public List<Entity> extractMentionedScreennamesWithIndices(String text) {
    List<Entity> extracted = new ArrayList<Entity>();
    for (Entity entity : extractMentionsOrListsWithIndices(text)) {
      if (entity.listSlug == null) {
        extracted.add(entity);
      }
    }
    return extracted;
  }

  /**
   * Extract @username and an optional list reference from Tweet text. A mention is an occurrence
   * of @username anywhere in a Tweet. A mention with a list is a @username/list.
   *
   * @param text of the tweet from which to extract usernames
   * @return List of usernames (without the leading @ sign) and an optional lists referenced
   */
  public List<Entity> extractMentionsOrListsWithIndices(String text) {
    if (isEmptyString(text)) {
      return Collections.emptyList();
    }

    // Performance optimization.
    // If text doesn't contain @/＠ at all, the text doesn't
    // contain @mention. So we can simply return an empty list.
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
      if (!Regex.INVALID_MENTION_MATCH_END.matcher(after).find()) {
        if (matcher.group(Regex.VALID_MENTION_OR_LIST_GROUP_LIST) == null) {
          extracted.add(new Entity(matcher, Entity.Type.MENTION,
              Regex.VALID_MENTION_OR_LIST_GROUP_USERNAME));
        } else {
          extracted.add(new Entity(matcher.start(Regex.VALID_MENTION_OR_LIST_GROUP_USERNAME) - 1,
              matcher.end(Regex.VALID_MENTION_OR_LIST_GROUP_LIST),
              matcher.group(Regex.VALID_MENTION_OR_LIST_GROUP_USERNAME),
              matcher.group(Regex.VALID_MENTION_OR_LIST_GROUP_LIST),
              Entity.Type.MENTION));
        }
      }
    }
    return extracted;
  }

  /**
   * Extract a @username reference from the beginning of Tweet text. A reply is an occurrence
   * of @username at the beginning of a Tweet, preceded by 0 or more spaces.
   *
   * @param text of the tweet from which to extract the replied to username
   * @return username referenced, if any (without the leading @ sign).
   * Returns null if this is not a reply.
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
  @Nonnull
  public List<String> extractURLs(@Nullable String text) {
    if (isEmptyString(text)) {
      return Collections.emptyList();
    }

    final List<String> urls = new ArrayList<>();
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
  @Nonnull
  public List<Entity> extractURLsWithIndices(@Nullable String text) {
    if (isEmptyString(text) ||
        (extractURLWithoutProtocol ? text.indexOf('.') : text.indexOf(':')) == -1) {
      // Performance optimization.
      // If text doesn't contain '.' or ':' at all, text doesn't contain URL,
      // so we can simply return an empty list.
      return Collections.emptyList();
    }

    final List<Entity> urls = new ArrayList<>();

    final Matcher matcher = Regex.VALID_URL.matcher(text);
    while (matcher.find()) {
      final String protocol = matcher.group(Regex.VALID_URL_GROUP_PROTOCOL);
      if (isEmptyString(protocol)) {
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
      final Matcher tcoMatcher = Regex.VALID_TCO_URL.matcher(url);
      if (tcoMatcher.find()) {
        final String tcoUrl = tcoMatcher.group(0);
        final String tcoUrlSlug = tcoMatcher.group(1);
        // In the case of t.co URLs, don't allow additional path characters and
        // ensure that the slug is under 40 chars.
        if (tcoUrlSlug.length() > MAX_TCO_SLUG_LENGTH) {
          continue;
        } else {
          url = tcoUrl;
          end = start + url.length();
        }
      }
      final String host = matcher.group(Regex.VALID_URL_GROUP_DOMAIN);
      if (isValidHostAndLength(url.length(), protocol, host)) {
        urls.add(new Entity(start, end, url, Entity.Type.URL));
      }
    }

    return urls;
  }

  /**
   * Verifies that the host name adheres to RFC 3490 and 1035
   * Also, verifies that the entire url (including protocol) doesn't exceed MAX_URL_LENGTH
   *
   * @param originalUrlLength The length of the entire URL, including protocol if any
   * @param protocol The protocol used
   * @param originalHost The hostname to check validity of
   * @return true if the host is valid
   */
  public static boolean isValidHostAndLength(int originalUrlLength, @Nullable String protocol,
                                             @Nullable String originalHost) {
    if (isEmptyString(originalHost)) {
      return false;
    }
    final int originalHostLength = originalHost.length();
    String host;
    try {
      // Use IDN for all host names, if the host is all ASCII, it returns unchanged.
      // It comes with an added benefit of checking host length to be between 1 and 63 characters.
      host = IDN.toASCII(originalHost, IDN.ALLOW_UNASSIGNED);
      // toASCII can throw IndexOutOfBoundsException when the domain name is longer than
      // 256 characters, instead of the documented IllegalArgumentException.
    } catch (IllegalArgumentException | IndexOutOfBoundsException e) {
      return false;
    }
    final int punycodeEncodedHostLength = host.length();
    if (punycodeEncodedHostLength == 0) {
      return false;
    }
    // The punycodeEncoded host length might be different now, offset that length from the URL.
    final int urlLength = originalUrlLength + punycodeEncodedHostLength - originalHostLength;
    // Add the protocol to our length check, if there isn't one,
    // to ensure it doesn't go over the limit.
    final int urlLengthWithProtocol =
        urlLength + (protocol == null ? URL_GROUP_PROTOCOL_LENGTH : 0);
    return urlLengthWithProtocol <= MAX_URL_LENGTH;
  }

  /**
   * Extract #hashtag references from Tweet text.
   *
   * @param text of the tweet from which to extract hashtags
   * @return List of hashtags referenced (without the leading # sign)
   */
  public List<String> extractHashtags(String text) {
    if (isEmptyString(text)) {
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
    return extractHashtagsWithIndices(text, true);
  }

  /**
   * Extract #hashtag references from Tweet text.
   *
   * @param text of the tweet from which to extract hashtags
   * @param checkUrlOverlap if true, check if extracted hashtags overlap URLs and
   * remove overlapping ones
   * @return List of hashtags referenced (without the leading # sign)
   */
  private List<Entity> extractHashtagsWithIndices(String text, boolean checkUrlOverlap) {
    if (isEmptyString(text)) {
      return Collections.emptyList();
    }

    // Performance optimization.
    // If text doesn't contain #/＃ at all, text doesn't contain
    // hashtag, so we can simply return an empty list.
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

    if (checkUrlOverlap) {
      // extract URLs
      List<Entity> urls = extractURLsWithIndices(text);
      if (!urls.isEmpty()) {
        extracted.addAll(urls);
        // remove overlap
        removeOverlappingEntities(extracted);
        // remove URL entities
        Iterator<Entity> it = extracted.iterator();
        while (it.hasNext()) {
          Entity entity = it.next();
          if (entity.getType() != Entity.Type.HASHTAG) {
            it.remove();
          }
        }
      }
    }

    return extracted;
  }

  /**
   * Extract $cashtag references from Tweet text.
   *
   * @param text of the tweet from which to extract cashtags
   * @return List of cashtags referenced (without the leading $ sign)
   */
  public List<String> extractCashtags(String text) {
    if (isEmptyString(text)) {
      return Collections.emptyList();
    }

    List<String> extracted = new ArrayList<String>();
    for (Entity entity : extractCashtagsWithIndices(text)) {
      extracted.add(entity.value);
    }

    return extracted;
  }

  /**
   * Extract $cashtag references from Tweet text.
   *
   * @param text of the tweet from which to extract cashtags
   * @return List of cashtags referenced (without the leading $ sign)
   */
  public List<Entity> extractCashtagsWithIndices(String text) {
    if (isEmptyString(text)) {
      return Collections.emptyList();
    }

    // Performance optimization.
    // If text doesn't contain $, text doesn't contain
    // cashtag, so we can simply return an empty list.
    if (text.indexOf('$') == -1) {
      return Collections.emptyList();

    }

    List<Entity> extracted = new ArrayList<Entity>();
    Matcher matcher = Regex.VALID_CASHTAG.matcher(text);

    while (matcher.find()) {
      extracted.add(new Entity(matcher, Entity.Type.CASHTAG, Regex.VALID_CASHTAG_GROUP_CASHTAG));
    }

    return extracted;
  }

  public void setExtractURLWithoutProtocol(boolean extractURLWithoutProtocol) {
    this.extractURLWithoutProtocol = extractURLWithoutProtocol;
  }

  public boolean isExtractURLWithoutProtocol() {
    return extractURLWithoutProtocol;
  }

  /**
   * Modify Unicode-based indices of the entities to UTF-16 based indices.
   * <p>
   * In UTF-16 based indices, Unicode supplementary characters are counted as two characters.
   * <p>
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

  /**
   * Modify UTF-16-based indices of the entities to Unicode-based indices.
   * <p>
   * In Unicode-based indices, Unicode supplementary characters are counted as single characters.
   * <p>
   * This method requires that the list of entities be in ascending order by start index.
   *
   * @param text original text
   * @param entities entities with UTF-16 based indices
   */
  public void modifyIndicesFromUTF16ToUnicode(String text, List<Entity> entities) {
    IndexConverter convert = new IndexConverter(text);

    for (Entity entity : entities) {
      entity.start = convert.codeUnitsToCodePoints(entity.start);
      entity.end = convert.codeUnitsToCodePoints(entity.end);
    }
  }

  private static boolean isEmptyString(@Nullable CharSequence string) {
    return string == null || string.length() == 0;
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
     * Converts code units to code points
     *
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
     * Converts code points to code units
     *
     * @param codePointIndex Index into the string measured in code points.
     * @return the code unit index that corresponds to the specified code point index.
     */
    int codePointsToCodeUnits(int codePointIndex) {
      // Note that offsetByCodePoints accepts negative indices.
      this.charIndex =
          text.offsetByCodePoints(this.charIndex, codePointIndex - this.codePointIndex);
      this.codePointIndex = codePointIndex;
      return this.charIndex;
    }
  }
}
