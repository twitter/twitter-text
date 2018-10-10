// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

export default function(entities) {
  entities.sort(function(a, b) {
    return a.indices[0] - b.indices[0];
  });

  let prev = entities[0];
  for (let i = 1; i < entities.length; i++) {
    if (prev.indices[1] > entities[i].indices[0]) {
      entities.splice(i, 1);
      i--;
    } else {
      prev = entities[i];
    }
  }
}
