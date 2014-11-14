package com.twitter;

import com.twitter.Extractor.Entity;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * A class for adding HTML links to hashtag, username and list references in Tweet text.
 */
public class Autolink {
  /** Default CSS class for auto-linked list URLs */
  public static final String DEFAULT_LIST_CLASS = "tweet-url list-slug";
  /** Default CSS class for auto-linked username URLs */
  public static final String DEFAULT_USERNAME_CLASS = "tweet-url username";
  /** Default CSS class for auto-linked hashtag URLs */
  public static final String DEFAULT_HASHTAG_CLASS = "tweet-url hashtag";
  /** Default CSS class for auto-linked cashtag URLs */
  public static final String DEFAULT_CASHTAG_CLASS = "tweet-url cashtag";
  /** Default href for username links (the username without the @ will be appended) */
  public static final String DEFAULT_USERNAME_URL_BASE = "https://twitter.com/";
  /** Default href for list links (the username/list without the @ will be appended) */
  public static final String DEFAULT_LIST_URL_BASE = "https://twitter.com/";
  /** Default href for hashtag links (the hashtag without the # will be appended) */
  public static final String DEFAULT_HASHTAG_URL_BASE = "https://twitter.com/#!/search?q=%23";
  /** Default href for cashtag links (the cashtag without the $ will be appended) */
  public static final String DEFAULT_CASHTAG_URL_BASE = "https://twitter.com/#!/search?q=%24";
  /** Default attribute for invisible span tag */
  public static final String DEFAULT_INVISIBLE_TAG_ATTRS = "style='position:absolute;left:-9999px;'";

  public static interface LinkAttributeModifier {
    public void modify(Entity entity, Map<String, String> attributes);
  };

  public static interface LinkTextModifier {
    public CharSequence modify(Entity entity, CharSequence text);
  }

  protected String urlClass = null;
  protected String listClass;
  protected String usernameClass;
  protected String hashtagClass;
  protected String cashtagClass;
  protected String usernameUrlBase;
  protected String listUrlBase;
  protected String hashtagUrlBase;
  protected String cashtagUrlBase;
  protected String invisibleTagAttrs;
  protected boolean noFollow = true;
  protected boolean usernameIncludeSymbol = false;
  protected String symbolTag = null;
  protected String textWithSymbolTag = null;
  protected String urlTarget = null;
  protected LinkAttributeModifier linkAttributeModifier = null;
  protected LinkTextModifier linkTextModifier = null;

  private Extractor extractor = new Extractor();

  private static CharSequence escapeHTML(CharSequence text) {
    StringBuilder builder = new StringBuilder(text.length() * 2);
    for (int i = 0; i < text.length(); i++) {
      char c = text.charAt(i);
      switch(c) {
        case '&': builder.append("&amp;"); break;
        case '>': builder.append("&gt;"); break;
        case '<': builder.append("&lt;"); break;
        case '"': builder.append("&quot;"); break;
        case '\'': builder.append("&#39;"); break;
        default: builder.append(c); break;
      }
    }
    return builder;
  }

  public Autolink() {
    urlClass = null;
    listClass = DEFAULT_LIST_CLASS;
    usernameClass = DEFAULT_USERNAME_CLASS;
    hashtagClass = DEFAULT_HASHTAG_CLASS;
    cashtagClass = DEFAULT_CASHTAG_CLASS;
    usernameUrlBase = DEFAULT_USERNAME_URL_BASE;
    listUrlBase = DEFAULT_LIST_URL_BASE;
    hashtagUrlBase = DEFAULT_HASHTAG_URL_BASE;
    cashtagUrlBase = DEFAULT_CASHTAG_URL_BASE;
    invisibleTagAttrs = DEFAULT_INVISIBLE_TAG_ATTRS;

    extractor.setExtractURLWithoutProtocol(false);
  }

