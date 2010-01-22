
package com.twitter;

import java.util.*;
import java.util.regex.*;

public class Autolink {
  public static final String DEFAULT_URL_CLASS = "tweet-url";
  public static final String DEFAULT_LIST_CLASS = "list-slug";
  public static final String DEFAULT_USERNAME_CLASS = "username";
  public static final String DEFAULT_HASHTAG_CLASS = "hashtag";
  public static final String DEFAULT_USERNAME_URL_BASE = "http://twitter.com/";
  public static final String DEFAULT_LIST_URL_BASE = "http://twitter.com/";
  public static final String DEFAULT_HASHTAG_URL_BASE = "http://twitter.com/search?q=%23";

  protected String urlClass;
  protected String listClass;
  protected String usernameClass;
  protected String hashtagClass;
  protected String usernameUrlBase;
  protected String listUrlBase;
  protected String hashtagUrlBase;

  public Autolink() {
    urlClass = DEFAULT_URL_CLASS;
    listClass = DEFAULT_LIST_CLASS;
    usernameClass = DEFAULT_USERNAME_CLASS;
    hashtagClass = DEFAULT_HASHTAG_CLASS;
    usernameUrlBase = DEFAULT_USERNAME_URL_BASE;
    listUrlBase = DEFAULT_LIST_URL_BASE;
    hashtagUrlBase = DEFAULT_HASHTAG_URL_BASE;
  }

  public String autoLink(String text) {
    return autoLinkUsernamesAndLists( autoLinkURLs( autoLinkHashtags(text) ) );
  }

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
                   .append(" href=\"").append(usernameUrlBase).append("$").append(Regex.AUTO_LINK_USERNAME_OR_LISTS_GROUP_USERNAME).append("\"")
                   .append(">$").append(Regex.AUTO_LINK_USERNAME_OR_LISTS_GROUP_USERNAME).append("</a>");
      } else {
        // Username and list
        replacement.append("$").append(Regex.AUTO_LINK_USERNAME_OR_LISTS_GROUP_BEFORE)
                   .append("$").append(Regex.AUTO_LINK_USERNAME_OR_LISTS_GROUP_AT)
                   .append("<a")
                   .append(" class=\"").append(urlClass).append(" ").append(listClass).append("\"")
                   .append(" href=\"").append(listUrlBase).append("$").append(Regex.AUTO_LINK_USERNAME_OR_LISTS_GROUP_USERNAME)
                   .append("$").append(Regex.AUTO_LINK_USERNAME_OR_LISTS_GROUP_LIST).append("\"")
                   .append(">$").append(Regex.AUTO_LINK_USERNAME_OR_LISTS_GROUP_USERNAME)
                   .append("$").append(Regex.AUTO_LINK_USERNAME_OR_LISTS_GROUP_LIST).append("</a>");
      }
      matcher.appendReplacement(sb, replacement.toString());
    }
    matcher.appendTail(sb);
    return sb.toString();
  }

  public String autoLinkHashtags(String text) {
    StringBuffer replacement = new StringBuffer(text.length());
    replacement.append("$").append(Regex.AUTO_LINK_HASHTAGS_GROUP_BEFORE)
        .append("<a")
        .append(" href=\"").append(hashtagUrlBase).append("$").append(Regex.AUTO_LINK_HASHTAGS_GROUP_TAG).append("\"")
        .append(" title=\"#$").append(Regex.AUTO_LINK_HASHTAGS_GROUP_TAG).append("\"")
        .append(" class=\"").append(urlClass).append(" ").append(hashtagClass).append("\"")
        .append(">$").append(Regex.AUTO_LINK_HASHTAGS_GROUP_HASH).append("$")
        .append(Regex.AUTO_LINK_HASHTAGS_GROUP_TAG).append("</a>");
    return Regex.AUTO_LINK_HASHTAGS.matcher(text).replaceAll(replacement.toString());
  }

  public String autoLinkURLs(String text) {
    Matcher matcher = Regex.VALID_URL.matcher(text);
    StringBuffer sb = new StringBuffer(text.length());
    while (matcher.find()) {
      StringBuffer replacement = new StringBuffer(text.length());
      if (matcher.group(Regex.VALID_URL_GROUP_URL).startsWith("http://") ||
          matcher.group(Regex.VALID_URL_GROUP_URL).startsWith("https://")) {
        replacement.append("$").append(Regex.VALID_URL_GROUP_BEFORE)
                   .append("<a href=\"$").append(Regex.VALID_URL_GROUP_URL).append("\">$")
                   .append(Regex.VALID_URL_GROUP_URL).append("</a>");
      } else {
        replacement.append("$").append(Regex.VALID_URL_GROUP_BEFORE)
                   .append("<a href=\"http://$").append(Regex.VALID_URL_GROUP_URL).append("\">$")
                   .append(Regex.VALID_URL_GROUP_URL).append("</a>");
      }
      matcher.appendReplacement(sb, replacement.toString());
    }
    matcher.appendTail(sb);
    return sb.toString();
  }

  public String getUrlClass() {
    return urlClass;
  }

  public void setUrlClass(String urlClass) {
    this.urlClass = urlClass;
  }

  public String getListClass() {
    return listClass;
  }

  public void setListClass(String listClass) {
    this.listClass = listClass;
  }

  public String getUsernameClass() {
    return usernameClass;
  }

  public void setUsernameClass(String usernameClass) {
    this.usernameClass = usernameClass;
  }

  public String getHashtagClass() {
    return hashtagClass;
  }

  public void setHashtagClass(String hashtagClass) {
    this.hashtagClass = hashtagClass;
  }

  public String getUsernameUrlBase() {
    return usernameUrlBase;
  }

  public void setUsernameUrlBase(String usernameUrlBase) {
    this.usernameUrlBase = usernameUrlBase;
  }

  public String getListUrlBase() {
    return listUrlBase;
  }

  public void setListUrlBase(String listUrlBase) {
    this.listUrlBase = listUrlBase;
  }

  public String getHashtagUrlBase() {
    return hashtagUrlBase;
  }

  public void setHashtagUrlBase(String hashtagUrlBase) {
    this.hashtagUrlBase = hashtagUrlBase;
  }
}