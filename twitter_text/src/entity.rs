// Copyright 2019 Robert Sayre
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

#[derive(Copy, Clone, PartialEq, Eq, Hash, Debug)]
pub enum Type {
    URL,
    HASHTAG,
    MENTION,
    CASHTAG
}

#[derive(PartialEq, Eq, Hash, Clone, Debug)]
pub struct Entity<'a> {
    pub t: Type,
    pub start: i32,
    pub end: i32,
    pub value: &'a str,
    pub list_slug: &'a str,
    pub display_url: &'a str,
    pub expanded_url: &'a str
}

impl<'a> Entity<'a> {
    pub fn get_type(&self) -> Type { self.t }
    pub fn get_start(&self) -> i32 { self.start }
    pub fn get_end(&self) -> i32 { self.end }
    pub fn get_value(&self) -> &str { &self.value }
    pub fn get_list_slug(&self) -> &'a str {
        &self.list_slug
    }
    pub fn get_display_url(&self) -> &'a str {
        &self.display_url
    }
    pub fn get_expanded_url(&self) -> &'a str {
        &self.expanded_url
    }

    pub fn new(t: Type, value: &'a str, start: i32, end: i32) -> Entity<'a> {
        Entity::new_list(t, value, "", start, end)
    }

    pub fn new_list(t: Type, value: &'a str, list_slug: &'a str, start: i32, end: i32) -> Entity<'a> {
        Entity {
            t, value, list_slug, start, end,
            display_url: "",
            expanded_url: ""
        }
    }
}