  public String escapeBrackets(String text) {
    int len = text.length();
    if (len == 0)
      return text;

    StringBuilder sb = new StringBuilder(len + 16);
    for (int i = 0; i < len; ++i) {
      char c = text.charAt(i);
      if (c == '>')
        sb.append("&gt;");
      else if (c == '<')
        sb.append("&lt;");
      else
        sb.append(c);
    }
    return sb.toString();
  }

  public void linkToText(Entity entity, CharSequence text, Map<String, String> attributes, StringBuilder builder) {
    if (noFollow) {
      attributes.put("rel", "nofollow");
    }
    if (linkAttributeModifier != null) {
      linkAttributeModifier.modify(entity, attributes);
    }
    if (linkTextModifier != null) {
      text = linkTextModifier.modify(entity, text);
    }
    // append <a> tag
    builder.append("<a");
    for (Map.Entry<String, String> entry : attributes.entrySet()) {
      builder.append(" ").append(escapeHTML(entry.getKey())).append("=\"").append(escapeHTML(entry.getValue())).append("\"");
    }
    builder.append(">").append(text).append("</a>");
  }

  public void linkToTextWithSymbol(Entity entity, CharSequence symbol, CharSequence text, Map<String, String> attributes, StringBuilder builder) {
    CharSequence taggedSymbol = symbolTag == null || symbolTag.length() == 0 ? symbol : String.format("<%s>%s</%s>", symbolTag, symbol, symbolTag);
    text = escapeHTML(text);
    CharSequence taggedText = textWithSymbolTag == null || textWithSymbolTag.length() == 0 ? text : String.format("<%s>%s</%s>", textWithSymbolTag, text, textWithSymbolTag);

    boolean includeSymbol = usernameIncludeSymbol || !Regex.AT_SIGNS.matcher(symbol).matches();

    if (includeSymbol) {
      linkToText(entity, taggedSymbol.toString() + taggedText, attributes, builder);
    } else {
      builder.append(taggedSymbol);
      linkToText(entity, taggedText, attributes, builder);
    }
  }

  public void linkToHashtag(Entity entity, String text, StringBuilder builder) {
    // Get the original hash char from text as it could be a full-width char.
    CharSequence hashChar = text.subSequence(entity.getStart(), entity.getStart() + 1);
    CharSequence hashtag = entity.getValue();

    Map<String, String> attrs = new LinkedHashMap<String, String>();
    attrs.put("href", hashtagUrlBase + hashtag);
    attrs.put("title", "#" + hashtag);

    if (Regex.RTL_CHARACTERS.matcher(text).find()) {
      attrs.put("class", hashtagClass + " rtl");
    } else {
      attrs.put("class", hashtagClass);
    }

    linkToTextWithSymbol(entity, hashChar, hashtag, attrs, builder);
  }

  public void linkToCashtag(Entity entity, String text, StringBuilder builder) {
    CharSequence cashtag = entity.getValue();

    Map<String, String> attrs = new LinkedHashMap<String, String>();
    attrs.put("href", cashtagUrlBase + cashtag);
    attrs.put("title", "$" + cashtag);
    attrs.put("class", cashtagClass);

    linkToTextWithSymbol(entity, "$", cashtag, attrs, builder);
  }

  public void linkToMentionAndList(Entity entity, String text, StringBuilder builder) {
    String mention = entity.getValue();
    // Get the original at char from text as it could be a full-width char.
    CharSequence atChar = text.subSequence(entity.getStart(), entity.getStart() + 1);

    Map<String, String> attrs = new LinkedHashMap<String, String>();
    if (entity.listSlug != null) {
      mention += entity.listSlug;
      attrs.put("class", listClass);
      attrs.put("href", listUrlBase + mention);
    } else {
      attrs.put("class", usernameClass);
      attrs.put("href", usernameUrlBase + mention);
    }

    linkToTextWithSymbol(entity, atChar, mention, attrs, builder);
  }

