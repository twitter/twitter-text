// Copyright 2019 Robert Sayre
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

use twitter_text_config::Configuration;
use idna::uts46;
use entity::Entity;
use entity::Type;
use idna::uts46::Flags;
use unicode_normalization::UnicodeNormalization;
use TwitterTextParseResults;
use std::str::CharIndices;
use std::iter::Peekable;
use pest::Parser;
use twitter_text_parser::twitter_text::TwitterTextParser;
use twitter_text_parser::twitter_text::Rule;
use twitter_text_config::Range;

type RuleMatch = fn(Rule) -> bool;
type Pair<'a> = pest::iterators::Pair<'a, Rule>;

/**
 * A common Trait implemented by the two Extractors, [Extractor] and [ValidatingExtractor].
 */
pub trait Extract<'a> {
    /// The result type returned from the various extract methods.
    type T;

    /// The result type returned from the various mention extract methods.
    type Mention;

    /// Get whether the extractor will detect URLs without schemes, such as "example.com".
    fn get_extract_url_without_protocol(&self) -> bool;

    /// Set whether the extractor will detect URLs without schemes, such as "example.com".
    fn set_extract_url_without_protocol(&mut self, extract_url_without_protocol: bool);

    /// Extract entities from the source text that match rules allowed by r_match.
    fn extract(&self, s: &'a str, r_match: RuleMatch) -> Self::T;

    /// Create the result type. The concrete type varies by implementation.
    fn create_result(&self, s: &'a str, entity_count:usize, pairs: &mut Vec<UnprocessedEntity<'a>>) -> Self::T;

    /// Create the mention result type. The concrete type varies by implementation.
    fn extract_reply_username(&self, s: &'a str) -> Self::Mention;

    /// Create a mention result type from a pest::Pair.
    fn mention_result(&self, s: &'a str, pairs: Option<Pair<'a>>) -> Self::Mention;

    /// Returns an empty result. Used when the input is invalid.
    fn empty_result(&self) -> Self::T;

    fn extract_impl(&self, s: &'a str, r_match: RuleMatch) -> Self::T {
        if s.is_empty() {
            return self.empty_result();
        }

        match TwitterTextParser::parse(Rule::tweet, s) {
            Ok(p) => {
                let mut scanned = Vec::new();
                let mut entity_count = 0;

                p.flatten().for_each(|pair| {
                    let r = pair.as_rule();
                    if r == Rule::invalid_char || r == Rule::emoji {
                        scanned.insert(0, UnprocessedEntity::Pair(pair));
                    } else if r_match(r) {
                        if r == Rule::url || r == Rule::url_without_protocol {
                            let span = pair.as_span();
                            if validate_url(pair) {
                                entity_count += 1;
                                scanned.insert(0, UnprocessedEntity::UrlSpan(span));
                            }
                        } else {
                            entity_count += 1;
                            scanned.insert(0, UnprocessedEntity::Pair(pair));
                        }
                    }
                });
                self.create_result(s, entity_count, &mut scanned)
            },
            Err(_e) => {
                self.empty_result()
            }
        }
    }

    /// Extract all URLs from the text, subject to value returned by [Extract::get_extract_url_without_protocol].
    fn extract_urls_with_indices(&self, s: &'a str) -> Self::T {
        if self.get_extract_url_without_protocol() {
            self.extract(s, |r| { r == Rule::url || r == Rule::url_without_protocol })
        } else {
            self.extract(s, |r| { r == Rule::url })
        }
    }

    /// Extract all Hashtags from the text
    fn extract_hashtags(&self, s: &'a str) -> Self::T {
        self.extract(s, |r| { r == Rule::hashtag })
    }

    /// Extract all Cashtags from the text
    fn extract_cashtags(&self, s: &'a str) -> Self::T {
        self.extract(s, |r| { r == Rule::cashtag })
    }

    /// Extract all usernames from the text. The same
    /// as [Extract::extract_mentioned_screennames_with_indices], but included for compatibility.
    fn extract_mentioned_screennames(&self, s: &'a str) -> Self::T {
        self.extract_mentioned_screennames_with_indices(s)
    }

    /// Extract all usernames from the text.
    fn extract_mentioned_screennames_with_indices(&self, s: &'a str) -> Self::T {
        self.extract(s, |r| { r == Rule::username })
    }

    /// Extract all usernames and lists from the text.
    fn extract_mentions_or_lists_with_indices(&self, s: &'a str) -> Self::T {
        self.extract(s, |r| { r == Rule::username || r == Rule::list })
    }

    /// Extract a "reply"--a username that appears at the beginning of a tweet.
    fn extract_reply_username_impl(&self, s: &'a str) -> Self::Mention {
        match TwitterTextParser::parse(Rule::reply, s) {
            Ok(pairs) => {
                for pair in pairs.flatten() {
                    return self.mention_result(s, Some(pair));
                }

                return self.mention_result(s, None)
            }
            Err(_) => self.mention_result(s, None)
        }
    }

    /// Extract all entities from the text (Usernames, Lists, Hashtags, Cashtags, and URLs).
    fn extract_entities_with_indices(&self, s: &'a str) -> Self::T {
        self.extract(s, |r| {
            r == Rule::url || r == Rule::hashtag || r == Rule::cashtag ||
                r == Rule::list || r == Rule::username
        })
    }

    /// Parse the text without extracting any entities.
    fn extract_scan(&self, s: &'a str) -> Self::T {
        self.extract(s, |_r| { false })
    }

    fn entity_from_pair(&self, ue: UnprocessedEntity<'a>, start: i32, end: i32) -> Option<Entity<'a>> {
        match ue {
            UnprocessedEntity::UrlSpan(url) => {
                Some(Entity::new(Type::URL, url.as_str(), start, end))
            },
            UnprocessedEntity::Pair(pair) => {
                let s = pair.as_str();
                match pair.as_rule() {
                    Rule::hashtag => {
                        Some(Entity::new(Type::HASHTAG, &s[calculate_offset(s)..], start, end))
                    },
                    Rule::cashtag => {
                        Some(Entity::new(Type::CASHTAG, &s[calculate_offset(s)..], start, end))
                    },
                    Rule::username => {
                        Some(Entity::new(Type::MENTION, &s[calculate_offset(s)..], start, end))
                    },
                    Rule::list => {
                        let mut list_iter = pair.into_inner();
                        let listname = list_iter.find(|p| { p.as_rule() == Rule::listname });
                        let list_slug = list_iter.find(|p| { p.as_rule() == Rule::list_slug });
                        match (listname, list_slug) {
                            (Some(ln), Some(ls)) => {
                                let name = ln.as_str();
                                Some(Entity::new_list(Type::MENTION, &name[calculate_offset(name)..],
                                                      &ls.as_str(), start, end))
                            },
                            _ => {
                                None
                            }
                        }
                    }
                    _ => None
                }
            }
        }
    }
}

/**
 * An [Extract] implementation that does no validation (length checks, validity, etc).
 */
pub struct Extractor {
    extract_url_without_protocol: bool,
}

impl Extractor {
    /// Create a new extractor that extracts URLs without a protocol.
    pub fn new() -> Extractor {
        Extractor {
            extract_url_without_protocol: true,
        }
    }

    /// Extract a vector of URLs as [String] objects.
    pub fn extract_urls(&self, s: &str) -> Vec<String> {
        self.extract_urls_with_indices(s).iter().map(|entity| {
            String::from(entity.get_value())
        }).collect()
    }

    // Internal UTF-8 to UTF-32 offset calculation.
    fn scan(&self, iter: &mut Peekable<CharIndices>, limit: usize) -> i32 {
        let mut offset = 0;

        loop {
            if let Some((peeked_pos, _c)) = iter.peek() {
                if *peeked_pos >= limit {
                    break;
                }
            } else {
                break;
            }

            if let Some((_, _)) = iter.next() {
                offset += 1;
            }
        }

        offset
    }
}

impl<'a> Extract<'a> for Extractor {
    /// [Extractor] returns a vector of entities with no validation data.
    type T = Vec<Entity<'a>>;

    /// [Extractor] returns a single mention entity with no validation data.
    type Mention = Option<Entity<'a>>;

    fn get_extract_url_without_protocol(&self) -> bool {
        self.extract_url_without_protocol
    }

    fn set_extract_url_without_protocol(&mut self, extract_url_without_protocol: bool) {
        self.extract_url_without_protocol = extract_url_without_protocol;
    }

    fn extract(&self, s: &'a str, r_match: RuleMatch) -> Vec<Entity<'a>> {
        self.extract_impl(s, r_match)
    }

    fn create_result(&self, s: &'a str, count: usize, scanned: &mut Vec<UnprocessedEntity<'a>>) -> Vec<Entity<'a>> {
        let mut entities = Vec::with_capacity(count);
        let mut iter = s.char_indices().peekable();
        let mut start_index = 0;

        while let Some(entity) = scanned.pop() {
            start_index += self.scan(iter.by_ref(), entity.start());
            let end_index = start_index + self.scan(iter.by_ref(), entity.end());
            if let Some(e) = self.entity_from_pair(entity, start_index, end_index) {
                entities.push(e);
            }
            start_index = end_index;
        }

        entities
    }

    fn extract_reply_username(&self, s: &'a str) -> Option<Entity<'a>> {
        self.extract_reply_username_impl(s)
    }

    fn mention_result(&self, s: &'a str, entity: Option<Pair<'a>>) -> Option<Entity<'a>> {
        match entity {
            Some(e) => {
                let mut v = Vec::new();
                v.push(UnprocessedEntity::Pair(e));
                self.create_result(s, 1, &mut v).pop()
            },
            None => None
        }
    }

    fn empty_result(&self) -> Vec<Entity<'a>> {
        Vec::new()
    }
}

/**
 * An [Extract] implementation that extracts entities and provides [TwitterTextParseResults] validation data.
 */
pub struct ValidatingExtractor<'a> {
    extract_url_without_protocol: bool,
    config: &'a Configuration,
    ld: LengthData,
}

