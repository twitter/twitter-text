// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

import splitTags from './splitTags';

export default function(text, hits, options) {
  const defaultHighlightTag = 'em';

  hits = hits || [];
  options = options || {};

  if (hits.length === 0) {
    return text;
  }

  let tagName = options.tag || defaultHighlightTag,
    tags = [`<${tagName}>`, `</${tagName}>`],
    chunks = splitTags(text),
    i,
    j,
    result = '',
    chunkIndex = 0,
    chunk = chunks[0],
    prevChunksLen = 0,
    chunkCursor = 0,
    startInChunk = false,
    chunkChars = chunk,
    flatHits = [],
    index,
    hit,
    tag,
    placed,
    hitSpot;

  for (i = 0; i < hits.length; i += 1) {
    for (j = 0; j < hits[i].length; j += 1) {
      flatHits.push(hits[i][j]);
    }
  }

  for (index = 0; index < flatHits.length; index += 1) {
    hit = flatHits[index];
    tag = tags[index % 2];
    placed = false;

    while (chunk != null && hit >= prevChunksLen + chunk.length) {
      result += chunkChars.slice(chunkCursor);
      if (startInChunk && hit === prevChunksLen + chunkChars.length) {
        result += tag;
        placed = true;
      }

      if (chunks[chunkIndex + 1]) {
        result += `<${chunks[chunkIndex + 1]}>`;
      }

      prevChunksLen += chunkChars.length;
      chunkCursor = 0;
      chunkIndex += 2;
      chunk = chunks[chunkIndex];
      chunkChars = chunk;
      startInChunk = false;
    }

    if (!placed && chunk != null) {
      hitSpot = hit - prevChunksLen;
      result += chunkChars.slice(chunkCursor, hitSpot) + tag;
      chunkCursor = hitSpot;
      if (index % 2 === 0) {
        startInChunk = true;
      } else {
        startInChunk = false;
      }
    } else if (!placed) {
      placed = true;
      result += tag;
    }
  }

  if (chunk != null) {
    if (chunkCursor < chunkChars.length) {
      result += chunkChars.slice(chunkCursor);
    }
    for (index = chunkIndex + 1; index < chunks.length; index += 1) {
      result += index % 2 === 0 ? chunks[index] : `<${chunks[index]}>`;
    }
  }

  return result;
}