  public void linkToURL(Entity entity, String text, StringBuilder builder) {
    CharSequence url = entity.getValue();
    CharSequence linkText = escapeHTML(url);

    if (entity.displayURL != null && entity.expandedURL != null) {
      // Goal: If a user copies and pastes a tweet containing t.co'ed link, the resulting paste
      // should contain the full original URL (expanded_url), not the display URL.
      //
      // Method: Whenever possible, we actually emit HTML that contains expanded_url, and use
      // font-size:0 to hide those parts that should not be displayed (because they are not part of display_url).
      // Elements with font-size:0 get copied even though they are not visible.
      // Note that display:none doesn't work here. Elements with display:none don't get copied.
      //
      // Additionally, we want to *display* ellipses, but we don't want them copied.  To make this happen we
      // wrap the ellipses in a tco-ellipsis class and provide an onCopy handler that sets display:none on
      // everything with the tco-ellipsis class.
      //
      // As an example: The user tweets "hi http://longdomainname.com/foo"
      // This gets shortened to "hi http://t.co/xyzabc", with display_url = "…nname.com/foo"
      // This will get rendered as:
      // <span class='tco-ellipsis'> <!-- This stuff should get displayed but not copied -->
      //   …
      //   <!-- There's a chance the onCopy event handler might not fire. In case that happens,
      //        we include an &nbsp; here so that the … doesn't bump up against the URL and ruin it.
      //        The &nbsp; is inside the tco-ellipsis span so that when the onCopy handler *does*
      //        fire, it doesn't get copied.  Otherwise the copied text would have two spaces in a row,
      //        e.g. "hi  http://longdomainname.com/foo".
      //   <span style='font-size:0'>&nbsp;</span>
      // </span>
      // <span style='font-size:0'>  <!-- This stuff should get copied but not displayed -->
      //   http://longdomai
      // </span>
      // <span class='js-display-url'> <!-- This stuff should get displayed *and* copied -->
      //   nname.com/foo
      // </span>
      // <span class='tco-ellipsis'> <!-- This stuff should get displayed but not copied -->
      //   <span style='font-size:0'>&nbsp;</span>
      //   …
      // </span>
      //
      // Exception: pic.twitter.com images, for which expandedUrl = "https://twitter.com/#!/username/status/1234/photo/1
      // For those URLs, display_url is not a substring of expanded_url, so we don't do anything special to render the elided parts.
      // For a pic.twitter.com URL, the only elided part will be the "https://", so this is fine.
      String displayURLSansEllipses = entity.displayURL.replace("…", "");
      int diplayURLIndexInExpandedURL = entity.expandedURL.indexOf(displayURLSansEllipses);
      if (diplayURLIndexInExpandedURL != -1) {
        String beforeDisplayURL = entity.expandedURL.substring(0, diplayURLIndexInExpandedURL);
        String afterDisplayURL = entity.expandedURL.substring(diplayURLIndexInExpandedURL + displayURLSansEllipses.length());
        String precedingEllipsis = entity.displayURL.startsWith("…") ? "…" : "";
        String followingEllipsis = entity.displayURL.endsWith("…") ? "…" : "";
        String invisibleSpan = "<span " + invisibleTagAttrs + ">";

        StringBuilder sb = new StringBuilder("<span class='tco-ellipsis'>");
        sb.append(precedingEllipsis);
        sb.append(invisibleSpan).append("&nbsp;</span></span>");
        sb.append(invisibleSpan).append(escapeHTML(beforeDisplayURL)).append("</span>");
        sb.append("<span class='js-display-url'>").append(escapeHTML(displayURLSansEllipses)).append("</span>");
        sb.append(invisibleSpan).append(escapeHTML(afterDisplayURL)).append("</span>");
        sb.append("<span class='tco-ellipsis'>").append(invisibleSpan).append("&nbsp;</span>").append(followingEllipsis).append("</span>");

        linkText = sb;
      } else {
        linkText = entity.displayURL;
      }
    }

    Map<String, String> attrs = new LinkedHashMap<String, String>();
    attrs.put("href", url.toString());
    if (urlClass != null) {
      attrs.put("class", urlClass);
    }
    if (urlClass != null && urlClass.length() != 0) {
      attrs.put("class", urlClass);
    }
    if (urlTarget != null && urlTarget.length() != 0) {
      attrs.put("target", urlTarget);
    }
    linkToText(entity, linkText, attrs, builder);
  }

