// Copyright 2019 Robert Sayre
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

extern crate pest;
use pest::Parser;
use pest::iterators::Pairs;
use twitter_text_parser::highlighter::HighlightParser;
use twitter_text_parser::highlighter::Rule;

type Hit = (usize, usize);
const DEFAULT_HIGHLIGHT_TAG: &str = "em";

pub struct HitHighlighter<'a> {
    highlight_tag: &'a str,
}

impl<'a> HitHighlighter<'a> {
    pub fn new() -> HitHighlighter<'a> {
        HitHighlighter {
            highlight_tag: DEFAULT_HIGHLIGHT_TAG,
        }
    }

    pub fn highlight(&self, text: &str, hits: Vec<Hit>) -> String {
        if hits.is_empty() {
            return String::from(text);
        }

        let mut builder = HighlightBuilder::new(text, self.highlight_tag, &hits);
        match HighlightParser::parse(Rule::hit_text, text) {
            Ok(pairs) => {
                self.walk(pairs, &hits[..], &mut builder);
            }
            Err(e) => {
                println!("Error, {}", e);
            }
        }

        builder.buffer()
    }

    fn walk(&self, pairs: Pairs<Rule>, hits: &[(Hit)], builder: &mut HighlightBuilder) -> usize {
        let mut start = 0;
        let mut tag_open = false;

        for pair in pairs {
            let rule = pair.as_rule();
            match rule {
                Rule::element => start += self.walk(pair.into_inner(), &hits[start..], builder),
                Rule::start_tag => builder.append_tag(pair.into_span().as_str()),
                Rule::end_tag => builder.append_tag(pair.into_span().as_str()),
                Rule::text => {
                    let span = pair.into_span();
                    for c in span.as_str().chars() {
                        if builder.count() == hits.get(start).unwrap_or(&(0, 0)).0 {
                            builder.append_open();
                            tag_open = true;
                            start += 1;
                        }
                        builder.append_char(c);
                        if tag_open && builder.count() == hits[start - 1].1 {
                            builder.append_close();
                            tag_open = false;
                        }
                    }
                }
                Rule::EOI => {
                    if tag_open && builder.count() == hits[start - 1].1 {
                        builder.append_close();
                    }
                }
                _ => unreachable!("Should only match silent rules.")
            }
        }

        start
    }
}

struct HighlightBuilder {
    buffer: String,
    char_count: usize,
    open: String,
    close: String
}

impl HighlightBuilder {
    fn new(text: &str, tag: &str, hits: &Vec<(Hit)>) -> HighlightBuilder {
        let capacity = text.len() + (hits.len() * (tag.len() + 2 + tag.len() + 3));
        HighlightBuilder {
            buffer: String::with_capacity(capacity),
            char_count: 0,
            open: ["<", tag, ">"].join(""),
            close: ["</", tag, ">"].join(""),
        }
    }

    fn append_open(&mut self) {
        self.buffer.push_str(self.open.as_str());
    }

    fn append_close(&mut self) {
        self.buffer.push_str(self.close.as_str());
    }

    fn append_tag(&mut self, text: &str) {
        self.buffer.push_str(text);
    }

    fn append_char(&mut self, c: char) {
        self.buffer.push(c);
        self.char_count += 1;
    }

    fn count(&self) -> usize {
        self.char_count
    }

    fn buffer(self) -> String {
        self.buffer
    }
}
