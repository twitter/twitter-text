package com.twitter;

import org.apache.commons.lang.StringEscapeUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;

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

  public Autolink() {
    urlClass = DEFAULT_URL_CLASS;
    listClass = DEFAULT_LIST_CLASS;
    usernameClass = DEFAULT_USERNAME_CLASS;
    hashtagClass = DEFAULT_HASHTAG_CLASS;
    usernameUrlBase = DEFAULT_USERNAME_URL_BASE;
    listUrlBase = DEFAULT_LIST_URL_BASE;
    hashtagUrlBase = DEFAULT_HASHTAG_URL_BASE;
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

  /**
   * Auto-link hashtags, URLs, usernames and lists.
   *
   * @param text of the Tweet to auto-link
   * @return text with auto-link HTML added
   */
  public String autoLink(String text) {
    return autoLinkUsernamesAndLists( autoLinkURLs( autoLinkHashtags( escapeBrackets(text) ) ) );
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
    Matcher matcher;
    int capacity = text.length() * 2;
    StringBuffer sb = new StringBuffer(capacity);
    Iterable<String> chunks = split(text, "<>");
    int i = 0;
    for (String chunk : chunks) {
      if (0 != i) {
        if (i % 2 == 0) {
          sb.append(">");
        } else {
          sb.append("<");
        }
      }

      if (i % 4 != 0) {
        // Inside of a tag, just copy over the chunk.
        sb.append(chunk);
      } else {
        // Outside of a tag, do real work with this chunk
        matcher = Regex.AUTO_LINK_USERNAMES_OR_LISTS.matcher(chunk);
        while (matcher.find()) {
          if (matcher.group(Regex.AUTO_LINK_USERNAME_OR_LISTS_GROUP_LIST) == null ||
              matcher.group(Regex.AUTO_LINK_USERNAME_OR_LISTS_GROUP_LIST).isEmpty()) {

            // Username only
            if (!Regex.SCREEN_NAME_MATCH_END.matcher(chunk.substring(matcher.end())).find()) {
              StringBuilder rb = new StringBuilder(capacity);
              rb.append(matcher.group(Regex.AUTO_LINK_USERNAME_OR_LISTS_GROUP_BEFORE))
                      .append(matcher.group(Regex.AUTO_LINK_USERNAME_OR_LISTS_GROUP_AT))
                      .append("<a class=\"").append(urlClass).append(" ").append(usernameClass)
                      .append("\" href=\"").append(usernameUrlBase)
                      .append(matcher.group(Regex.AUTO_LINK_USERNAME_OR_LISTS_GROUP_USERNAME))
                      .append("\"");
              if (noFollow) rb.append(NO_FOLLOW_HTML_ATTRIBUTE);
              rb.append(">")
                      .append(matcher.group(Regex.AUTO_LINK_USERNAME_OR_LISTS_GROUP_USERNAME))
                      .append("</a>");
              matcher.appendReplacement(sb, rb.toString());
            } else {
              // Not a screen name valid for linking
              matcher.appendReplacement(sb, matcher.group(0));
            }
          } else {
            // Username and list
            StringBuilder rb = new StringBuilder(capacity);
            rb.append(matcher.group(Regex.AUTO_LINK_USERNAME_OR_LISTS_GROUP_BEFORE))
                    .append(matcher.group(Regex.AUTO_LINK_USERNAME_OR_LISTS_GROUP_AT))
                    .append("<a class=\"").append(urlClass).append(" ").append(listClass)
                    .append("\" href=\"").append(listUrlBase)
                    .append(matcher.group(Regex.AUTO_LINK_USERNAME_OR_LISTS_GROUP_USERNAME))
                    .append(matcher.group(Regex.AUTO_LINK_USERNAME_OR_LISTS_GROUP_LIST))
                    .append("\"");
            if (noFollow) rb.append(NO_FOLLOW_HTML_ATTRIBUTE);
            rb.append(">").append(matcher.group(Regex.AUTO_LINK_USERNAME_OR_LISTS_GROUP_USERNAME))
                    .append(matcher.group(Regex.AUTO_LINK_USERNAME_OR_LISTS_GROUP_LIST))
                    .append("</a>");
            matcher.appendReplacement(sb, rb.toString());
          }
        }

        matcher.appendTail(sb);
      }
      i++;
    }

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
    StringBuffer sb = new StringBuffer();
    Matcher matcher = Regex.AUTO_LINK_HASHTAGS.matcher(text);
    while (matcher.find()) {
      String after = text.substring(matcher.end());
      if (!Regex.HASHTAG_MATCH_END.matcher(after).find()) {
        StringBuilder replacement = new StringBuilder(text.length() * 2);
        replacement.append(matcher.group(Regex.AUTO_LINK_HASHTAGS_GROUP_BEFORE))
                .append("<a href=\"").append(hashtagUrlBase)
                .append(matcher.group(Regex.AUTO_LINK_HASHTAGS_GROUP_TAG)).append("\"")
                .append(" title=\"#").append(matcher.group(Regex.AUTO_LINK_HASHTAGS_GROUP_TAG))
                .append("\" class=\"").append(urlClass).append(" ")
                .append(hashtagClass).append("\"");
        if (noFollow) {
          replacement.append(NO_FOLLOW_HTML_ATTRIBUTE);
        }
        replacement.append(">").append(matcher.group(Regex.AUTO_LINK_HASHTAGS_GROUP_HASH))
                .append(matcher.group(Regex.AUTO_LINK_HASHTAGS_GROUP_TAG)).append("</a>");
        matcher.appendReplacement(sb, replacement.toString());
      } else {
        // not a valid hashtag
        matcher.appendReplacement(sb, "$0");
      }
    }
    matcher.appendTail(sb);
    return sb.toString();
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
    Matcher matcher = Regex.VALID_URL.matcher(text);
    int capacity = text.length() * 2;
    StringBuffer sb = new StringBuffer(capacity);

    while (matcher.find()) {
      String protocol = matcher.group(Regex.VALID_URL_GROUP_PROTOCOL);
      if (protocol != null) {
        // query string needs to be html escaped
        String url = matcher.group(Regex.VALID_URL_GROUP_URL);
        String after = "";

        Matcher tco_matcher = Regex.VALID_TCO_URL.matcher(url);
        if (tco_matcher.find()) {
          // In the case of t.co URLs, don't allow additional path characters.
          after = url.substring(tco_matcher.end());
          url = tco_matcher.group();
        } else {
          String query_string = matcher.group(Regex.VALID_URL_GROUP_QUERY_STRING);
          if (query_string != null) {
            // Doing a replace isn't safe as the query string might match something else in the URL
            int us = matcher.start(Regex.VALID_URL_GROUP_URL);
            int qs = matcher.start(Regex.VALID_URL_GROUP_QUERY_STRING);
            int qe = matcher.end(Regex.VALID_URL_GROUP_QUERY_STRING);
            String replacement = StringEscapeUtils.escapeHtml(query_string);
            url = url.substring(0, qs - us) + replacement + url.substring(qe - us);
          }
          if (url.indexOf('$') != -1) {
            url = url.replace("$", "\\$");
          }
        }

        StringBuilder rb = new StringBuilder(capacity);
        rb.append(matcher.group(Regex.VALID_URL_GROUP_BEFORE))
                .append("<a href=\"").append(url).append("\"");
        if (noFollow) rb.append(NO_FOLLOW_HTML_ATTRIBUTE);
        rb.append(">").append(url).append("</a>").append(after);
        matcher.appendReplacement(sb, rb.toString());
        continue;
      }

      matcher.appendReplacement(sb, matcher.group(Regex.VALID_URL_GROUP_ALL));

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

  // The default String split is horribly inefficient
  protected static Iterable<String> split(final String s, final String d) {
    List<String> strings = new ArrayList<String>();
    int length = s.length();
    int current = 0;
    while (current < length) {
      int minIndex = Integer.MAX_VALUE;
      for (char c : d.toCharArray()) {
        int index = s.indexOf(c, current);
        if (index != -1 && index < minIndex) {
          minIndex = index;
        }
      }
      if (minIndex == Integer.MAX_VALUE) {
        // s doesn't contain any char in d
        strings.add(s.substring(current));
        current = length;
      } else {
        strings.add(s.substring(current, minIndex));
        current = minIndex + 1;
        if (current == length) {
          // last char in s is in d.
          strings.add("");
        }
      }
    }
    return strings;
  }
}
