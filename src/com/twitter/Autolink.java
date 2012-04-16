package com.twitter;

import com.twitter.Extractor.Entity;

import java.util.List;

/**
 * A class for adding HTML links to hashtag, username and list references in Tweet text.
 */
public class Autolink {
  /** Default CSS class for auto-linked URLs */
  public static final String DEFAULT_URL_CLASS = "tweet-url";
  /** Default CSS class for auto-linked list URLs */
  public static final String DEFAULT_LIST_CLASS = "list-slug";
  /** Default CSS class for auto-linked username URLs */
  public static final String DEFAULT_USERNAME_CLASS = "username";
  /** Default CSS class for auto-linked hashtag URLs */
  public static final String DEFAULT_HASHTAG_CLASS = "hashtag";
  /** Default href for username links (the username without the @ will be appended) */
  public static final String DEFAULT_USERNAME_URL_BASE = "https://twitter.com/";
  /** Default href for list links (the username/list without the @ will be appended) */
  public static final String DEFAULT_LIST_URL_BASE = "https://twitter.com/";
  /** Default href for hashtag links (the hashtag without the # will be appended) */
  public static final String DEFAULT_HASHTAG_URL_BASE = "https://twitter.com/#!/search?q=%23";
  /** HTML attribute to add when noFollow is true (default) */
  public static final String NO_FOLLOW_HTML_ATTRIBUTE = " rel=\"nofollow\"";
  /** Default attribute for invisible span tag */
  public static final String DEFAULT_INVISIBLE_TAG_ATTRS = "style='position:absolute;left:-9999px;'";

  protected String urlClass;
  protected String listClass;
  protected String usernameClass;
  protected String hashtagClass;
  protected String usernameUrlBase;
  protected String listUrlBase;
  protected String hashtagUrlBase;
  protected String invisibleTagAttrs;
  protected boolean noFollow = true;
  protected boolean usernameIncludeSymbol = false;

  private Extractor extractor = new Extractor();

  private static CharSequence escapeHTML(String text) {
    StringBuilder builder = new StringBuilder(text.length() * 2);
    for (char c : text.toCharArray()) {
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
    urlClass = DEFAULT_URL_CLASS;
    listClass = DEFAULT_LIST_CLASS;
    usernameClass = DEFAULT_USERNAME_CLASS;
    hashtagClass = DEFAULT_HASHTAG_CLASS;
    usernameUrlBase = DEFAULT_USERNAME_URL_BASE;
    listUrlBase = DEFAULT_LIST_URL_BASE;
    hashtagUrlBase = DEFAULT_HASHTAG_URL_BASE;
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

  public void linkToHashtag(Entity entity, String text, StringBuilder builder) {
    // Get the original hash char from text as it could be a full-width char.
    CharSequence hashChar = text.subSequence(entity.getStart(), entity.getStart() + 1);

    builder.append("<a href=\"").append(hashtagUrlBase).append(entity.getValue()).append("\"");
    builder.append(" title=\"#").append(entity.getValue()).append("\"");
    builder.append(" class=\"").append(urlClass).append(" ").append(hashtagClass).append("\"");
    if (noFollow) {
      builder.append(NO_FOLLOW_HTML_ATTRIBUTE);
    }
    builder.append(">");
    builder.append(hashChar);
    builder.append(entity.getValue()).append("</a>");
  }

  public void linkToMentionAndList(Entity entity, String text, StringBuilder builder) {
    String mention = entity.getValue();
    // Get the original at char from text as it could be a full-width char.
    CharSequence atChar = text.subSequence(entity.getStart(), entity.getStart() + 1);

    if (!usernameIncludeSymbol) {
      builder.append(atChar);
    }
    builder.append("<a class=\"").append(urlClass).append(" ");
    if (entity.listSlug != null) {
      // this is list
      builder.append(listClass).append("\" href=\"").append(listUrlBase);
      mention += entity.listSlug;
    } else {
      // this is @mention
      builder.append(usernameClass).append("\" href=\"").append(usernameUrlBase);
    }
    builder.append(mention).append("\"");
    if (noFollow){
      builder.append(NO_FOLLOW_HTML_ATTRIBUTE);
    }
    builder.append(">");
    if (usernameIncludeSymbol) {
      builder.append(atChar);
    }
    builder.append(mention).append("</a>");
  }

  public void linkToURL(Entity entity, String text, StringBuilder builder) {
    CharSequence url = escapeHTML(entity.getValue());
    CharSequence linkText = url;

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

    builder.append("<a href=\"").append(url).append("\"");
    if (noFollow){
      builder.append(NO_FOLLOW_HTML_ATTRIBUTE);
    }
    builder.append(">").append(linkText).append("</a>");
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
}
