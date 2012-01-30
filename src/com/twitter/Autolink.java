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
  public static final String DEFAULT_USERNAME_URL_BASE = "http://twitter.com/";
  /** Default href for list links (the username/list without the @ will be appended) */
  public static final String DEFAULT_LIST_URL_BASE = "http://twitter.com/";
  /** Default href for hashtag links (the hashtag without the # will be appended) */
  public static final String DEFAULT_HASHTAG_URL_BASE = "http://twitter.com/#!/search?q=%23";
  /** HTML attribute to add when noFollow is true (default) */
  public static final String NO_FOLLOW_HTML_ATTRIBUTE = " rel=\"nofollow\"";

  protected String urlClass;
  protected String listClass;
  protected String usernameClass;
  protected String hashtagClass;
  protected String usernameUrlBase;
  protected String listUrlBase;
  protected String hashtagUrlBase;
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

  private String autoLinkEntities(String text, List<Entity> entities) {
    StringBuilder builder = new StringBuilder(text.length());
    int beginIndex = 0;

    for (Entity entity : entities) {
      builder.append(text.subSequence(beginIndex, entity.start));
      StringBuilder replaceStr = new StringBuilder(text.length());

      switch(entity.type) {
        case URL:
          CharSequence url = escapeHTML(entity.getValue());
          replaceStr.append("<a href=\"").append(url).append("\"");
          if (noFollow){
            replaceStr.append(NO_FOLLOW_HTML_ATTRIBUTE);
          }
          replaceStr.append(">").append(url).append("</a>");
          break;
        case HASHTAG:
          replaceStr.append("<a href=\"").append(hashtagUrlBase)
                    .append(entity.getValue()).append("\"")
                    .append(" title=\"#")
                    .append(entity.getValue())
                    .append("\" class=\"").append(urlClass).append(" ")
                    .append(hashtagClass).append("\"");
          if (noFollow) {
            replaceStr.append(NO_FOLLOW_HTML_ATTRIBUTE);
          }
          replaceStr.append(">")
                    .append(text.subSequence(entity.getStart(), entity.getStart() + 1))
                    .append(entity.getValue()).append("</a>");
          break;
        case MENTION:
          CharSequence at = text.subSequence(entity.getStart(), entity.getStart() + 1);
          String mention = entity.getValue();
          if (!usernameIncludeSymbol) {
            replaceStr.append(at);
          }
          replaceStr.append("<a class=\"").append(urlClass).append(" ");
          if (entity.listSlug != null) {
            // this is list
            replaceStr.append(listClass).append("\" href=\"").append(listUrlBase);
            mention += entity.listSlug;
          } else {
            // this is @mention
            replaceStr.append(usernameClass).append("\" href=\"").append(usernameUrlBase);
          }
          replaceStr.append(mention).append("\"");
          if (noFollow){
            replaceStr.append(NO_FOLLOW_HTML_ATTRIBUTE);
          }
          replaceStr.append(">");
          if (usernameIncludeSymbol) {
            replaceStr.append(at);
          }
          replaceStr.append(mention).append("</a>");
     }
      builder.append(replaceStr);
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
