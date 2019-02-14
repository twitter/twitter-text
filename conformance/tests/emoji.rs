// Copyright 2019 Robert Sayre
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

extern crate twitter_text_parser;
extern crate pest;
use std::io;
use std::io::BufRead;
use std::u32;
use std::char;

use pest::Parser;
use pest::iterators::Pair;
use twitter_text_parser::twitter_text::TwitterTextParser;
use twitter_text_parser::twitter_text::Rule;

const EMOJI_TXT: &str = include_str!("unicode11-emoji-test.txt");

#[test]
fn test_emoji_parsing() {
    let f = io::BufReader::new(EMOJI_TXT.as_bytes());
    let emoji_strings: Vec<String> = f.lines()
        .filter_map(|result| result.ok())
        .filter(|s| !s.starts_with("#"))
        .filter(|s| !(s.trim().len() == 0))
        .map(|s| {
            let mut test_str = String::from("test|");
            match s.find(";") {
                Some(ss) => {
                    let code: String = s.chars().take(ss).collect();
                    let codes = code.trim().split(" ");
                    let chars: Vec<char> = codes.map(|sss| {
                        let digit = u32::from_str_radix(sss, 16).unwrap();
                        char::from_u32(digit).unwrap()
                    }).collect();

                    for c in chars {
                        test_str.push(c);
                    }
                    test_str.push_str("|test");
                },
                None => {}
            }

            test_str
        }).collect();

    for s in emoji_strings {
        let tree = TwitterTextParser::parse(Rule::tweet, &s).expect("Expected successful parse.");
        let tokens: Vec<Pair<Rule>> = tree.flatten().collect();
        let len = tokens.len();
        assert_eq!(3, len);
    }
}