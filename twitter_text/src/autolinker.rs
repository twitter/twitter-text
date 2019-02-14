// Copyright 2019 Robert Sayre
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

extern crate pest;
use entity::Entity;
use entity;
use extractor::Extract;
use extractor::Extractor;

type Attributes = Vec<(String, String)>;
const HREF: &'static str = "href";
const CLASS: &'static str = "class";
const TARGET: &'static str = "target";
const TITLE: &'static str = "title";

/**
 * Default CSS class for auto-linked list URLs
 */
pub const DEFAULT_LIST_CLASS: &str = "tweet-url list-slug";

/**
 * Default CSS class for auto-linked username URLs
 */
pub const DEFAULT_USERNAME_CLASS: &str = "tweet-url username";

/**
 * Default CSS class for auto-linked hashtag URLs
 */
pub const DEFAULT_HASHTAG_CLASS: &str = "tweet-url hashtag";

/**
 * Default CSS class for auto-linked cashtag URLs
 */
pub const DEFAULT_CASHTAG_CLASS: &str = "tweet-url cashtag";

/**
 * Default href for username links (the username without the @ will be appended)
 */
pub const DEFAULT_USERNAME_URL_BASE: &str = "https://twitter.com/";

/**
 * Default href for list links (the username/list without the @ will be appended)
 */
pub const DEFAULT_LIST_URL_BASE: &str = "https://twitter.com/";

/**
 * Default href for hashtag links (the hashtag without the # will be appended)
 */
pub const DEFAULT_HASHTAG_URL_BASE: &str = "https://twitter.com/search?q=%23";

/**
 * Default href for cashtag links (the cashtag without the $ will be appended)
 */
pub const DEFAULT_CASHTAG_URL_BASE: &str = "https://twitter.com/search?q=%24";

/**
 * Default attribute for invisible span tag
 */
pub const DEFAULT_INVISIBLE_TAG_ATTRS: &str = "style='position:absolute;left:-9999px;'";

/**
 * Adds HTML links to hashtag, username and list references in Tweet text.
 */
pub struct Autolinker<'a> {
    pub no_follow: bool,
    pub url_class: &'a str,
    pub url_target: &'a str,
    pub symbol_tag: &'a str,
    pub text_with_symbol_tag: &'a str,
    pub list_class: &'a str,
    pub username_class: &'a str,
    pub hashtag_class: &'a str,
    pub cashtag_class: &'a str,
    pub username_url_base: &'a str,
    pub list_url_base: &'a str,
    pub hashtag_url_base: &'a str,
    pub cashtag_url_base: &'a str,
    pub invisible_tag_attrs: &'a str,
    pub username_include_symbol: bool,
    extractor: Extractor,
}

