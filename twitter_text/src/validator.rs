// Copyright 2019 Robert Sayre
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

use twitter_text_config;
use parse;

use twitter_text_parser::twitter_text::TwitterTextParser;
use twitter_text_parser::twitter_text::Rule;
use pest::Parser;

const MAX_TWEET_LENGTH: i32 = 280;

pub struct Validator {
    short_url_length: i32,
    short_url_length_https: i32,
}

impl Validator {
    pub fn new() -> Validator {
        Validator {
            short_url_length: 23,
            short_url_length_https: 23
        }
    }

    pub fn is_valid_tweet(&self, s: &str) -> bool {
        parse(s, &twitter_text_config::config_v1(), false).is_valid
    }

    pub fn is_valid_username(&self, s: &str) -> bool {
        TwitterTextParser::parse(Rule::valid_username, s).is_ok()
    }

    pub fn is_valid_list(&self, s: &str) -> bool {
        TwitterTextParser::parse(Rule::valid_list, s).is_ok()
    }

    pub fn is_valid_hashtag(&self, s: &str) -> bool {
        TwitterTextParser::parse(Rule::hashtag, s).is_ok()
    }

    pub fn is_valid_url(&self, s: &str) -> bool {
        TwitterTextParser::parse(Rule::valid_url, s).is_ok()
    }

    pub fn is_valid_url_without_protocol(&self, s: &str) -> bool {
        TwitterTextParser::parse(Rule::url_without_protocol, s).is_ok()
    }

    pub fn get_max_tweet_length(&self) -> i32 { MAX_TWEET_LENGTH }

    pub fn get_short_url_length(&self) -> i32 {
        self.short_url_length
    }

    pub fn set_short_url_length(&mut self, short_url_length: i32) {
        self.short_url_length = short_url_length;
    }

    pub fn get_short_url_length_https(&self) -> i32 {
        self.short_url_length_https
    }

    pub fn set_short_url_length_https(&mut self, short_url_length_https: i32) {
        self.short_url_length_https = short_url_length_https;
    }
}