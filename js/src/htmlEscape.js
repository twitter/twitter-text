// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

const HTML_ENTITIES = {
  '&': '&amp;',
  '>': '&gt;',
  '<': '&lt;',
  '"': '&quot;',
  "'": '&#39;'
};

export default function(text) {
  return (
    text &&
    text.replace(/[&"'><]/g, function(character) {
      return HTML_ENTITIES[character];
    })
  );
}
