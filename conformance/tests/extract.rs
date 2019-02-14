// Copyright 2019 Robert Sayre
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

#[macro_use]
extern crate serde_derive;
extern crate serde_yaml;
extern crate serde;
extern crate twitter_text;

use twitter_text::extractor::Extract;
use twitter_text::extractor::Extractor;

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct Assertion {
    pub description: String,
    pub text: String,
    pub expected: Vec<serde_yaml::Value>,
}

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct MentionIndexExpectation {
    pub screen_name: String,
    pub indices: Vec<i32>,
}

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct MentionIndexAssertion {
    pub description: String,
    pub text: String,
    pub expected: Vec<MentionIndexExpectation>,
}

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct MentionOrListIndexExpectation {
    pub screen_name: String,
    pub list_slug: String,
    pub indices: Vec<i32>,
}

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct MentionOrListIndexAssertion {
    pub description: String,
    pub text: String,
    pub expected: Vec<MentionOrListIndexExpectation>,
}

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct ReplyAssertion {
    pub description: String,
    pub text: String,
    pub expected: Option<String>,
}

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct UrlAssertion {
    pub description: String,
    pub text: String,
    pub expected: Vec<String>,
}

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct UrlIndexExpectation {
    pub url: String,
    pub indices: Vec<i32>,
}

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct UrlIndexAssertion {
    pub description: String,
    pub text: String,
    pub expected: Vec<UrlIndexExpectation>,
}

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct TcoWithParamsAssertion {
    pub description: String,
    pub text: String,
    pub expected: Vec<serde_yaml::Value>,
}


#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct HashtagAssertion {
    pub description: String,
    pub text: String,
    pub expected: Vec<String>,
}

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct HashtagIndexExpectation {
    pub hashtag: String,
    pub indices: Vec<i32>,
}

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct HashtagIndexAssertion {
    pub description: String,
    pub text: String,
    pub expected: Vec<HashtagIndexExpectation>,
}

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct CashtagAssertion {
    pub description: String,
    pub text: String,
    pub expected: Vec<String>,
}

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct CashtagIndexExpectation {
    pub cashtag: String,
    pub indices: Vec<i32>,
}

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct CashtagIndexAssertion {
    pub description: String,
    pub text: String,
    pub expected: Vec<CashtagIndexExpectation>,
}

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct Tests {
    pub mentions: Vec<Assertion>,
    pub mentions_with_indices: Vec<MentionIndexAssertion>,
    pub mentions_or_lists_with_indices: Vec<MentionOrListIndexAssertion>,
    pub replies: Vec<ReplyAssertion>,
    pub urls: Vec<UrlAssertion>,
    pub urls_with_indices: Vec<UrlIndexAssertion>,
    pub urls_with_directional_markers: Vec<UrlIndexAssertion>,
    pub tco_urls_with_params: Vec<TcoWithParamsAssertion>,
    pub hashtags: Vec<HashtagAssertion>,
    pub hashtags_from_astral: Vec<HashtagAssertion>,
    pub hashtags_with_indices: Vec<HashtagIndexAssertion>,
    pub cashtags: Vec<CashtagAssertion>,
    pub cashtags_with_indices: Vec<CashtagIndexAssertion>
}

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct Manifest {
    pub tests: Tests
}

const MANIFEST_YML: &str = include_str!("extract.yml");

