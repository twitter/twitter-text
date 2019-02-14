// Copyright 2019 Robert Sayre
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

#[macro_use]
extern crate serde_derive;
extern crate serde_yaml;
extern crate serde;
extern crate twitter_text;

use twitter_text::extractor::Extractor;

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct Assertion {
    pub description: String,
    pub text: String,
    pub expected: Vec<serde_yaml::Value>,
}

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct Tests {
    pub country: Vec<Assertion>,
    pub generic: Vec<Assertion>,
}

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct Manifest {
    pub tests: Tests
}

const MANIFEST_YML: &str = include_str!("tlds.yml");

fn tld_check(assertions: Vec<Assertion>) {
    let extractor = Extractor::new();
    for assertion in assertions {
        let url_text = extractor.extract_urls(&assertion.text);
        println!("{}", assertion.description);
        assert_eq!(url_text[0], assertion.expected[0].as_str().unwrap(), "{}", assertion.description);
    }
}

#[test]
fn tlds() {
    let manifest: Manifest = serde_yaml::from_str(MANIFEST_YML).expect("Error parsing yaml");
    tld_check(manifest.tests.country);
    tld_check(manifest.tests.generic);
}