  public String autoLinkEntities(String text, List<Entity> entities) {
    StringBuilder builder = new StringBuilder(text.length() * 2);
    int beginIndex = 0;

    for (Entity entity : entities) {
      builder.append(text.subSequence(beginIndex, entity.start));

      switch(entity.type) {
        case URL:
          linkToURL(entity, text, builder);
          break;
        case HASHTAG:
          linkToHashtag(entity, text, builder);
          break;
        case MENTION:
          linkToMentionAndList(entity, text, builder);
          break;
        case CASHTAG:
          linkToCashtag(entity, text, builder);
          break;
     }
      beginIndex = entity.end;
    }
    builder.append(text.subSequence(beginIndex, text.length()));

    return builder.toString();
  }

  /**
   * Auto-link hashtags, URLs, usernames and lists.
   *
   * @param text of the Tweet to auto-link
   * @return text with auto-link HTML added
   */
  public String autoLink(String text) {
    text = escapeBrackets(text);

    // extract entities
    List<Entity> entities = extractor.extractEntitiesWithIndices(text);
    return autoLinkEntities(text, entities);
  }

  /**
   * Auto-link the @username and @username/list references in the provided text. Links to @username references will
   * have the usernameClass CSS classes added. Links to @username/list references will have the listClass CSS class
   * added.
   *
   * @param text of the Tweet to auto-link
   * @return text with auto-link HTML added
   */
  public String autoLinkUsernamesAndLists(String text) {
    return autoLinkEntities(text, extractor.extractMentionsOrListsWithIndices(text));
  }

  /**
   * Auto-link #hashtag references in the provided Tweet text. The #hashtag links will have the hashtagClass CSS class
   * added.
   *
   * @param text of the Tweet to auto-link
   * @return text with auto-link HTML added
   */
  public String autoLinkHashtags(String text) {
    return autoLinkEntities(text, extractor.extractHashtagsWithIndices(text));
  }

  /**
   * Auto-link URLs in the Tweet text provided.
   * <p/>
   * This only auto-links URLs with protocol.
   *
   * @param text of the Tweet to auto-link
   * @return text with auto-link HTML added
   */
  public String autoLinkURLs(String text) {
    return autoLinkEntities(text, extractor.extractURLsWithIndices(text));
  }

  /**
   * Auto-link $cashtag references in the provided Tweet text. The $cashtag links will have the cashtagClass CSS class
   * added.
   *
   * @param text of the Tweet to auto-link
   * @return text with auto-link HTML added
   */
  public String autoLinkCashtags(String text) {
    return autoLinkEntities(text, extractor.extractCashtagsWithIndices(text));
  }

  /**
   * @return CSS class for auto-linked URLs
   */
  public String getUrlClass() {
    return urlClass;
  }

  /**
   * Set the CSS class for auto-linked URLs
   *
   * @param urlClass new CSS value.
   */
  public void setUrlClass(String urlClass) {
    this.urlClass = urlClass;
  }

  /**
   * @return CSS class for auto-linked list URLs
   */
  public String getListClass() {
    return listClass;
  }

  /**
   * Set the CSS class for auto-linked list URLs
   *
   * @param listClass new CSS value.
   */
  public void setListClass(String listClass) {
    this.listClass = listClass;
  }

  /**
   * @return CSS class for auto-linked username URLs
   */
  public String getUsernameClass() {
    return usernameClass;
  }

  /**
   * Set the CSS class for auto-linked username URLs
   *
   * @param usernameClass new CSS value.
   */
  public void setUsernameClass(String usernameClass) {
    this.usernameClass = usernameClass;
  }

  /**
   * @return CSS class for auto-linked hashtag URLs
   */
  public String getHashtagClass() {
    return hashtagClass;
  }

