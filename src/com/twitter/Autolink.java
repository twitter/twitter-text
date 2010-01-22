
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
    // TODO: autolink
    return null;
  }

  public String autoLinkHashtags(String text) {
    return Regex.AUTO_LINK_HASHTAGS.matcher(text).replaceAll("$" + Regex.AUTO_LINK_HASHTAGS_GROUP_BEFORE +
        "<a" +
        " href=\"" + hashtagUrlBase + "$" + Regex.AUTO_LINK_HASHTAGS_GROUP_TAG + "\"" +        
        " title=\"#$" + Regex.AUTO_LINK_HASHTAGS_GROUP_TAG + "\"" +
        " class=\"" + urlClass + " " + hashtagClass + "\"" +
        ">$" + Regex.AUTO_LINK_HASHTAGS_GROUP_HASH + "$" + Regex.AUTO_LINK_HASHTAGS_GROUP_TAG + "</a>");
  }

  public String autoLinkURLs(String text) {
    return Regex.VALID_URL.matcher(text).replaceAll("$" + Regex.VALID_URL_GROUP_URL +
        "<a href=\"$" + Regex.VALID_URL_GROUP_URL + "\">$" + Regex.VALID_URL_GROUP_URL + "</a>");
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