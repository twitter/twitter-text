// Copyright 2019 Robert Sayre
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

extern crate twitter_text_config;
extern crate twitter_text_parser;
extern crate unicode_normalization;
extern crate idna;
extern crate pest;

pub mod extractor;
pub mod hit_highlighter;
pub mod autolinker;
pub mod entity;
pub mod validator;

use twitter_text_config::Configuration;
use twitter_text_config::Range;
use extractor::Extract;
use extractor::ValidatingExtractor;

/**
 * A struct that represents a parsed tweet containing the length of the tweet,
 * its validity, display ranges etc. The name mirrors Twitter's Java implementation.
 */
#[derive(PartialEq, Eq, Hash, Debug, Clone, Copy)]
pub struct TwitterTextParseResults {
    /// The weighted length is the number used to determine the tweet's length for the purposes of Twitter's limit of 280. Most characters count
    /// for 2 units, while a few ranges (like ASCII and Latin-1) count for 1. See [Twitter's blog post](https://blog.twitter.com/official/en_us/topics/product/2017/Giving-you-more-characters-to-express-yourself.html).
    pub weighted_length: i32,

    /// The weighted length expressed as a number relative to a limit of 1000.
    /// This value makes it easier to implement UI like Twitter's tweet-length meter.
    pub permillage: i32,

    /// Whether the tweet is valid: its weighted length must be under the configured limit, it must
    /// not be empty, and it must not contain invalid characters.
    pub is_valid: bool,

    /// The display range expressed in UTF-16.
    pub display_text_range: Range,

    /// The valid display range expressed in UTF-16. After the end of the valid range, clients
    /// typically stop highlighting entities, etc.
    pub valid_text_range: Range
}

impl TwitterTextParseResults {
    /// A new TwitterTextParseResults struct with all fields supplied as arguments.
    pub fn new(weighted_length: i32,
               permillage: i32,
               is_valid: bool,
               display_text_range: Range,
               valid_text_range: Range) -> TwitterTextParseResults {
        TwitterTextParseResults {
            weighted_length,
            permillage,
            is_valid,
            display_text_range,
            valid_text_range
        }
    }

    /// An invalid TwitterTextParseResults struct. This function produces the return value when
    /// empty text or invalid UTF-8 is supplied to parse().
    pub fn empty() -> TwitterTextParseResults {
        TwitterTextParseResults {
            weighted_length: 0,
            permillage: 0,
            is_valid: false,
            display_text_range: Range::empty(),
            valid_text_range: Range::empty()
        }
    }
}

/**
 * Produce a [TwitterTextParseResults] struct from a [str]. If extract_urls is true, the weighted
 * length will give all URLs the weight supplied in [Configuration](twitter_text_configuration::Configuration),
 * regardless of their length.
 *
 * This function will allocate an NFC-normalized copy of the input string. If the text is already
 * NFC-normalized, [ValidatingExtractor::new_with_nfc_input] will be more efficient.
 */
pub fn parse(text: &str, config: &Configuration, extract_urls: bool) -> TwitterTextParseResults {
    let mut extractor = ValidatingExtractor::new(config);
    let input = extractor.prep_input(text);
    if extract_urls {
        extractor.extract_urls_with_indices(input.as_str()).parse_results
    } else {
        extractor.extract_scan(input.as_str()).parse_results
    }
}
