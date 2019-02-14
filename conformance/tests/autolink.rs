// Copyright 2019 Robert Sayre
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

#[macro_use]
extern crate serde_derive;
extern crate serde_yaml;
extern crate serde;
extern crate twitter_text;

use twitter_text::autolinker::Autolinker;

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct Assertion {
    pub description: String,
    pub text: String,
    pub expected: String,
}

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct JsonAssertion {
    pub description: String,
    pub text: String,
    pub json: String,
    pub expected: String,
}

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct Tests {
    pub usernames: Vec<Assertion>,
    pub lists: Vec<Assertion>,
    pub hashtags: Vec<Assertion>,
    pub urls: Vec<Assertion>,
    pub cashtags: Vec<Assertion>,
    pub all: Vec<Assertion>,
    pub json: Vec<JsonAssertion>,
}

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct Manifest {
    pub tests: Tests
}

const MANIFEST_YML: &str = include_str!("autolink.yml");

#[test]
fn autolink() {
    let manifest: Manifest = serde_yaml::from_str(MANIFEST_YML).expect("Error parsing yaml");

    for assertion in manifest.tests.usernames {
        let autolinker = Autolinker::new(false);
        let text = autolinker.autolink_usernames_and_lists(&assertion.text);
        assert_eq!(text, assertion.expected, "{}", assertion.description);
    }

    for assertion in manifest.tests.lists {
        let autolinker = Autolinker::new(false);
        let text = autolinker.autolink_usernames_and_lists(&assertion.text);
        assert_eq!(text, assertion.expected, "{}", assertion.description);
    }

    for assertion in manifest.tests.hashtags {
        let autolinker = Autolinker::new(false);
        let text = autolinker.autolink_hashtags(&assertion.text);
        assert_eq!(text, assertion.expected, "{}", assertion.description);
    }

    for assertion in manifest.tests.urls {
        let autolinker = Autolinker::new(false);
        let text = autolinker.autolink_urls(&assertion.text);
        assert_eq!(text, assertion.expected, "{}", assertion.description);
    }

    for assertion in manifest.tests.cashtags {
        let autolinker = Autolinker::new(false);
        let text = autolinker.autolink_cashtags(&assertion.text);
        assert_eq!(text, assertion.expected, "{}", assertion.description);
    }

    for assertion in manifest.tests.all {
        let autolinker = Autolinker::new(false);
        let text = autolinker.autolink(&assertion.text);
        assert_eq!(text, assertion.expected, "{}", assertion.description);
    }
}