impl<'a> ValidatingExtractor<'a> {
    /// Create a new Extractor. [ValidatingExtractor::prep_input] must be called prior to extract.
    pub fn new(configuration: &Configuration) -> ValidatingExtractor {
        ValidatingExtractor {
            extract_url_without_protocol: true,
            config: configuration,
            ld: LengthData::empty(),
        }
    }

    /// Initialize the [ValidatingExtractor] text length data.
    pub fn prep_input(&mut self, s: &str) -> String {
        let nfc: String = s.nfc().collect();
        let (nfc_length, nfc_length_utf8) = calculate_length(nfc.as_str());
        let (original_length, original_length_utf8) = calculate_length(s);
        self.ld = LengthData {
            normalized_length: nfc_length,
            normalized_length_utf8: nfc_length_utf8,
            original_length,
            original_length_utf8,
        };
        nfc
    }

    /// Create a new Extractor from text that is already nfc-normalized. There's no need to call
    /// [ValidatingExtractor::prep_input] for this text.
    pub fn new_with_nfc_input(configuration: &'a Configuration, s: &str) -> ValidatingExtractor<'a> {
        let (original_length, original_length_utf8) = calculate_length(s);
        let (length, length_utf8) = calculate_length(s);
        ValidatingExtractor {
            extract_url_without_protocol: true,
            config: configuration,
            ld: LengthData {
                normalized_length: length,
                normalized_length_utf8: length_utf8,
                original_length: length,
                original_length_utf8: length_utf8,
            },
        }
    }
}

fn calculate_length(text: &str) -> (i32, i32) {
    let mut length: i32 = 0;
    let mut length_utf8: i32 = 0;
    for c in text.chars() {
        length += as_i32(c.len_utf16());
        length_utf8 += 1;
    }
    (length, length_utf8)
}

impl<'a> Extract<'a> for ValidatingExtractor<'a> {
    type T = ExtractResult<'a>;
    type Mention = MentionResult<'a>;

