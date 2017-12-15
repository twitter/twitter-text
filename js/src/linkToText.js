import stringSupplant from './lib/stringSupplant';
import tagAttrs from './tagAttrs';

export default function (entity, text, attributes, options) {
  if (!options.suppressNoFollow) {
    attributes.rel = 'nofollow';
  }
  // if linkAttributeBlock is specified, call it to modify the attributes
  if (options.linkAttributeBlock) {
    options.linkAttributeBlock(entity, attributes);
  }
  // if linkTextBlock is specified, call it to get a new/modified link text
  if (options.linkTextBlock) {
    text = options.linkTextBlock(entity, text);
  }
  const d = {
    text: text,
    attr: tagAttrs(attributes)
  };
  return stringSupplant('<a#{attr}>#{text}</a>', d);
}
