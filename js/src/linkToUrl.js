// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import clone from './lib/clone';
import htmlEscape from './htmlEscape';
import linkToText from './linkToText';
import linkTextWithEntity from './linkTextWithEntity';
import urlHasProtocol from './regexp/urlHasProtocol';

export default function(entity, text, options) {
  let url = entity.url;
  const displayUrl = url;
  let linkText = htmlEscape(displayUrl);

  // If the caller passed a urlEntities object (provided by a Twitter API
  // response with include_entities=true), we use that to render the display_url
  // for each URL instead of it's underlying t.co URL.
  const urlEntity = (options.urlEntities && options.urlEntities[url]) || entity;
  if (urlEntity.display_url) {
    linkText = linkTextWithEntity(urlEntity, options);
  }

  const attrs = clone(options.htmlAttrs || {});

  if (!url.match(urlHasProtocol)) {
    url = `http://${url}`;
  }
  attrs.href = url;

  if (options.targetBlank) {
    attrs.target = '_blank';
  }

  // set class only if urlClass is specified.
  if (options.urlClass) {
    attrs['class'] = options.urlClass;
  }

  // set target only if urlTarget is specified.
  if (options.urlTarget) {
    attrs.target = options.urlTarget;
  }

  if (!options.title && urlEntity.display_url) {
    attrs.title = urlEntity.expanded_url;
  }

  return linkToText(entity, linkText, attrs, options);
}