    fn get_extract_url_without_protocol(&self) -> bool {
        self.extract_url_without_protocol
    }

    fn set_extract_url_without_protocol(&mut self, extract_url_without_protocol: bool) {
        self.extract_url_without_protocol = extract_url_without_protocol;
    }

    fn extract(&self, s: &'a str, r_match: RuleMatch) -> Self::T {
        self.extract_impl(s, r_match)
    }

    fn create_result(&self, s: &'a str, count: usize, scanned: &mut Vec<UnprocessedEntity<'a>>) -> ExtractResult<'a> {
        println!("scanned: {}", scanned.len());
        let mut iter = s.char_indices().peekable();
        let mut metrics = TextMetrics::new(self.config, self.ld.normalized_length);
        let mut entities = Vec::with_capacity(count);
        let mut start_index = 0;
        while let Some(entity) = scanned.pop() {
            start_index += metrics.scan(iter.by_ref(), entity.start(), TrackAction::Text);
            let r = entity.as_rule();
            if r == Rule::invalid_char {
                metrics.is_valid = false;
            } else if r == Rule::emoji && self.config.emoji_parsing_enabled {
                metrics.weighted_count += self.config.default_weight;
                start_index += metrics.scan(iter.by_ref(), entity.end(), TrackAction::Emoji);
            } else {
                let action = if r == Rule::url {
                    TrackAction::Url
                } else {
                    TrackAction::Text
                };
                let end_index = start_index + metrics.scan(iter.by_ref(), entity.end(), action);
                if let Some(e) = self.entity_from_pair(entity, start_index, end_index) {
                    entities.push(e);
                }
                start_index = end_index;
            }
        }

