// Copyright 2019 Robert Sayre
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

#![feature(range_contains)]

#[macro_use]
extern crate serde_derive;
extern crate serde_json;
extern crate serde;

#[macro_use]
extern crate lazy_static;

use std::cmp::Ordering;
use std::path::PathBuf;
use std::fmt;
use std::fs::File;
use std::io::Read;
use serde::ser::{Serialize, Serializer, SerializeStruct};
use serde::de::{self, Deserialize, Deserializer, Visitor, MapAccess};

const DEFAULT_VERSION: i32 = 2;
const DEFAULT_WEIGHTED_LENGTH: i32 = 280;
const DEFAULT_SCALE: i32 = 100;
const DEFAULT_WEIGHT: i32 = 200;
const DEFAULT_TRANSFORMED_URL_LENGTH: i32 = 23;
const V1_JSON: &str = include_str!("v1.json");
const V2_JSON: &str = include_str!("v2.json");
const V3_JSON: &str = include_str!("v3.json");

lazy_static! {
    static ref CONFIG_V1: Configuration = Configuration::configuration_from_str(V1_JSON);
    static ref CONFIG_V2: Configuration = Configuration::configuration_from_str(V2_JSON);
    static ref CONFIG_V3: Configuration = Configuration::configuration_from_str(V3_JSON);
}

pub fn config_v1() -> &'static Configuration {
    &CONFIG_V1
}

pub fn config_v2() -> &'static Configuration {
    &CONFIG_V2
}

pub fn config_v3() -> &'static Configuration {
    &CONFIG_V3
}

pub fn default() -> &'static Configuration {
    &CONFIG_V3
}

#[derive(Debug, PartialEq, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Configuration {
    pub version: i32,
    pub max_weighted_tweet_length: i32,
    pub scale: i32,
    pub default_weight: i32,
    #[serde(rename = "transformedURLLength")]
    pub transformed_url_length: i32,
    pub ranges: Vec<WeightedRange>,
    #[serde(default)]
    pub emoji_parsing_enabled: bool,
}

impl Configuration {
    pub fn default() -> Configuration {
        Configuration {
            version: DEFAULT_VERSION,
            max_weighted_tweet_length: DEFAULT_WEIGHTED_LENGTH,
            scale: DEFAULT_SCALE,
            default_weight: DEFAULT_WEIGHT,
            ranges: Configuration::default_ranges(),
            transformed_url_length: DEFAULT_TRANSFORMED_URL_LENGTH,
            emoji_parsing_enabled: true
        }
    }

    fn default_ranges() -> Vec<WeightedRange> {
         vec!(
            WeightedRange::new(0, 4351, 100),
            WeightedRange::new(8192, 8205, 100),
            WeightedRange::new(8208, 8223, 100),
            WeightedRange::new(8242, 8247, 100),
        )
    }

    pub fn configuration_from_json(config_file: &str) -> Configuration {
        let mut path = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
        path.push("config");
        path.push(config_file);
        Configuration::configuration_from_file(&path)
    }

    pub fn configuration_from_file(path: &PathBuf) -> Configuration {
        let mut f = File::open(path).expect("Config file not found");
        let mut contents = String::new();
        f.read_to_string(&mut contents).expect("Error reading config file");
        Configuration::configuration_from_str(&contents)
    }

    pub fn configuration_from_str(json: &str) -> Configuration {
        serde_json::from_str(&json).expect("Error parsing json")
    }
}

#[derive(Debug, PartialEq, Hash, Clone, Copy)]
pub struct WeightedRange {
    pub range: Range,
    pub weight: i32
}

impl WeightedRange {
    pub fn new(start: i32, end: i32, weight: i32) -> WeightedRange {
        WeightedRange {
            range: Range::new(start, end),
            weight
        }
    }

    pub fn contains(&self, i: i32) -> bool {
        self.range.contains(&i)
    }
}

impl Serialize for WeightedRange {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
        where
            S: Serializer,
    {
        let mut state = serializer.serialize_struct("WeightedRange", 3)?;
        state.serialize_field("start", &self.range.start())?;
        state.serialize_field("end", &self.range.end())?;
        state.serialize_field("weight", &self.weight)?;
        state.end()
    }
}

impl<'de> Deserialize<'de> for WeightedRange {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
        where
            D: Deserializer<'de>,
    {
        #[derive(Deserialize)]
        #[serde(field_identifier, rename_all = "lowercase")]
        enum Field { Start, End, Weight }

        struct WeightedRangeVisitor;
        impl<'de> Visitor<'de> for WeightedRangeVisitor {
            type Value = WeightedRange;

            fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
                formatter.write_str("struct WeightedRange")
            }

            fn visit_map<V>(self, mut map: V) -> Result<WeightedRange, V::Error>
                where
                    V: MapAccess<'de>,
            {
                let mut start = None;
                let mut end = None;
                let mut weight = None;
                while let Some(key) = map.next_key()? {
                    match key {
                        Field::Start => {
                            if start.is_some() {
                                return Err(de::Error::duplicate_field("start"));
                            }
                            start = Some(map.next_value()?);
                        }
                        Field::End => {
                            if end.is_some() {
                                return Err(de::Error::duplicate_field("end"));
                            }
                            end = Some(map.next_value()?);
                        }
                        Field::Weight => {
                            if weight.is_some() {
                                return Err(de::Error::duplicate_field("weight"));
                            }
                            weight = Some(map.next_value()?);
                        }
                    }
                }
                let start = start.ok_or_else(|| de::Error::missing_field("start"))?;
                let end = end.ok_or_else(|| de::Error::missing_field("end"))?;
                let weight = weight.ok_or_else(|| de::Error::missing_field("weight"))?;
                Ok(WeightedRange::new(start, end, weight))
            }
        }

        const FIELDS: &'static [&'static str] = &["start", "end", "weight"];
        deserializer.deserialize_struct("WeightedRange", FIELDS, WeightedRangeVisitor)
    }
}

#[derive(Debug, PartialEq, Hash, Eq, Clone, Copy)]
pub struct Range {
    start: i32,
    end: i32,
}

impl Range {
    pub fn empty() -> Range {
        Range { start: 0, end: 0 }
    }

    pub fn new( start: i32, end: i32 ) -> Range {
        Range { start, end }
    }

    pub fn contains(&self, val: &i32) -> bool {
        val >= &self.start && val <= &self.end
    }

    pub fn start(&self) -> i32 {
        self.start
    }

    pub fn end(&self) -> i32 {
        self.end
    }
}

impl Ord for Range {
    fn cmp(&self, other: &Self) -> Ordering {
        if self.start < other.start {
            Ordering::Less
        } else if self.start == other.start {
            if self.end < other.end {
                Ordering::Less
            } else if self.end < other.end {
                Ordering::Equal
            } else {
                Ordering::Greater
            }
        } else {
            Ordering::Greater
        }
    }
}

impl PartialOrd for Range {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}
