export default function (text, entities, indicesInUTF16) {
  if (entities.length == 0) {
    return;
  }

  let charIndex = 0;
  let codePointIndex = 0;

  // sort entities by start index
  entities.sort(function (a, b) { return a.indices[0] - b.indices[0]; });
  let entityIndex = 0;
  let entity = entities[0];

  while (charIndex < text.length) {
    if (entity.indices[0] == (indicesInUTF16 ? charIndex : codePointIndex)) {
      const len = entity.indices[1] - entity.indices[0];
      entity.indices[0] = indicesInUTF16 ? codePointIndex : charIndex;
      entity.indices[1] = entity.indices[0] + len;

      entityIndex++;
      if (entityIndex == entities.length) {
        // no more entity
        break;
      }
      entity = entities[entityIndex];
    }

    let c = text.charCodeAt(charIndex);
    if (c >= 0xD800 && c <= 0xDBFF && charIndex < text.length - 1) {
      // Found high surrogate char
      c = text.charCodeAt(charIndex + 1);
      if (c >= 0xDC00 && c <= 0xDFFF) {
        // Found surrogate pair
        charIndex++;
      }
    }
    codePointIndex++;
    charIndex++;
  }
}