impl<'a> Autolinker<'a> {
    /// An [Autolinker] with default properties.
    pub fn new(no_follow: bool) -> Autolinker<'a> {
        let mut extractor = Extractor::new();
        extractor.set_extract_url_without_protocol(false);
        Autolinker {
            no_follow,
            url_class: "",
            url_target: "",
            symbol_tag: "",
            text_with_symbol_tag: "",
            list_class: DEFAULT_LIST_CLASS,
            username_class: DEFAULT_USERNAME_CLASS,
            hashtag_class: DEFAULT_HASHTAG_CLASS,
            cashtag_class: DEFAULT_CASHTAG_CLASS,
            username_url_base: DEFAULT_USERNAME_URL_BASE,
            list_url_base: DEFAULT_LIST_URL_BASE,
            hashtag_url_base: DEFAULT_HASHTAG_URL_BASE,
            cashtag_url_base: DEFAULT_CASHTAG_URL_BASE,
            invisible_tag_attrs: DEFAULT_INVISIBLE_TAG_ATTRS,
            username_include_symbol: false,
            extractor,
        }
    }

    fn link_to_text(&self, entity: &Entity, original_text: &str,
                        attributes: &mut Attributes, buf: &mut String) {
        if self.no_follow {
            attributes.push((String::from("rel"), String::from("nofollow")));
        }

        let text = original_text;
        /*
            if (linkAttributeModifier != null) {
                linkAttributeModifier.modify(entity, attributes);
            }
            if (linkTextModifier != null) {
                text = linkTextModifier.modify(entity, originalText);
             }
         */

        buf.push_str("<a");
        for (k, v) in attributes {
            buf.push(' ');
            buf.push_str(escape_html(k).as_str());
            buf.push_str("=\"");
            buf.push_str(escape_html(v).as_str());
            buf.push('"');
        }
        buf.push('>');
        buf.push_str(text);
        buf.push_str("</a>");
    }

    fn link_to_text_with_symbol(&self, entity: &Entity, sym: &str, original_text: &str,
                                attributes: &mut Attributes, buf: &mut String) {
        let tagged_symbol = match self.symbol_tag {
            "" => String::from(sym),
            _ => format!("<{}>{}</{}>", self.symbol_tag, sym, self.symbol_tag)
        };
        let text = escape_html(original_text);
        let tagged_text = match self.text_with_symbol_tag {
            "" => text,
            _ => format!("<{}>{}</{}>", self.text_with_symbol_tag, text, self.text_with_symbol_tag)
        };
        let inc_sym = self.username_include_symbol || !(sym.contains('@') || sym.contains('\u{FF20}'));

        if inc_sym {
            self.link_to_text(entity, &(tagged_symbol + &tagged_text), attributes, buf);
        } else {
            buf.push_str(tagged_symbol.as_str());
            self.link_to_text(entity, tagged_text.as_str(), attributes, buf);
        }
    }

    fn link_to_hashtag(&self, entity: &Entity, text: &str, buf: &mut String) {
        let hash_char = text.chars().skip(entity.get_start() as usize).take(1).collect::<String>();
        let hashtag = entity.get_value();
        let mut attrs: Attributes = Vec::new();
        attrs.push((HREF.to_string(), String::from(self.hashtag_url_base.to_owned() + hashtag)));
        attrs.push((TITLE.to_string(), String::from("#".to_owned() + hashtag)));

        if contains_rtl(text) {
            attrs.push((CLASS.to_string(), String::from(self.hashtag_class.to_owned() + " rtl")));
        } else {
            attrs.push((CLASS.to_string(), String::from(self.hashtag_class)));
        }
        self.link_to_text_with_symbol(entity, hash_char.as_str(), hashtag, &mut attrs, buf);
    }

    fn link_to_cashtag(&self, entity: &Entity, text: &str, buf: &mut String) {
        let cashtag = entity.get_value();
        let mut attrs: Attributes = Vec::new();
        attrs.push((HREF.to_string(), self.cashtag_url_base.to_owned() + cashtag));
        attrs.push((TITLE.to_string(), "$".to_owned() + cashtag));
        attrs.push((CLASS.to_string(), String::from(self.cashtag_class)));

        self.link_to_text_with_symbol(entity, "$", cashtag, &mut attrs, buf);
    }

    fn link_to_mention_and_list(&self, entity: &Entity, text: &str, buf: &mut String) {
        let mut mention = String::from(entity.get_value());
        let at_char = text.chars().skip(entity.get_start() as usize).take(1).collect::<String>();
        let mut attrs: Attributes = Vec::new();

        if entity.get_type() == entity::Type::MENTION && !entity.get_list_slug().is_empty() {
            mention.push_str(entity.get_list_slug());
            attrs.push((CLASS.to_string(), self.list_class.to_owned()));
            attrs.push((HREF.to_string(), self.list_url_base.to_owned() + &mention));
        } else {
            attrs.push((CLASS.to_string(), self.username_class.to_owned()));
            attrs.push((HREF.to_string(), self.username_url_base.to_owned() + &mention));
        }

        self.link_to_text_with_symbol(entity, at_char.as_str(), mention.as_str(), &mut attrs, buf);
    }

    fn link_to_url(&self, entity: &Entity, text: &str, buf: &mut String) {
        let url = entity.get_value();
        let mut link_text = escape_html(url);
        if !entity.get_display_url().is_empty() && !entity.get_expanded_url().is_empty() {
            // Goal: If a user copies and pastes a tweet containing t.co'ed link, the resulting paste
            // should contain the full original URL (expanded_url), not the display URL.
            //
            // Method: Whenever possible, we actually emit HTML that contains expanded_url, and use
            // font-size:0 to hide those parts that should not be displayed
            // (because they are not part of display_url).
            // Elements with font-size:0 get copied even though they are not visible.
            // Note that display:none doesn't work here. Elements with display:none don't get copied.
            //
            // Additionally, we want to *display* ellipses, but we don't want them copied.
            // To make this happen we wrap the ellipses in a tco-ellipsis class and provide an onCopy
            // handler that sets display:none on everything with the tco-ellipsis class.
            //
            // As an example: The user tweets "hi http://longdomainname.com/foo"
            // This gets shortened to "hi http://t.co/xyzabc", with display_url = "…nname.com/foo"
            // This will get rendered as:
            // <span class='tco-ellipsis'> <!-- This stuff should get displayed but not copied -->
            //   …
            //   <!-- There's a chance the onCopy event handler might not fire. In case that happens,
            //        we include an &nbsp; here so that the … doesn't bump up against the URL and ruin it.
            //        The &nbsp; is inside the tco-ellipsis span so that when the onCopy handler *does*
            //        fire, it doesn't get copied.  Otherwise the copied text would have two spaces
            //        in a row, e.g. "hi  http://longdomainname.com/foo".
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
            // Exception: pic.twitter.com images, for which expandedUrl =
            // "https://twitter.com/username/status/1234/photo/1
            // For those URLs, display_url is not a substring of expanded_url,
            // so we don't do anything special to render the elided parts.
            // For a pic.twitter.com URL, the only elided part will be the "https://", so this is fine.
            let display_url_sans_ellipses = entity.get_display_url().replace("…", "");
            let index = entity.get_expanded_url().find(&display_url_sans_ellipses);
            if let Some(display_url_index_in_expanded_url) = index {
                let before_display_url = entity.get_expanded_url().chars()
                    .take(display_url_index_in_expanded_url).collect::<String>();
                let after_display_url = entity.get_expanded_url().chars().skip(
                    display_url_index_in_expanded_url + display_url_sans_ellipses.len()).collect::<String>();
                let preceding_ellipsis = if entity.get_display_url().starts_with("…") {
                    "…"
                } else {
                    ""
                };
                let following_ellipsis = if entity.get_display_url().ends_with("…") {
                    "…"
                } else {
                    ""
                };
                let invisible_span = "<span ".to_owned() + self.invisible_tag_attrs + ">";

                let mut sb = String::from("<span class='tco-ellipsis'>");
                sb += preceding_ellipsis;
                sb += &invisible_span;
                sb += "&nbsp;</span></span>";
                sb += &invisible_span;
                sb += &escape_html(&before_display_url);
                sb += "</span>";
                sb += "<span class='js-display-url'>";
                sb += &escape_html(&display_url_sans_ellipses);
                sb += "</span>";
                sb += &invisible_span;
                sb += &escape_html(&after_display_url);
                sb += "</span>";
                sb += "<span class='tco-ellipsis'>";
                sb += &invisible_span;
                sb += "&nbsp;</span>";
                sb += following_ellipsis;
                sb += "</span>";

                link_text = sb;
            } else {
                link_text = String::from(entity.get_display_url());
            }
        }

        let mut attrs: Attributes = Vec::new();
        attrs.push((HREF.to_string(), String::from(url)));
        if !self.url_class.is_empty() {
            attrs.push((CLASS.to_string(), String::from(self.url_class)));
        }
        if !self.url_target.is_empty() {
            attrs.push((TARGET.to_string(), String::from(self.url_target)));
        }
        self.link_to_text(entity, &link_text, &mut attrs, buf);
    }

    pub fn autolink_entities(&self, text: &str, entities: &Vec<Entity>) -> String {
        let mut buf = String::with_capacity(text.len() * 2);
        let mut offset = 0usize;
        for entity in entities {
            buf += &text.chars().skip(offset).take(entity.get_start() as usize - offset).collect::<String>();
            match entity.get_type() {
                entity::Type::URL => self.link_to_url(entity, text, &mut buf),
                entity::Type::HASHTAG => self.link_to_hashtag(entity, text, &mut buf),
                entity::Type::MENTION => self.link_to_mention_and_list(entity, text, &mut buf),
                entity::Type::CASHTAG => self.link_to_cashtag(entity, text, &mut buf),
            }
            offset = entity.get_end() as usize;
        }
        buf += &text.chars().skip(offset).collect::<String>();
        buf
    }

    /// Auto-link all entities.
    pub fn autolink(&self, original: &str) -> String {
        let text = escape_brackets(original);
        let entities = self.extractor.extract_entities_with_indices(&text);
        self.autolink_entities(&text, &entities)
    }

    /// Auto-link the @username and @username/list references in the provided text.
    /// Links to @username references will have the username_class CSS classes added.
    /// Links to @username/list references will have the list_class CSS class added.
    ///
    pub fn autolink_usernames_and_lists(&self, text: &str) -> String {
        let entities = self.extractor.extract_mentions_or_lists_with_indices(text);
        self.autolink_entities(text, &entities)
    }

    /// Auto-link #hashtag references in the provided Tweet text. The #hashtag links will have the
    /// hashtag_class CSS class added.
    ///
    pub fn autolink_hashtags(&self, text: &str) -> String {
        let entities = self.extractor.extract_hashtags(text);
        self.autolink_entities(text, &entities)
    }

    /// Auto-link URLs in the Tweet text provided.
    /// This only auto-links URLs with protocol.
    ///
    pub fn autolink_urls(&self, text: &str) -> String {
        let entities = self.extractor.extract_urls_with_indices(text);
        self.autolink_entities(text, &entities)
    }

    /// Auto-link $cashtag references in the provided Tweet text. The $cashtag links will have the
    /// cashtag_class CSS class added.
    ///
    pub fn autolink_cashtags(&self, text: &str) -> String {
        let entities = self.extractor.extract_cashtags(text);
        self.autolink_entities(text, &entities)
    }
}

