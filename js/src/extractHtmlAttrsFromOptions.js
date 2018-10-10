// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

const BOOLEAN_ATTRIBUTES = {
  disabled: true,
  readonly: true,
  multiple: true,
  checked: true
};

// Options which should not be passed as HTML attributes
const OPTIONS_NOT_ATTRIBUTES = {
  urlClass: true,
  listClass: true,
  usernameClass: true,
  hashtagClass: true,
  cashtagClass: true,
  usernameUrlBase: true,
  listUrlBase: true,
  hashtagUrlBase: true,
  cashtagUrlBase: true,
  usernameUrlBlock: true,
  listUrlBlock: true,
  hashtagUrlBlock: true,
  linkUrlBlock: true,
  usernameIncludeSymbol: true,
  suppressLists: true,
  suppressNoFollow: true,
  targetBlank: true,
  suppressDataScreenName: true,
  urlEntities: true,
  symbolTag: true,
  textWithSymbolTag: true,
  urlTarget: true,
  invisibleTagAttrs: true,
  linkAttributeBlock: true,
  linkTextBlock: true,
  htmlEscapeNonEntities: true
};

export default function(options) {
  const htmlAttrs = {};
  for (const k in options) {
    let v = options[k];
    if (OPTIONS_NOT_ATTRIBUTES[k]) {
      continue;
    }
    if (BOOLEAN_ATTRIBUTES[k]) {
      v = v ? k : null;
    }
    if (v == null) {
      continue;
    }
    htmlAttrs[k] = v;
  }
  return htmlAttrs;
}
