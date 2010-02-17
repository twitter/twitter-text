
package com.twitter;

import java.util.*;
import java.util.regex.*;

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
  public static final String DEFAULT_HASHTAG_URL_BASE = "http://twitter.com/search?q=%23";
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

  public Autolink() {
    urlClass = DEFAULT_URL_CLASS;
    listClass = DEFAULT_LIST_CLASS;
    usernameClass = DEFAULT_USERNAME_CLASS;
    hashtagClass = DEFAULT_HASHTAG_CLASS;
    usernameUrlBase = DEFAULT_USERNAME_URL_BASE;
    listUrlBase = DEFAULT_LIST_URL_BASE;
    hashtagUrlBase = DEFAULT_HASHTAG_URL_BASE;
  }

  /**
   * Auto-link hashtags, URLs, usernames and lists.
   *
   * @param text of the Tweet to auto-link
   * @return text with auto-link HTML added
   */
  public String autoLink(String text) {
    return autoLinkUsernamesAndLists( autoLinkURLs( autoLinkHashtags(text) ) );
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
    Matcher matcher = Regex.AUTO_LINK_USERNAMES_OR_LISTS.matcher(text);
    StringBuffer sb = new StringBuffer(text.length());
    while (matcher.find()) {
      StringBuffer replacement = new StringBuffer();
      if (matcher.group(Regex.AUTO_LINK_USERNAME_OR_LISTS_GROUP_LIST) == null ||
          matcher.group(Regex.AUTO_LINK_USERNAME_OR_LISTS_GROUP_LIST).equals("")) {
        // Username only
        replacement.append("$").append(Regex.AUTO_LINK_USERNAME_OR_LISTS_GROUP_BEFORE)
                   .append("$").append(Regex.AUTO_LINK_USERNAME_OR_LISTS_GROUP_AT)
                   .append("<a")
                   .append(" class=\"").append(urlClass).append(" ").append(usernameClass).append("\"")
                   .append(" href=\"").append(usernameUrlBase).append("$").append(Regex.AUTO_LINK_USERNAME_OR_LISTS_GROUP_USERNAME).append("\"");
        if (noFollow) {
          replacement.append(NO_FOLLOW_HTML_ATTRIBUTE);
        }
        replacement.append(">$").append(Regex.AUTO_LINK_USERNAME_OR_LISTS_GROUP_USERNAME).append("</a>");
      } else {
        // Username and list
        replacement.append("$").append(Regex.AUTO_LINK_USERNAME_OR_LISTS_GROUP_BEFORE)
                   .append("$").append(Regex.AUTO_LINK_USERNAME_OR_LISTS_GROUP_AT)
                   .append("<a")
                   .append(" class=\"").append(urlClass).append(" ").append(listClass).append("\"")
                   .append(" href=\"").append(listUrlBase).append("$").append(Regex.AUTO_LINK_USERNAME_OR_LISTS_GROUP_USERNAME)
                   .append("$").append(Regex.AUTO_LINK_USERNAME_OR_LISTS_GROUP_LIST).append("\"");
        if (noFollow) {
          replacement.append(NO_FOLLOW_HTML_ATTRIBUTE);
        }
        replacement.append(">$").append(Regex.AUTO_LINK_USERNAME_OR_LISTS_GROUP_USERNAME)
                   .append("$").append(Regex.AUTO_LINK_USERNAME_OR_LISTS_GROUP_LIST).append("</a>");
      }
      matcher.appendReplacement(sb, replacement.toString());
    }
    matcher.appendTail(sb);
    return sb.toString();
  }

  /**
   * Auto-link #hashtag references in the provided Tweet text. The #hashtag links will have the hashtagClass CSS class
   * added.
   *
   * @param text of the Tweet to auto-link
   * @return text with auto-link HTML added
   */
  public String autoLinkHashtags(String text) {
    StringBuffer replacement = new StringBuffer(text.length());
    replacement.append("$").append(Regex.AUTO_LINK_HASHTAGS_GROUP_BEFORE)
               .append("<a")
               .append(" href=\"").append(hashtagUrlBase).append("$").append(Regex.AUTO_LINK_HASHTAGS_GROUP_TAG).append("\"")
               .append(" title=\"#$").append(Regex.AUTO_LINK_HASHTAGS_GROUP_TAG).append("\"")
               .append(" class=\"").append(urlClass).append(" ").append(hashtagClass).append("\"");
    if (noFollow) {
      replacement.append(NO_FOLLOW_HTML_ATTRIBUTE);
    }
    replacement.append(">$").append(Regex.AUTO_LINK_HASHTAGS_GROUP_HASH).append("$")
               .append(Regex.AUTO_LINK_HASHTAGS_GROUP_TAG).append("</a>");
    return Regex.AUTO_LINK_HASHTAGS.matcher(text).replaceAll(replacement.toString());
  }

  /**
   * Auto-link URLs in the Tweet text provided.
   *
   * @param text of the Tweet to auto-link
   * @return text with auto-link HTML added
   */
  public String autoLinkURLs(String text) {
    Matcher matcher = Regex.VALID_URL.matcher(text);
    StringBuffer sb = new StringBuffer(text.length());
    while (matcher.find()) {
      StringBuffer replacement = new StringBuffer(text.length());
      if (matcher.group(Regex.VALID_URL_GROUP_URL).startsWith("http://") ||
          matcher.group(Regex.VALID_URL_GROUP_URL).startsWith("https://")) {
        replacement.append("$").append(Regex.VALID_URL_GROUP_BEFORE)
                   .append("<a href=\"$").append(Regex.VALID_URL_GROUP_URL).append("\"");
        if (noFollow) {
          replacement.append(NO_FOLLOW_HTML_ATTRIBUTE);
        }
        replacement.append(">$")
                   .append(Regex.VALID_URL_GROUP_URL).append("</a>");
      } else {
        replacement.append("$").append(Regex.VALID_URL_GROUP_BEFORE)
                   .append("<a href=\"http://$").append(Regex.VALID_URL_GROUP_URL).append("\"");
        if (noFollow) {
          replacement.append(NO_FOLLOW_HTML_ATTRIBUTE);
        }
        replacement.append(">$")
                   .append(Regex.VALID_URL_GROUP_URL).append("</a>");
      }
      matcher.appendReplacement(sb, replacement.toString());
    }
    matcher.appendTail(sb);
    return sb.toString();
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
}