fn contains_rtl(s: &str) -> bool {
    for c in s.chars() {
        if (c >= '\u{0600}' && c <= '\u{06FF}') ||
            (c >= '\u{0750}' && c <= '\u{077F}') ||
            (c >= '\u{0590}' && c <= '\u{05FF}') ||
            (c >= '\u{FE70}' && c <= '\u{FEFF}') {
            return true;
        }
    }

    return false;
}

/**
 * Adapted from <https://github.com/rust-lang/rust/blob/master/src/librustdoc/html/escape.rs>
 */
fn escape_html(s: &str) -> String {
    let mut last = 0;
    let mut buf = String::with_capacity(s.len() * 2);
    for (i, ch) in s.bytes().enumerate() {
        match ch as char {
            '<' | '>' | '&' | '\'' | '"' => {
                buf.push_str(&s[last..i]);
                let s = match ch as char {
                    '>' => "&gt;",
                    '<' => "&lt;",
                    '&' => "&amp;",
                    '\'' => "&#39;",
                    '"' => "&quot;",
                    _ => unreachable!()
                };
                buf.push_str(s);
                last = i + 1;
            }
            _ => {}
        }
    }

    if last < s.len() {
        buf.push_str(&s[last..]);
    }

     buf
}

fn escape_brackets(s: &str) -> String {
    let mut last = 0;
    let mut buf = String::with_capacity(s.len() + 32);
    for (i, ch) in s.bytes().enumerate() {
        match ch as char {
            '<' | '>' => {
                buf.push_str(&s[last..i]);
                let s = match ch as char {
                    '>' => "&gt;",
                    '<' => "&lt;",
                    _ => unreachable!()
                };
                buf.push_str(s);
                last = i + 1;
            }
            _ => {}
        }
    }

    if last < s.len() {
        buf.push_str(&s[last..]);
    }

    buf
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_escape_html() {
        let s = "foo <bar> baz & 'hmm' or \"hmm\"";
        assert_eq!("foo &lt;bar&gt; baz &amp; &#39;hmm&#39; or &quot;hmm&quot;", escape_html(s));
    }

    #[test]
    fn test_escape_brackets() {
        let s = "foo <bar> baz & 'hmm' or \"hmm\"";
        assert_eq!("foo &lt;bar&gt; baz & 'hmm' or \"hmm\"", escape_brackets(s));
    }
}
