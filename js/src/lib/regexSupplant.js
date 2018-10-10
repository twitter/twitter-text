// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

// Builds a RegExp
export default function(regex, map, flags) {
  flags = flags || '';
  if (typeof regex !== 'string') {
    if (regex.global && flags.indexOf('g') < 0) {
      flags += 'g';
    }
    if (regex.ignoreCase && flags.indexOf('i') < 0) {
      flags += 'i';
    }
    if (regex.multiline && flags.indexOf('m') < 0) {
      flags += 'm';
    }

    regex = regex.source;
  }

  return new RegExp(
    regex.replace(/#\{(\w+)\}/g, function(match, name) {
      let newRegex = map[name] || '';
      if (typeof newRegex !== 'string') {
        newRegex = newRegex.source;
      }
      return newRegex;
    }),
    flags
  );
}