#[test]
fn extract() {
    let manifest: Manifest = serde_yaml::from_str(MANIFEST_YML).expect("Error parsing yaml");
    for mention_assertion in manifest.tests.mentions {
        let extractor = Extractor::new();
        let entities = extractor.extract_mentioned_screennames(&mention_assertion.text);
        assert_eq!(entities.len(), mention_assertion.expected.len(), "{}", mention_assertion.description);
        for (idx, entity) in entities.iter().enumerate() {
            assert_eq!(entity.get_value(), mention_assertion.expected[idx].as_str().unwrap(), "{}", mention_assertion.description);
        }
    }

    for mention_assertion in manifest.tests.mentions_with_indices {
        let extractor = Extractor::new();
        let entities = extractor.extract_mentioned_screennames_with_indices(&mention_assertion.text);
        assert_eq!(entities.len(), mention_assertion.expected.len(), "{}", mention_assertion.description);
        for (idx, entity) in entities.iter().enumerate() {
            assert_eq!(entity.get_value(), mention_assertion.expected[idx].screen_name.as_str(), "{}", mention_assertion.description);
            assert_eq!(entity.get_start(), mention_assertion.expected[idx].indices[0], "{}", mention_assertion.description);
            assert_eq!(entity.get_end(), mention_assertion.expected[idx].indices[1], "{}", mention_assertion.description);
        }
    }

    for mention_assertion in manifest.tests.mentions_or_lists_with_indices {
        let extractor = Extractor::new();
        let mentions = extractor.extract_mentions_or_lists_with_indices(&mention_assertion.text);
        assert_eq!(mentions.len(), mention_assertion.expected.len(), "{}", mention_assertion.description);
        for (idx, entity) in mentions.iter().enumerate() {
            if "" != mention_assertion.expected[idx].list_slug.as_str() {
                assert_eq!(entity.get_value(), mention_assertion.expected[idx].screen_name.as_str(), "{}", mention_assertion.description);
                assert_eq!(entity.get_list_slug(), mention_assertion.expected[idx].list_slug.as_str(), "{}", mention_assertion.description);
                assert_eq!(entity.get_start(), mention_assertion.expected[idx].indices[0], "{}", mention_assertion.description);
                assert_eq!(entity.get_end(), mention_assertion.expected[idx].indices[1], "{}", mention_assertion.description);
            }
        }
    }

    for reply_assertion in manifest.tests.replies {
        let extractor = Extractor::new();
        let reply = extractor.extract_reply_username(&reply_assertion.text);
        match reply {
            Some(r) => assert_eq!(r.get_value(), reply_assertion.expected.unwrap(), "{}", reply_assertion.description),
            None => assert_eq!(None, reply_assertion.expected, "{}", reply_assertion.description)
        }
    }

    for url_assertion in manifest.tests.urls {
        let extractor = Extractor::new();
        let urls = extractor.extract_urls(&url_assertion.text);
        assert_eq!(urls.len(), url_assertion.expected.len(), "{}", url_assertion.description);
        for (idx, url) in urls.iter().enumerate() {
            assert_eq!(url, url_assertion.expected[idx].as_str(), "{}", url_assertion.description);
        }
    }

    for url_assertion in manifest.tests.urls_with_indices {
        let extractor = Extractor::new();
        let entities = extractor.extract_urls_with_indices(&url_assertion.text);
        assert_eq!(entities.len(), url_assertion.expected.len(), "{}", url_assertion.description);
        for (idx, entity) in entities.iter().enumerate() {
            assert_eq!(entity.get_value(), url_assertion.expected[idx].url.as_str(), "{}", url_assertion.description);
            assert_eq!(entity.get_start(), url_assertion.expected[idx].indices[0], "{}", url_assertion.description);
            assert_eq!(entity.get_end(), url_assertion.expected[idx].indices[1], "{}", url_assertion.description);
        }
    }

    for url_assertion in manifest.tests.urls_with_directional_markers {
        let extractor = Extractor::new();
        let entities = extractor.extract_urls_with_indices(&url_assertion.text);
        assert_eq!(entities.len(), url_assertion.expected.len(), "{}", url_assertion.description);
        for (idx, entity) in entities.iter().enumerate() {
            assert_eq!(entity.get_value(), url_assertion.expected[idx].url.as_str(), "{}", url_assertion.description);
            assert_eq!(entity.get_start(), url_assertion.expected[idx].indices[0], "{}", url_assertion.description);
            assert_eq!(entity.get_end(), url_assertion.expected[idx].indices[1], "{}", url_assertion.description);
        }
    }

    for tco_assertion in manifest.tests.tco_urls_with_params {
        let extractor = Extractor::new();
        let entities = extractor.extract_urls_with_indices(&tco_assertion.text);
        assert_eq!(entities.len(), tco_assertion.expected.len(), "{}", tco_assertion.description);
        for (idx, entity) in entities.iter().enumerate() {
            assert_eq!(entity.get_value(), tco_assertion.expected[idx].as_str().unwrap(), "{}", tco_assertion.description);
        }
    }

    for hashtag_assertion in manifest.tests.hashtags {
        let extractor = Extractor::new();
        let entities = extractor.extract_hashtags(&hashtag_assertion.text);
        assert_eq!(entities.len(), hashtag_assertion.expected.len(), "{}", hashtag_assertion.description);
        for (idx, entity) in entities.iter().enumerate() {
            assert_eq!(entity.get_value(), hashtag_assertion.expected[idx].as_str(), "{}", hashtag_assertion.description);
        }
    }

    for hashtag_assertion in manifest.tests.hashtags_from_astral {
        let extractor = Extractor::new();
        let entities = extractor.extract_hashtags(&hashtag_assertion.text);
        assert_eq!(entities.len(), hashtag_assertion.expected.len(), "{}", hashtag_assertion.description);
        for (idx, entity) in entities.iter().enumerate() {
            assert_eq!(entity.get_value(), hashtag_assertion.expected[idx].as_str(), "{}", hashtag_assertion.description);
        }
    }

    for hashtag_assertion in manifest.tests.hashtags_with_indices {
        let extractor = Extractor::new();
        let entities = extractor.extract_hashtags(&hashtag_assertion.text);
        assert_eq!(entities.len(), hashtag_assertion.expected.len(), "{}", hashtag_assertion.description);
        for (idx, entity) in entities.iter().enumerate() {
            assert_eq!(entity.get_value(), hashtag_assertion.expected[idx].hashtag.as_str(), "{}", hashtag_assertion.description);
            assert_eq!(entity.get_start(), hashtag_assertion.expected[idx].indices[0], "{}", hashtag_assertion.description);
            assert_eq!(entity.get_end(), hashtag_assertion.expected[idx].indices[1], "{}", hashtag_assertion.description);
        }
    }

    for cashtag_assertion in manifest.tests.cashtags {
        let extractor = Extractor::new();
        let entities = extractor.extract_cashtags(&cashtag_assertion.text);
        assert_eq!(entities.len(), cashtag_assertion.expected.len(), "{}", cashtag_assertion.description);
        for (idx, entity) in entities.iter().enumerate() {
            assert_eq!(entity.get_value(), cashtag_assertion.expected[idx].as_str(), "{}", cashtag_assertion.description);
        }
    }

    for cashtag_assertion in manifest.tests.cashtags_with_indices {
        let extractor = Extractor::new();
        let entities = extractor.extract_cashtags(&cashtag_assertion.text);
        assert_eq!(entities.len(), cashtag_assertion.expected.len(), "{}", cashtag_assertion.description);
        for (idx, entity) in entities.iter().enumerate() {
            assert_eq!(entity.get_value(), cashtag_assertion.expected[idx].cashtag.as_str(), "{}", cashtag_assertion.description);
            assert_eq!(entity.get_start(), cashtag_assertion.expected[idx].indices[0], "{}", cashtag_assertion.description);
            assert_eq!(entity.get_end(), cashtag_assertion.expected[idx].indices[1], "{}", cashtag_assertion.description);
        }
    }
}