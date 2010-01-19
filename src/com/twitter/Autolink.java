
package com.twitter;

import java.util.*;
import java.util.regex.*;

public class Autolink {
  public String autoLink(String text) {
    return autoLinkUsernamesAndLists( autoLinkURLs( autoLinkHashtags(text) ) );
  }

  public String autoLinkUsernamesAndLists(String text) {
    return null;
  }

  public String autoLinkHashtags(String text) {
    return null;
  }

  public String autoLinkURLs(String text) {
    return null;
  }
}