// Copyright 2019 Robert Sayre
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

#[macro_use]
extern crate serde_derive;
extern crate serde_yaml;
extern crate serde;
extern crate twitter_text;
extern crate twitter_text_config;

use twitter_text::validator::Validator;

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct Assertion {
    pub description: String,
    pub text: String,
    pub expected: bool,
}

#[derive(Debug, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WeightedTweetExpectation {
    pub weighted_length: i32,
    pub valid: bool,
    pub permillage: i32,
    pub display_range_start: i32,
    pub display_range_end: i32,
    pub valid_range_start: i32,
    pub valid_range_end: i32,
}

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct WeightedTweetAssertion {
    pub description: String,
    pub text: String,
    pub expected: WeightedTweetExpectation,
}

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct Tests {
    pub tweets: Vec<Assertion>,
    pub usernames: Vec<Assertion>,
    pub lists: Vec<Assertion>,
    pub hashtags: Vec<Assertion>,
    pub urls: Vec<Assertion>,
    pub urls_without_protocol: Vec<Assertion>,
    #[serde(rename = "WeightedTweetsCounterTest")]
    pub weighted_tweets_counter_test: Vec<WeightedTweetAssertion>,
    #[serde(rename = "WeightedTweetsWithDiscountedEmojiCounterTest")]
    pub weighted_tweets_with_discounted_emoji_counter_test: Vec<WeightedTweetAssertion>,
    #[serde(rename = "UnicodeDirectionalMarkerCounterTest")]
    pub unicode_directional_marker_counter_test: Vec<WeightedTweetAssertion>,
}

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct Manifest {
    pub tests: Tests
}

const MANIFEST_YML: &str = include_str!("validate.yml");

type ValidationFn<'a> = std::ops::Fn(&str) -> bool + 'a;

fn validate(assertions: Vec<Assertion>, vf: &ValidationFn) {
    for assertion in assertions {
        let result = vf(&assertion.text);
        assert_eq!(assertion.expected, result, "{}", assertion.description);
    }
}

#[test]
fn test_validator() {
    let manifest: Manifest = serde_yaml::from_str(MANIFEST_YML).expect("Error parsing yaml");
    let validator = Validator::new();

    validate(manifest.tests.tweets, &|s|{ validator.is_valid_tweet(s) } );
    validate(manifest.tests.usernames, &|s|{ validator.is_valid_username(s) });
    validate(manifest.tests.lists, &|s|{ validator.is_valid_list(s) });
    validate(manifest.tests.hashtags, &|s|{ validator.is_valid_hashtag(s) });
    validate(manifest.tests.urls, &|s|{ validator.is_valid_url(s) });
    validate(manifest.tests.urls_without_protocol, &|s|{ validator.is_valid_url_without_protocol(s) });
}

fn validate_weighting(assertions: Vec<WeightedTweetAssertion>, config: &twitter_text_config::Configuration) {
    for assertion in assertions {
        let expected = assertion.expected;
        let message = assertion.description;
        let result = twitter_text::parse(assertion.text.as_str(), config, true);
        assert_eq!(expected.weighted_length, result.weighted_length, "{}", message);
        assert_eq!(expected.valid, result.is_valid, "{}", message);
        assert_eq!(expected.permillage, result.permillage, "{}", message);
        assert_eq!(expected.display_range_start, result.display_text_range.start(), "{}", message);
        assert_eq!(expected.display_range_end, result.display_text_range.end(), "{}", message);
        assert_eq!(expected.valid_range_start, result.valid_text_range.start(), "{}", message);
        assert_eq!(expected.valid_range_end, result.valid_text_range.end(), "{}", message);
    }
}

#[test]
fn test_weighting() {
    let manifest: Manifest = serde_yaml::from_str(MANIFEST_YML).expect("Error parsing yaml");
    let v2 = twitter_text_config::config_v2();
    let v3 = twitter_text_config::config_v3();
    validate_weighting(manifest.tests.weighted_tweets_counter_test, v2);
    validate_weighting(manifest.tests.weighted_tweets_with_discounted_emoji_counter_test, v3);
    validate_weighting(manifest.tests.unicode_directional_marker_counter_test, v3);
}