        metrics.scan(iter.by_ref(), s.len(), TrackAction::Text);

        let normalized_tweet_offset: i32 = self.ld.original_length - self.ld.normalized_length;
        let scaled_weighted_length = metrics.weighted_count / self.config.scale;
        let is_valid = metrics.is_valid && scaled_weighted_length <= self.config.max_weighted_tweet_length;
        let permillage = scaled_weighted_length * 1000 / self.config.max_weighted_tweet_length;

        let results = TwitterTextParseResults::new(
            scaled_weighted_length,
            permillage,
            is_valid,
            Range::new(0, metrics.offset + normalized_tweet_offset - 1),
            Range::new(0, metrics.valid_offset + normalized_tweet_offset - 1),
        );

        ExtractResult::new(results, entities)
    }

    fn extract_reply_username(&self, s: &'a str) -> MentionResult<'a> {
        self.extract_reply_username_impl(s)
    }

    fn mention_result(&self, s: &'a str, pair: Option<Pair<'a>>)
        -> MentionResult<'a> {
        MentionResult::new(TwitterTextParseResults::empty(), None)
    }

    fn empty_result(&self) -> ExtractResult<'a> {
        ExtractResult::new(TwitterTextParseResults::empty(), Vec::new())
    }
}

/// Entities and validation data returned by [ValidatingExtractor].
pub struct ExtractResult<'a> {
    pub parse_results: TwitterTextParseResults,
    pub entities: Vec<Entity<'a>>
}

impl<'a> ExtractResult<'a> {
    pub fn new(results: TwitterTextParseResults,  e: Vec<Entity<'a>>) -> ExtractResult<'a> {
        ExtractResult {
            parse_results: results,
            entities: e,
        }
    }
}

/// A mention entity and validation data returned by [ValidatingExtractor].
pub struct MentionResult<'a> {
    pub parse_results: TwitterTextParseResults,
    pub mention: Option<Entity<'a>>
}

impl<'a> MentionResult<'a> {
    pub fn new(results: TwitterTextParseResults,  e: Option<Entity<'a>>) -> MentionResult<'a> {
        MentionResult {
            parse_results: results,
            mention: e,
        }
    }
}

// Tracks validation data during entity extraction.
struct TextMetrics<'a> {
    is_valid: bool,
    weighted_count: i32,
    offset: i32,
    valid_offset: i32,
    normalized_length: i32,
    scaled_max_weighted_tweet_length: i32,
    config: &'a Configuration,
}

impl<'a> TextMetrics<'a> {
    fn new(config: &Configuration, normalized_length: i32) -> TextMetrics {
        TextMetrics {
            is_valid: true,
            weighted_count: 0,
            offset: 0,
            valid_offset: 0,
            normalized_length,
            scaled_max_weighted_tweet_length: config.max_weighted_tweet_length * config.scale,
            config
        }
    }

    fn add_char(&mut self, c: char) {
        let len_utf16 : i32 = as_i32(c.len_utf16());
        self.add_offset(len_utf16);
    }

    fn add_offset(&mut self, offset: i32) {
        self.offset += offset;
        if self.is_valid && self.weighted_count <= self.scaled_max_weighted_tweet_length {
            self.valid_offset += offset;
        }
    }

    fn track_emoji(&mut self, c: char) {
        self.add_char(c);
    }

    fn track_url(&mut self, count: i32) {
        self.weighted_count += self.config.transformed_url_length * self.config.scale;
        self.add_offset(count);
    }

    fn track_text(&mut self, c: char) {
        if self.offset < self.normalized_length {
            let code_point: i32 = c as i32;
            let mut char_weight = self.config.default_weight;
            for (_, range) in self.config.ranges.iter().enumerate() {
                if range.contains(code_point) {
                    char_weight = range.weight;
                    break;
                }
            }
            self.weighted_count += char_weight;
            self.add_char(c);
        }
    }