  /**
   * Set the CSS class for auto-linked hashtag URLs
   *
   * @param hashtagClass new CSS value.
   */
  public void setHashtagClass(String hashtagClass) {
    this.hashtagClass = hashtagClass;
  }

  /**
   * @return CSS class for auto-linked cashtag URLs
   */
  public String getCashtagClass() {
    return cashtagClass;
  }

  /**
   * Set the CSS class for auto-linked cashtag URLs
   *
   * @param cashtagClass new CSS value.
   */
  public void setCashtagClass(String cashtagClass) {
    this.cashtagClass = cashtagClass;
  }

  /**
   * @return the href value for username links (to which the username will be appended)
   */
  public String getUsernameUrlBase() {
    return usernameUrlBase;
  }

  /**
   * Set the href base for username links.
   *
   * @param usernameUrlBase new href base value
   */
  public void setUsernameUrlBase(String usernameUrlBase) {
    this.usernameUrlBase = usernameUrlBase;
  }

  /**
   * @return the href value for list links (to which the username/list will be appended)
   */
  public String getListUrlBase() {
    return listUrlBase;
  }

  /**
   * Set the href base for list links.
   *
   * @param listUrlBase new href base value
   */
  public void setListUrlBase(String listUrlBase) {
    this.listUrlBase = listUrlBase;
  }

  /**
   * @return the href value for hashtag links (to which the hashtag will be appended)
   */
  public String getHashtagUrlBase() {
    return hashtagUrlBase;
  }

  /**
   * Set the href base for hashtag links.
   *
   * @param hashtagUrlBase new href base value
   */
  public void setHashtagUrlBase(String hashtagUrlBase) {
    this.hashtagUrlBase = hashtagUrlBase;
  }

  /**
   * @return the href value for cashtag links (to which the cashtag will be appended)
   */
  public String getCashtagUrlBase() {
    return cashtagUrlBase;
  }

  /**
   * Set the href base for cashtag links.
   *
   * @param cashtagUrlBase new href base value
   */
  public void setCashtagUrlBase(String cashtagUrlBase) {
    this.cashtagUrlBase = cashtagUrlBase;
  }

  /**
   * @return if the current URL links will include rel="nofollow" (true by default)
   */
  public boolean isNoFollow() {
    return noFollow;
  }

  /**
   * Set if the current URL links will include rel="nofollow" (true by default)
   *
   * @param noFollow new noFollow value
   */
  public void setNoFollow(boolean noFollow) {
    this.noFollow = noFollow;
  }

  /**
   * Set if the at mark '@' should be included in the link (false by default)
   *
   * @param noFollow new noFollow value
   */
  public void setUsernameIncludeSymbol(boolean usernameIncludeSymbol) {
    this.usernameIncludeSymbol = usernameIncludeSymbol;
  }

  /**
   * Set HTML tag to be applied around #/@/# symbols in hashtags/usernames/lists/cashtag
   *
   * @param tag HTML tag without bracket. e.g., "b" or "s"
   */
  public void setSymbolTag(String tag) {
    this.symbolTag = tag;
  }

  /**
   * Set HTML tag to be applied around text part of hashtags/usernames/lists/cashtag
   *
   * @param tag HTML tag without bracket. e.g., "b" or "s"
   */
  public void setTextWithSymbolTag(String tag) {
    this.textWithSymbolTag = tag;
  }

  /**
   * Set the value of the target attribute in auto-linked URLs
   *
   * @param target target value e.g., "_blank"
   */
  public void setUrlTarget(String target) {
    this.urlTarget = target;
  }

  /**
   * Set a modifier to modify attributes of a link based on an entity
   *
   * @param modifier LinkAttributeModifier instance
   */
  public void setLinkAttributeModifier(LinkAttributeModifier modifier) {
    this.linkAttributeModifier = modifier;
  }

  /**
   * Set a modifier to modify text of a link based on an entity
   *
   * @param modifier LinkTextModifier instance
   */
  public void setLinkTextModifier(LinkTextModifier modifier) {
    this.linkTextModifier = modifier;
  }
}
