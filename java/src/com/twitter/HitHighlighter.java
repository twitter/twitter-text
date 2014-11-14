
package com.twitter;

import java.util.*;
import java.util.regex.*;
import java.text.*;

/**
 * A class for adding HTML highlighting in Tweet text (such as would be returned from a Search)
 */
public class HitHighlighter {
  /** Default HTML tag for highlight hits */
  public static final String DEFAULT_HIGHLIGHT_TAG = "em";

  /** the current HTML tag used for hit highlighting */
  protected String highlightTag;

  /** Create a new HitHighlighter object. */
  public HitHighlighter() {
    highlightTag = DEFAULT_HIGHLIGHT_TAG;
  }

  /**
   * Surround the <code>hits</code> in the provided <code>text</code> with an HTML tag. This is used with offsets
   * from the search API to support the highlighting of query terms.
   *
   * @param text of the Tweet to highlight
   * @param hits A List of highlighting offsets (themselves lists of two elements)
   * @return text with highlight HTML added
   */
  public String highlight(String text, List<List<Integer>> hits) {
    if (hits == null || hits.isEmpty()) {
      return(text);
    }
    
    StringBuilder sb = new StringBuilder(text.length());
    CharacterIterator iterator = new StringCharacterIterator(text);
    boolean isCounting = true;
    boolean tagOpened = false;
    int currentIndex = 0;
    char currentChar = iterator.first();

    while (currentChar != CharacterIterator.DONE) {
      // TODO: this is slow.
      for (List<Integer> start_end : hits) {
        if (start_end.get(0) == currentIndex) {
          sb.append(tag(false));
          tagOpened = true;
        } else if (start_end.get(1) == currentIndex) {
          sb.append(tag(true));
          tagOpened = false;
        }
      }
      
      if (currentChar == '<') {
        isCounting = false;
      } else if (currentChar == '>' && !isCounting) {
        isCounting = true;
      }
  
      if (isCounting) {
        currentIndex++;
      }
      sb.append(currentChar);
      currentChar = iterator.next();
    }
    
    if (tagOpened) {
      sb.append(tag(true));
    }
    
    return(sb.toString());
  }

  /**
   * Format the current <code>highlightTag</code> by adding &lt; and >. If <code>closeTag</code> is <code>true</code>
   * then the tag returned will include a <code>/</code> to signify a closing tag.
   *
   * @param true if this is a closing tag, false otherwise
   */
  protected String tag(boolean closeTag) {
    StringBuilder sb = new StringBuilder(highlightTag.length() + 3);
    sb.append("<");
    if (closeTag) {
      sb.append("/");
    }
    sb.append(highlightTag).append(">");
    return(sb.toString());
  }

  /**
   * Get the current HTML tag used for phrase highlighting.
   *
   * @return current HTML tag (without &lt; or >)
   */
  public String getHighlightTag() {
    return highlightTag;
  }

  /**
   * Set the current HTML tag used for phrase highlighting.
   *
   * @param new HTML tag (without &lt; or >)
   */
  public void setHighlightTag(String highlightTag) {
    this.highlightTag = highlightTag;
  }
}