    fn scan(&mut self, iter: &mut Peekable<CharIndices>, limit: usize, action: TrackAction) -> i32 {
        let mut offset = 0;

        loop {
            if let Some((peeked_pos, _c)) = iter.peek() {
                if *peeked_pos >= limit {
                    break;
                }
            } else {
                break;
            }

            if let Some((_pos, c)) = iter.next() {
                offset += 1;
                match action {
                    TrackAction::Text => self.track_text(c),
                    TrackAction::Emoji => self.track_emoji(c),
                    TrackAction::Url => {},
                }
            }
        }

        if let TrackAction::Url = action {
            self.track_url(offset);
        }

        offset
    }
}

enum TrackAction {
    Text,
    Emoji,
    Url
}

pub enum UnprocessedEntity<'a> {
    UrlSpan(pest::Span<'a>),
    Pair(Pair<'a>)
}

impl<'a> UnprocessedEntity<'a> {
    fn start(&self) -> usize {
        match self {
            UnprocessedEntity::UrlSpan(span) => span.start(),
            UnprocessedEntity::Pair(pair) => pair.as_span().start(),
        }
    }

    fn end(&self) -> usize {
        match self {
            UnprocessedEntity::UrlSpan(span) => span.end(),
            UnprocessedEntity::Pair(pair) => pair.as_span().end(),
        }
    }

    fn as_rule(&self) -> Rule {
        match self {
            UnprocessedEntity::UrlSpan(_span) => Rule::url,
            UnprocessedEntity::Pair(pair) => pair.as_rule()
        }
    }
}

fn calculate_offset(s: &str) -> usize {
    s.chars().next().unwrap_or(' ').len_utf8()
}

fn validate_url(p: Pair) -> bool {
    let original = p.as_str();
    match p.into_inner().find(|pair| {
        let r = pair.as_rule();
        r == Rule::host || r == Rule::tco_domain || r == Rule::uwp_domain
    }) {
        Some(pair) => valid_punycode(original, &pair),
        _ => false
    }
}

fn valid_punycode(original: &str, domain: &pest::iterators::Pair<Rule>) -> bool {
    let source = domain.as_span().as_str();
    let flags = Flags {
        use_std3_ascii_rules: false,
        transitional_processing: true,
        verify_dns_length: true,
    };
    match uts46::to_ascii(&source, flags) {
        Ok(s) => length_check(original, source, &s, domain.as_rule() != Rule::uwp_domain),
        Err(_) => false
    }
}

fn length_check(original: &str, original_domain: &str,
                punycode_domain: &str, has_scheme: bool) -> bool {
    let length = if has_scheme {
        0
    } else {
        "https://".len()
    };

    (length + original.len() - original_domain.len() + punycode_domain.len()) < MAX_URL_LENGTH
}

/**
 * The maximum url length that the Twitter backend supports.
 */
pub const MAX_URL_LENGTH: usize = 4096;

// The best that can currently be done per <https://goo.gl/CBHdE9>
fn as_i32(us: usize) -> i32 {
    let u = if us > std::i32::MAX as usize {
        None
    } else {
        Some(us as i32)
    };
    u.unwrap()
}

#[derive(PartialEq, Eq, Hash, Debug, Clone, Copy)]
struct LengthData {
    normalized_length: i32,
    normalized_length_utf8: i32,
    original_length: i32,
    original_length_utf8: i32,
}

impl LengthData {
    fn empty() -> LengthData {
        LengthData {
            normalized_length: 0,
            normalized_length_utf8: 0,
            original_length: 0,
            original_length_utf8: 0,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_extract_empty_string_mentions() {
        let extractor = Extractor::new();
        let mentions = extractor.extract_mentioned_screennames("");
        assert_eq!(0, mentions.len());
    }

    #[test]
    fn test_extract_single_mention() {
        let extractor = Extractor::new();
        let mentions = extractor.extract_mentioned_screennames("@hi");
        assert_eq!(1, mentions.len());
    }

    #[test]
    fn test_extract_setting() {
        let mut extractor = Extractor::new();
        extractor.set_extract_url_without_protocol(false);
        assert_eq!(false, extractor.get_extract_url_without_protocol());
        extractor.set_extract_url_without_protocol(true);
        assert_eq!(true, extractor.get_extract_url_without_protocol());
    }
}
