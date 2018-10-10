// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

// simple string interpolation
export default function(str, map) {
  return str.replace(/#\{(\w+)\}/g, function(match, name) {
    return map[name] || '';
  });
}
